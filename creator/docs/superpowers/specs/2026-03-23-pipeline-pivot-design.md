# Creator Agent — 파이프라인 전환 설계

> Storybook 디자인 시스템 기반 HTML 슬라이드 + Remotion 렌더링 + 나레이션 동기화
> 작성일: 2026-03-23

---

## 1. 개요

### 전환 배경

현재 Remotion이 자체 30종 레이아웃 + 15종 애니메이션을 독자 구현하고 있으나, Storybook 디자인 시스템에 이미 체계적인 자산(22개 팔레트, 18종 레이아웃 패턴, 14종 컴포넌트, 텍스트 역할 체계, 반복 방지 규칙 등)이 존재한다. Remotion의 독자 구현을 걷어내고 Storybook 컴포넌트를 직접 사용하여 **디자인 시스템 = Single Source of Truth**로 통합한다.

### 최종 산출물

주제 입력 → 대본 → 슬라이드 JSON → MP4 영상 (나레이션 + 자막 + 화면 연출 동기화)

### 접근법

**Direct Import** — Remotion이 storybook-ds의 토큰·컴포넌트·레이아웃을 상대 경로(tsconfig paths)로 직접 import. Remotion은 `useCurrentFrame()` 기반 애니메이션 래퍼만 담당.

### 핵심 제약사항

1. **토큰 기준:** storybook-ds/src/tokens/가 유일한 Source of Truth. VISUAL_SPEC.md(Deep Black + Neon Green)는 Remotion 전용이었으므로 폐기. 스토리북 팔레트(22종)로 테마 전환.
2. **지원 레이아웃:** `contentLayoutMap`이 정의하는 18종 패턴 중 컴포넌트가 존재하는 14종만 사용. `md-to-slides.js`는 importMap에 등록된 레이아웃만 출력하도록 필터링.
3. **cue 기본값:** cue가 없는 요소는 즉시 표시 (`opacity: 1`). cue가 있는 요소만 지정된 시점에 애니메이션으로 등장.

---

## 2. 파이프라인

```
[입력] 주제 + 벤치마킹 채널 소스
    ↓
[1] 대본 생성 ─── profiles/character-v1.json + maker-evan.json 기반
    │               scripts/topic.md 출력
    │               (씬별 레이아웃 지시 — storybook 레이아웃명 사용)
    ↓
[2] 슬라이드 변환 ─ md-to-slides.js
    │               storybook의 contentLayoutMap + sequenceRules 참조
    │               slides/topic.slides.json 출력
    ↓
[3] TTS 음성 합성 ─ Qwen3
    │               씬별 WAV + word-level 타임스탬프 JSON 출력
    ↓
[4] cue 주입 ────── inject-cues.js
    │               TTS 타임스탬프 → slides.json에 timing.cues 주입
    ↓
[5] Remotion 렌더링 ─ storybook-ds 컴포넌트 직접 import
    │                  cue 기반 애니메이션 + 자막 내장
    │                  out/topic.mp4 출력
    ↓
[6] 오디오 합성 ─── ffmpeg (영상 + TTS 오디오 → 최종 MP4)
```

### 실행 명령

```bash
# 1. 대본 → 슬라이드 JSON
node leanslide/md-to-slides.js ./scripts/topic.md

# 2. TTS 생성 (씬별 WAV + 타임스탬프)
node tts/generate.js scripts/topic.md

# 3. cue 주입
node leanslide/inject-cues.js slides/topic.slides.json tts/output/

# 4. Remotion 렌더링
npx remotion render SlideVideo out/topic.mp4 \
  --props=./slides/topic.slides.json

# 5. 오디오 합성
ffmpeg -i out/topic.mp4 -i tts/output/merged.wav \
  -c:v copy -c:a aac out/topic-final.mp4
```

---

## 3. 나레이션-동기 애니메이션 (cue 시스템)

### 개념

cue = "나레이션 특정 시점에 화면 요소를 움직이라는 신호". TTS의 word-level 타임스탬프가 기준점이 되어 화면 연출 타이밍을 결정한다.

### slides.json 스키마

```json
{
  "meta": {
    "title": "string",
    "theme": "creator | memphis | ...",
    "font": "Noto Sans KR",
    "totalSlides": "number"
  },
  "slides": [
    {
      "id": "number",
      "layout": "storybook 레이아웃명",
      "content": {
        "tag": "string",
        "title": "string",
        "description": "string",
        "items": [{ "title": "string", "description": "string" }],
        "command": "string (CLI용)",
        "badge": "string"
      },
      "timing": {
        "startMs": "number",
        "endMs": "number",
        "cues": [
          {
            "ms": "number (절대 시점)",
            "target": "headline | item-N | cli | step-N | badge",
            "action": "fadeIn | slideUp | typeIn | clickSim | staggerReveal"
          }
        ]
      }
    }
  ]
}
```

### cue 자동 생성 규칙

| 대본 패턴 | target | action |
|-----------|--------|--------|
| 씬 첫 문장 | `headline` | `fadeIn` |
| N번째 나열 항목 문장 시작 | `item-N` | `slideUp` |
| decorative.cli 지시 매칭 문장 | `cli` | `typeIn` |
| "첫째/둘째/셋째" 또는 번호 등장 | `step-N` | `staggerReveal` |
| "클릭하면" 등 인터랙션 언급 | `mockup` | `clickSim` |

### Remotion 래퍼 패턴

```typescript
// CueContext — cue 프레임 계산 + React Context
function AnimatedSlide({ slide, children }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueFrames = slide.timing.cues.map(cue => ({
    ...cue,
    frame: Math.round((cue.ms - slide.timing.startMs) / 1000 * fps),
  }));

  return (
    <CueContext.Provider value={{ frame, cues: cueFrames }}>
      {children}
    </CueContext.Provider>
  );
}

// useCue hook — target별 현재 상태 조회
function useCue(target: string, config: ActionConfig) {
  const { frame, cues } = useContext(CueContext);
  const cue = cues.find(c => c.target === target);
  if (!cue) return { opacity: 1, transform: 'none' }; // cue 없으면 즉시 표시
  // interpolate로 현재 프레임의 상태 계산
  return computeStyle(frame, cue, config);
}
```

### 특별 연출 3종

| 연출 | 나레이션 트리거 | 동작 |
|------|----------------|------|
| 프로세스 단계 | "첫째는..." "둘째는..." | NumberBadge + GlassCard 순차 등장 |
| CLI 타이핑 | "명령어를 실행하면..." | CliPrompt 한 글자씩 타이핑 |
| 클릭/인터랙션 | "여기를 클릭하면..." | 커서 이동 → 클릭 ripple → 결과 등장 |

---

## 4. 디렉토리 구조

### 유지

```
storybook-ds/                        ← 디자인 시스템 (Source of Truth)
├── src/tokens/                      ← 토큰, 그리드, 팔레트, 레이아웃 규칙
│   ├── tokens.ts                    ← colors, spacing, fontSize, fontWeight
│   ├── grid.ts                      ← 12col 1920×1080, span(), splits
│   ├── palettes.ts                  ← 22개 팔레트
│   ├── layout-variations.ts         ← 18종 패턴, contentLayoutMap, sequenceRules
│   ├── component-rules.ts           ← 컴포넌트 규칙 13종
│   └── typography-rules.ts          ← 타이포그래피 규칙
├── src/components/                  ← UI 프리미티브 9종
│   ├── SlideBase.tsx
│   ├── GlassCard.tsx
│   ├── GradientText.tsx
│   ├── GradientDivider.tsx
│   ├── NumberBadge.tsx
│   ├── SectionTag.tsx
│   ├── CliPrompt.tsx
│   ├── PromptBlock.tsx
│   └── Badge.tsx
├── src/layouts/                     ← 레이아웃 컴포넌트 7종
│   ├── TitleSlide.tsx
│   ├── SplitSlide.tsx
│   ├── CompareSlide.tsx
│   ├── ListSlide.tsx
│   ├── QuoteSlide.tsx
│   ├── CodeSlide.tsx
│   └── CtaSlide.tsx
├── src/slides/layouts/              ← 슬라이드 레이아웃 7종
│   ├── SlideLayout.tsx
│   ├── SplitLayout.tsx
│   ├── CenterLayout.tsx
│   ├── BentoLayout.tsx
│   ├── StaggeredLayout.tsx
│   ├── ZigzagLayout.tsx
│   └── FeatureCalloutLayout.tsx
├── src/themes/                      ← 테마
│   └── memphis.ts
├── src/slides/                      ← 실제 데크 예시
│   ├── Script001Deck.tsx
│   ├── MemphisSlide.tsx / Card / Badge
│   ├── ServiceLogo.tsx
│   └── typography.ts
└── src/docs/                        ← 디자인 문서 19종

profiles/                            ← 캐릭터 + 벤치마킹
├── character-v1.json
├── character-narrative-v1.md
├── maker-evan.json
└── benchmarks.json

scripts/                             ← 대본 md
templates/                           ← HTML 미리보기 (참고용)
```

### Remotion 경량화

```
leanslide/remotion-slides/src/
  삭제: layouts/ (30종)              ← storybook 레이아웃으로 대체
  삭제: animations/ 중 8종           ← BubbleSpeech, MockupBrowser,
                                       ComparePanel, BarChart,
                                       BentoGrid, DotsLoader,
                                       XMark, CardGrid
  유지: animations/ 핵심 7종         ← RadarScan, CardPop, StrokeProgress,
                                       FlowChart, CheckList, TextBlink, CountUp
```

### 신규 추가

```
leanslide/remotion-slides/src/
├── cue/
│   ├── CueContext.tsx               ← cue 프레임 계산 + React Context
│   ├── AnimatedSlide.tsx            ← storybook 컴포넌트 cue 래핑
│   ├── useCue.ts                    ← hook: target별 현재 상태 조회
│   └── actions/
│       ├── fadeIn.ts
│       ├── slideUp.ts
│       ├── typeIn.ts                ← CLI 타이핑
│       ├── clickSim.ts             ← 클릭 시뮬레이션
│       └── staggerReveal.ts        ← 프로세스 순차 등장
├── bridge/
│   └── importMap.ts                 ← storybook 컴포넌트 → layout 라우팅
├── timing/
│   └── cueMapper.ts                 ← TTS 타임스탬프 → cue 변환
└── subtitle/
    └── SubtitleTrack.tsx            ← 자막 컴포넌트
```

---

## 5. Storybook → Remotion 브릿지

### tsconfig paths

```json
{
  "compilerOptions": {
    "paths": {
      "@ds/*": ["../../storybook-ds/src/*"]
    }
  }
}
```

### importMap — 레이아웃 라우팅

```typescript
const layoutMap = {
  // 스토리북 레이아웃 컴포넌트 (7종)
  'title':       TitleSlide,
  'split-7-5':   SplitSlide,
  'split-5-7':   SplitSlide,
  'compare':     CompareSlide,
  'list':        ListSlide,
  'quote':       QuoteSlide,
  'code':        CodeSlide,
  'cta':         CtaSlide,

  // 스토리북 슬라이드 레이아웃 (7종)
  'bento-grid':       BentoLayout,
  'center-stage':     CenterLayout,
  'feature-callout':  FeatureCalloutLayout,
  'staggered-rows':   StaggeredLayout,
  'zigzag':           ZigzagLayout,
  'split-layout':     SplitLayout,
  'slide-layout':     SlideLayout,
};
```

### 래핑 원칙

- storybook 컴포넌트 코드는 수정하지 않음
- 애니메이션은 항상 래퍼에서 style override로 주입
- cue가 없는 요소는 즉시 표시 (정적 렌더링 fallback)

---

## 6. 자막

### 스타일

```
위치: 하단 중앙 (bottom: 8%, 수평 중앙)
줄 수: 1줄만 (줄바꿈 금지)
글자 수: 최대 25자 (초과 시 문장 분할)
배경: 반투명 블랙 pill (rgba(0,0,0,0.75), borderRadius 8px, padding 8px 24px)
폰트: Pretendard 24px, weight 600, white
```

### 전환 규칙

```
표시 단위: 어절 그룹 (1~25자 이내로 자연스러운 끊김)
전환 타이밍: TTS word-level 타임스탬프 기반 즉시 교체 (페이드 없음)
빈 구간: 0.3초 이상 무음이면 자막 숨김
```

---

## 7. md-to-slides.js 변경사항

### 변경 전

- 고정 duration (3~7초)
- Remotion 30종 레이아웃명
- 독자적 content 스키마

### 변경 후

- duration 없음 (TTS 생성 후 inject-cues.js가 timing 주입)
- storybook 레이아웃명 사용 (contentLayoutMap 참조)
- sequenceRules + validateSequence로 레이아웃 반복 방지 검증
- 텍스트 역할(readable/decorative) 체계 반영

---

## 8. 보유 자산 요약

| 카테고리 | 수량 | 출처 |
|----------|------|------|
| 토큰 | colors, spacing, fontSize, fontWeight, grid, borderRadius, blur | storybook-ds/tokens/ |
| 팔레트 | 22개 | palettes.ts |
| 레이아웃 패턴 | 18종 | layout-variations.ts |
| 레이아웃 컴포넌트 | 7종 | storybook-ds/layouts/ |
| 슬라이드 레이아웃 | 7종 | storybook-ds/slides/layouts/ |
| UI 프리미티브 | 9종 | storybook-ds/components/ |
| 테마 | memphis + 22 팔레트 확장 | themes/ + palettes.ts |
| 텍스트 역할 | readable 4종 + decorative 5종 | TextRoles.stories.tsx |
| 콘텐츠→레이아웃 매핑 | 10종 contentType | layout-variations.ts |
| 반복 방지 규칙 | layoutFamilyMap + sequenceRules | layout-variations.ts |
| 디자인 문서 | 19종 스토리 | storybook-ds/docs/ |
| 캐릭터 스타일 | character-v1.json + narrative | profiles/ |
| 벤치마킹 | maker-evan.json + benchmarks.json | profiles/ |
| 대본 | 4개 | scripts/ |
| Remotion 애니메이션 (유지) | 7종 | animations/ |
| HTML 템플릿 (참고) | 8개 | templates/ |

---

## 9. 성공 기준

- storybook-ds 컴포넌트 코드 수정 없이 Remotion에서 렌더링 성공
- cue 기반으로 나레이션 시점에 맞춰 화면 요소가 동기화되어 등장
- 자막이 1줄, 하단 중앙, 즉시 교체로 TTS 오디오와 정확히 싱크
- CLI 타이핑, 프로세스 순차 등장, 클릭 시뮬레이션이 나레이션에 맞춰 동작
- 기존 대본(scripts/*.md)으로 새 파이프라인 end-to-end 테스트 통과
