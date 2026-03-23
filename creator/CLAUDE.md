# CLAUDE.md — Creator Agent

> 주제 하나로 10~15분 정보성 콘텐츠 영상을 완전 자동화하는 에이전트

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Creator Agent |
| 목적 | 주제 입력 → 30~50장 슬라이드 → MP4 영상 자동 완성 |
| 산출물 | 영상 mp4 + 대본 md + 슬라이드 JSON |
| 기술 스택 | Remotion, Qwen3 TTS, Node.js/TypeScript |
| 디자인 시스템 | storybook-ds/ 참조 후 Remotion 재구현 |
| 비주얼 스타일 | VISUAL_SPEC.md 참조 (Deep Black + Neon Green) |
| 작업자 | Claude Code |

---

## 2. 디렉토리 구조

```
Creator/
├── CLAUDE.md
├── VISUAL_SPEC.md                 ← 비주얼 스타일 가이드 (반드시 읽기)
├── storybook-ds/
│   └── src/
│       ├── components/
│       │   ├── SlideBase.tsx
│       │   ├── GlassCard.tsx
│       │   ├── GradientText.tsx
│       │   ├── GradientDivider.tsx
│       │   ├── NumberBadge.tsx
│       │   ├── SectionTag.tsx
│       │   ├── CliPrompt.tsx
│       │   ├── PromptBlock.tsx
│       │   └── Badge.tsx
│       └── docs/
│           ├── Typography.stories.tsx
│           ├── ColorPalette.stories.tsx
│           ├── Icons.stories.tsx
│           ├── Spacing.stories.tsx
│           ├── LayoutSystem.stories.tsx
│           ├── ComponentRules.stories.tsx
│           ├── UxGuidelines.stories.tsx
│           ├── LayoutVariations.stories.tsx
│           ├── LandingPatterns.stories.tsx
│           └── StyleComposer.stories.tsx
├── leanslide/
│   ├── CLAUDE.md
│   ├── md-to-slides.js
│   ├── slide-renderer.html
│   ├── scripts/
│   ├── slides/
│   └── remotion-slides/
│       └── src/
│           ├── tokens.ts
│           ├── Root.tsx
│           ├── SlideVideo.tsx
│           ├── utils/
│           │   ├── interpolate.ts
│           │   └── icons.tsx
│           ├── animations/
│           │   ├── RadarScan.tsx
│           │   ├── CircleProgress.tsx
│           │   ├── CardPop.tsx
│           │   ├── BentoGrid.tsx
│           │   ├── CountUp.tsx
│           │   ├── DotsLoader.tsx
│           │   ├── StrokeProgress.tsx
│           │   ├── FlowChart.tsx
│           │   ├── BarChart.tsx
│           │   ├── BubbleSpeech.tsx
│           │   ├── MockupBrowser.tsx
│           │   ├── CheckList.tsx
│           │   ├── XMark.tsx
│           │   ├── TextBlink.tsx
│           │   ├── ComparePanel.tsx
│           │   ├── CardGrid.tsx
│           │   └── index.ts
│           └── layouts/          ← 30종 레이아웃
│               ├── (아래 섹션 4 참조)
│               └── index.ts
├── tts/
└── style-analyzer/
```

---

## 3. 파이프라인

```
[입력] 주제
    ↓
[1단계] 대본 생성 에이전트 → scripts/topic.md        ✅ 완료
    ↓
[2단계] md-to-slides.js → slides/topic.slides.json   ✅ 완료
    ↓
[3단계] Remotion 렌더링 → out/topic.mp4              ✅ 완료
    ↓
[4단계] Qwen3 TTS 음성 합성                          🔲 예정
    ↓
[5단계] 스타일 분석 (크리에이터 프로파일)             🔲 예정
```

```bash
# 실행
node leanslide/md-to-slides.js ./scripts/topic.md && \
npx remotion render SlideVideo out/topic.mp4 \
  --props=./leanslide/slides/topic.slides.json
```

---

## 4. 레이아웃 30종

10~15분 영상(슬라이드 30~50장)을 커버하는 전체 레이아웃 목록이다.
모든 레이아웃은 `leanslide/remotion-slides/src/layouts/` 에 위치한다.

### 오프닝/전환 (5종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `title` | TitleSlide.tsx | 강의 오프닝 | 4초 |
| `chapter` | ChapterSlide.tsx | 챕터 전환 (번호 + 제목) | 3초 |
| `transition` | TransitionSlide.tsx | 섹션 전환 (DotsLoader) | 2초 |
| `teaser` | TeaserSlide.tsx | 다음 내용 예고 | 3초 |
| `recap` | RecapSlide.tsx | 중간 요약 | 5초 |

### 개념 설명 (6종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `concept` | ConceptSlide.tsx | 개념 + RadarScan 또는 FlowChart | 6초 |
| `definition` | DefinitionSlide.tsx | 용어 정의 (좌: 단어, 우: 설명) | 5초 |
| `analogy` | AnalogySlide.tsx | 비유 설명 (아이콘 2개 대응) | 5초 |
| `highlight` | HighlightSlide.tsx | 핵심 문장 1개 강조 (TextBlink 옵션) | 4초 |
| `quote` | QuoteSlide.tsx | 인용구 전체 화면 | 4초 |
| `fullscreen-text` | FullscreenTextSlide.tsx | 임팩트 한 줄 전체 화면 | 3초 |

### 스토리텔링 (4종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `problem` | ProblemSlide.tsx | 문제 제기 (XMark 강조) | 5초 |
| `solution` | SolutionSlide.tsx | 해결책 제시 (CheckMark 강조) | 5초 |
| `example` | ExampleSlide.tsx | 실제 사례 (MockupBrowser 옵션) | 6초 |
| `before-after` | BeforeAfterSlide.tsx | 전후 비교 (ComparePanel) | 6초 |

### 구조/프로세스 (5종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `process` | ProcessSlide.tsx | 단계별 프로세스 (CheckList 옵션) | 7초 |
| `timeline` | TimelineSlide.tsx | 시간 흐름 (연도/단계) | 6초 |
| `flow` | FlowSlide.tsx | 화살표 흐름도 (FlowChart) | 6초 |
| `architecture` | ArchitectureSlide.tsx | 시스템 구조도 | 7초 |
| `diagram` | DiagramSlide.tsx | 관계도 (노드-엣지) | 6초 |

### 나열/비교 (5종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `list` | ListSlide.tsx | 항목 나열 (BentoGrid 또는 CardGrid) | 5초 |
| `pros-cons` | ProsConsSlide.tsx | 장단점 (CheckMark + XMark) | 6초 |
| `comparison` | ComparisonSlide.tsx | A vs B (ComparePanel) | 6초 |
| `table` | TableSlide.tsx | 비교표 | 6초 |
| `stats-grid` | StatsGridSlide.tsx | 수치 (BarChart 또는 CountUp) | 6초 |

### 코드/기술 (3종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `code` | CodeSlide.tsx | 코드 + 설명 | 7초 |
| `code-compare` | CodeCompareSlide.tsx | 전후 코드 비교 | 7초 |
| `terminal` | TerminalSlide.tsx | 터미널 출력 애니메이션 | 6초 |

### 마무리 (2종)
| layout | 파일 | 설명 | duration |
|--------|------|------|----------|
| `closing` | ClosingSlide.tsx | 요약 + CTA | 5초 |
| `next-episode` | NextEpisodeSlide.tsx | 다음 영상 예고 | 4초 |

---

## 5. slides.json 스키마

```json
{
  "meta": {
    "title": "string",
    "theme": {
      "bg":      "#0a0a0a",
      "accent":  "#00ff88",
      "accent2": "#a855f7",
      "accent3": "#ff4444"
    },
    "font": "Pretendard",
    "totalSlides": number,
    "estimatedDuration": number
  },
  "slides": [
    {
      "id": number,
      "layout": "레이아웃 30종 중 하나",
      "duration": number,
      "content": {
        "diagram": { "type": "orbit | flow | tree", "lightFlow": true },
        "stats":   { "style": "number | bar | bar+number", "compareMode": false },
        "mockup":  { "enabled": false, "url": "string", "warning": null },
        "markers": [{ "text": "string", "type": "x | check" }],
        "checklist": [{ "text": "string", "checked": true }],
        "textBlink": { "items": ["string"], "mode": "sequential | highlight" }
      },
      "animation": {
        "entrance": "stagger-up | fade | slide-left | pop",
        "style": "radar | flow | bar | circle-progress | card-pop | bento | count-up | dots | stroke | compare | checklist | blink",
        "staggerDelay": number
      }
    }
  ]
}
```

---

## 6. 슬라이드 생성 사고 프로세스

md-to-slides.js가 대본을 변환할 때 반드시 이 순서로 판단한다.

### Step 1. 영상 전체 구조 설계 (변환 시작 전)

10~15분 영상 기준 슬라이드 구성:
```
오프닝        : title × 1
챕터 구분     : chapter × 2~3 (주요 섹션마다)
개념 설명     : concept, definition, analogy 혼합
핵심 강조     : highlight, quote, fullscreen-text (전체의 20%)
문제/해결     : problem → solution 쌍으로
프로세스      : process, flow, timeline 상황에 맞게
나열/비교     : list, comparison, stats-grid
코드/기술     : code, terminal (기술 주제면)
중간 전환     : transition, recap 중간중간
마무리        : recap → closing → next-episode
```

### Step 2. 이 섹션의 핵심 감정/에너지는?

| 감정 | 레이아웃 | animation.style | 아이콘 계열 |
|------|----------|-----------------|-------------|
| 경이로움/가능성 | concept | radar 또는 flow | star, zap |
| 긴장감/문제 | problem | fade + xmark | alert-triangle |
| 논리/구조 | process, flow | stroke + flow | layers, git-branch |
| 속도/효율 | process | stroke | zap, rocket |
| 신뢰/안정 | list | bento | shield, check-circle |
| 비교/선택 | comparison | compare | split |
| 수치/성과 | stats-grid | bar 또는 count-up | trending-up |
| 흥미/호기심 | concept, analogy | radar | search, eye |
| 마무리/행동 | closing | fade | arrow-right, play |

### Step 3. 아이콘은 명사가 아닌 동사로 고른다

```
❌ "데이터베이스" → database
✅ 핵심 동작이 "조회" → search
✅ 핵심 동작이 "저장" → save
✅ 핵심 동작이 "연결" → link
✅ 핵심 동작이 "분석" → bar-chart
✅ 핵심 동작이 "자동화" → refresh-cw
✅ 핵심 동작이 "보호" → shield
```

### Step 4. 애니메이션은 콘텐츠의 물리적 특성을 따른다

```
위→아래 흐름 (순서, 단계)     → stagger-up + stroke
갑자기 등장 (임팩트, 강조)    → fade
퍼져나가는 것 (네트워크, 연결) → radar + pop 또는 flow
좌우 대립 (비교, 대조)        → compare
쌓이는 것 (누적, 성장, 수치)  → bar 또는 count-up
그리드 등장 (나열, 특징)      → bento 또는 card-grid
금지/경고                     → xmark + fade
성공/완료                     → checklist + stroke
```

### Step 5. 전체 리듬 설계 규칙

```
✅ 같은 레이아웃 연속 2회 금지
✅ highlight/quote/fullscreen-text 전체의 20% 이하
✅ problem 다음엔 반드시 solution
✅ process 바로 다음 list 금지
✅ chapter 슬라이드로 주요 섹션 구분
✅ 8~10장마다 transition 또는 recap
✅ 마지막 3장: recap → closing → next-episode
```

---

## 7. 디자인 시스템

### 작업 시작 전 반드시 읽을 파일 (순서대로)

```
1. VISUAL_SPEC.md                                     ← 비주얼 스타일 가이드 (최우선)
2. storybook-ds/src/docs/Typography.stories.tsx       ← 폰트 위계
3. storybook-ds/src/docs/ColorPalette.stories.tsx     ← 컬러 시스템
4. storybook-ds/src/docs/Spacing.stories.tsx          ← 간격 규칙
5. storybook-ds/src/docs/ComponentRules.stories.tsx   ← 컴포넌트 원칙
6. storybook-ds/src/docs/UxGuidelines.stories.tsx     ← UX 판단 기준
7. storybook-ds/src/docs/LayoutSystem.stories.tsx     ← 레이아웃 패턴
8. storybook-ds/src/docs/LayoutVariations.stories.tsx ← 레이아웃 변형
```

### storybook-ds → Remotion 컴포넌트 대응

| storybook-ds | Remotion 구현체 | 사용 상황 |
|---|---|---|
| `SlideBase` | 각 layout 최외곽 div | 모든 슬라이드 |
| `GlassCard` | `CardPop.tsx` | process, list 카드 |
| `GradientText` | titleAccent em 태그 | 모든 타이틀 강조 |
| `GradientDivider` | 섹션 구분선 | 슬라이드 내 분리 |
| `NumberBadge` | step-num | process 단계 번호 |
| `SectionTag` | label | 슬라이드 상단 레이블 |
| `CliPrompt` | TerminalSlide 내부 | 터미널 출력 |
| `PromptBlock` | highlight, quote | 핵심 문장 강조 |
| `Badge` | pill, step-tag | 키워드 태그 |

### 절대 규칙

```
❌ 하드코딩 색상값
❌ 이모지/이모티콘 (lucide-react SVG만 사용)
❌ GSAP을 Remotion 컴포넌트 안에서 사용
❌ storybook-ds 컴포넌트 직접 import
❌ 로고를 SVG 코드로 직접 그리기
❌ 웹 검색으로 로고 이미지 URL 가져오기
❌ 비슷하게 생긴 아이콘으로 대체하기
❌ 텍스트로 로고 표현하기
```

### 로고 사용 규칙

```
✅ leanslide/assets/logos/registry.json에서만 로고 참조
✅ registry에 없는 툴 → 로고 없이 텍스트 레이블만 표시
✅ registry에 없으면 메시지 출력:
   "⚠️ [툴명] 로고가 registry에 없습니다. assets/logos/에 SVG 추가 후 registry.json에 등록해주세요."
```

### 토큰

```typescript
// VISUAL_SPEC.md의 VISUAL_THEME 참조
// 기본값
bg:      '#0a0a0a'   // Deep Black
accent:  '#00ff88'   // Neon Green
accent2: '#a855f7'   // Purple
accent3: '#ff4444'   // Red (경고/금지)
surface: '#111111'
text:    '#ffffff'
muted:   '#aaaaaa'
```

### 타이포그래피 (1920×1080 기준)

```
VISUAL_SPEC.md의 TYPOGRAPHY 참조
Display:  80px, weight 900
Headline: 56px, weight 800
Title:    40px, weight 700
Body:     24px, weight 400, line-height 1.6
Caption:  18px, color #aaaaaa
Label:    16px, weight 700, uppercase, letter-spacing 0.1em
```

### 간격 (8pt 그리드)

```
xs:8  sm:16  md:24  lg:32  xl:48  2xl:64
컴포넌트 내부 패딩: 최소 24px
섹션 간격: 최소 40px
좌우 여백: 6%
```

---

## 8. 애니메이션 컴포넌트

`leanslide/remotion-slides/src/animations/` 위치.
**모두 useCurrentFrame() 기반. GSAP 사용 금지.**
**상세 스펙은 VISUAL_SPEC.md 섹션 2 참조.**

### 기존 7종
| 컴포넌트 | 레이아웃 연결 | 핵심 효과 |
|---|---|---|
| `RadarScan` | concept, diagram | 원형 스캔 회전 + 노드 페이드인 |
| `CircleProgress` | highlight, chapter | SVG stroke-dashoffset + 중앙 pop |
| `CardPop` | process, list, example | 그림자 레이어 + 슬라이드업 |
| `BentoGrid` | list, stats-grid, pros-cons | 그리드 순차 등장 |
| `CountUp` | stats-grid, highlight | 숫자 롤링 + bounce |
| `DotsLoader` | transition | 3점 순차 scale |
| `StrokeProgress` | process, timeline, flow | 가로 진행 + glow |

### 신규 8종 (VISUAL_SPEC.md 기반)
| 컴포넌트 | 레이아웃 연결 | 핵심 효과 |
|---|---|---|
| `FlowChart` | concept, flow, diagram | 노드→선 드로잉→빛 흐름 |
| `BarChart` | stats-grid, comparison | 막대 채워짐 + 대비 강조 |
| `BubbleSpeech` | title, analogy | bounce pop 말풍선 |
| `MockupBrowser` | example, code | 브라우저 프레임 + overlay |
| `CheckList` | process, solution, closing | 순차 슬라이드인 + SVG 드로잉 |
| `XMark` / `CheckMark` | problem, solution, pros-cons | rotate + scale 등장 |
| `TextBlink` | highlight, fullscreen-text | 순차 깜빡임 |
| `ComparePanel` | comparison, before-after | 구분선 드로잉 + 좌우 슬라이드 |
| `CardGrid` | list, concept | 아래에서 위로 stagger 솟아오르기 |

### useCurrentFrame 헬퍼

```typescript
fadeIn(frame, start, duration=15)
slideUp(frame, start, duration=18)
staggerIn(frame, index, start, stagger=5)
drawLine(frame, start, duration=20)
popIn(frame, start, duration=12)
```

---

## 9. 로드맵

### Phase 1: 슬라이드 파이프라인 ✅ 완료
- 레이아웃 30종, 애니메이션 15종 (기존 7 + 신규 8)
- VISUAL_SPEC.md 기반 Deep Black + Neon Green 비주얼 시스템
- md → JSON → HTML 미리보기 / MP4

### Phase 2: 스타일 분석 🔲
- 유튜브 transcript 크롤링
- LLM 기반 크리에이터 스타일 프로파일 추출
- 크리에이터별 테마 자동 생성

### Phase 3: TTS 연동 🔲
- Qwen3 TTS 로컬 세팅
- 씬별 음성 생성 → Remotion 타임라인 배치

### Phase 4: 엔드투엔드 자동화 🔲
- 주제 입력 → 영상 출력 단일 CLI