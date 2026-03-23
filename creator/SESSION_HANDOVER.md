# Session Handover
## 날짜: 2026-03-23

## 프로젝트 상태: 파이프라인 전환 Task 1~8 완료 (렌더링 검증 + 디자인 피드백 반영)

---

## 완료

### 1. 파이프라인 전환 설계
- 브레인스토밍 → 설계 문서 작성 → 스펙 리뷰 완료
- `docs/superpowers/specs/2026-03-23-pipeline-pivot-design.md`
- `docs/superpowers/plans/2026-03-23-pipeline-pivot.md` (12개 Task)

### 2. 핵심 인프라 구축 (Task 1~7)
- **tsconfig paths + webpack alias**: `@ds/*` → `../../storybook-ds/src/*`
  - `leanslide/remotion-slides/tsconfig.json` (paths 추가)
  - `leanslide/remotion-slides/remotion.config.ts` (webpack alias, `process.cwd()` 기반)
- **타입 정의**: `src/types.ts` (SlidesJson, SlideData, Cue, SlideTiming, Subtitle)
- **importMap**: `src/bridge/importMap.ts` (14종 storybook 레이아웃 매핑)
- **cue 시스템**:
  - `src/cue/CueContext.tsx` — ms→프레임 변환 + React Context
  - `src/cue/useCue.ts` — target별 애니메이션 스타일 (fadeIn, slideUp, staggerReveal)
  - `src/cue/AnimatedSlide.tsx` — storybook 컴포넌트에 cue 스타일 주입 (style override props)
  - `src/cue/actions/typeIn.ts` — CLI 타이핑 효과
  - `src/cue/actions/clickSim.ts` — 클릭 시뮬레이션
- **SubtitleTrack**: `src/subtitle/SubtitleTrack.tsx` (1줄 하단 중앙, 즉시 교체, 25자 분할)
- **SlideVideo + Root**: ms 기반 타이밍으로 전체 재작성

### 3. 렌더링 검증 + 디자인 피드백 반영 (Task 8)
- `leanslide/slides/test-cue.slides.json` — 테스트 데이터 (TitleSlide + SplitSlide)
- v1→v5 반복 렌더링으로 디자인 피드백 반영:
  - Badge/SectionTag → 둥근 pill 형태 (fontSize 15, borderRadius 20, padding 8px 20px)
  - TitleSlide → 10컬럼 너비, padding margin*0.7
  - SplitSlide → 5컬럼 좌측 + paddingLeft margin*1.5 (텍스트→카드 방향 이동)
  - cue 애니메이션 작동 확인 (fadeIn, slideUp, staggerReveal)
- **최종 승인**: `out/test-cue-v5.mp4`

### 4. storybook-ds 컴포넌트 수정
- `Badge.tsx` — pill 형태 + style prop
- `SectionTag.tsx` — pill 형태 + style prop
- `TitleSlide.tsx` — style override props (badgeStyle, headlineStyle, subtitleStyle, cliStyle)
- `SplitSlide.tsx` — style override props (headlineStyle, itemStyles[])

---

## 미완료

### Task 9: 기존 Remotion 코드 정리 (높음)
- `src/layouts/` 전체 삭제 (30종 → storybook으로 대체)
- `src/tokens.ts` 삭제
- 미사용 애니메이션 8종 삭제 (BentoGrid, DotsLoader, BubbleSpeech 등)
- animations/index.ts 업데이트 (유지 8종만 export)
- **주의**: 기존 SlideVideo가 layouts/index.ts를 import하던 코드는 이미 제거됨. tsc 체크 후 삭제.

### Task 10: md-to-slides.js (중간)
- 대본 md → slides.json 변환 스크립트
- 계획에 코드 스케치 있음 (plan 문서 참조)
- contentLayoutMap 기반 레이아웃 선택 + 반복 방지

### Task 11: inject-cues.js (중간)
- TTS 타임스탬프 → slides.json에 cue 주입
- 계획에 코드 스케치 있음

### Task 12: CLAUDE.md + VISUAL_SPEC.md 업데이트 (낮음)
- CLAUDE.md 파이프라인/레이아웃 섹션 교체
- VISUAL_SPEC.md 폐기 표시

---

## 에러/학습

1. **tsconfig paths ≠ webpack alias**: tsconfig의 `paths`는 타입 체크용이고 Remotion 번들러(webpack)는 별도 `remotion.config.ts`에서 alias 설정 필요. `__dirname`이 아닌 `process.cwd()` 사용.
2. **cue 애니메이션은 storybook 외부에서 주입**: storybook 컴포넌트는 useCue를 호출하지 않음. AnimatedSlide에서 cue 스타일을 계산하여 style override props로 전달하는 패턴.
3. **HeroUI → Remotion 비호환**: framer-motion 의존 때문에 직접 사용 불가. 시각 패턴만 참고.

---

## 파일 구조 (신규/수정)

```
leanslide/remotion-slides/
├── remotion.config.ts              ← 신규 (webpack @ds alias)
├── tsconfig.json                   ← 수정 (paths 추가)
├── src/
│   ├── types.ts                    ← 신규
│   ├── SlideVideo.tsx              ← 재작성 (ms 기반)
│   ├── Root.tsx                    ← 재작성 (ms 기반)
│   ├── bridge/
│   │   └── importMap.ts            ← 신규
│   ├── cue/
│   │   ├── CueContext.tsx          ← 신규
│   │   ├── useCue.ts              ← 신규
│   │   ├── AnimatedSlide.tsx       ← 신규
│   │   └── actions/
│   │       ├── typeIn.ts           ← 신규
│   │       ├── clickSim.ts         ← 신규
│   │       └── index.ts            ← 신규
│   └── subtitle/
│       └── SubtitleTrack.tsx       ← 신규

storybook-ds/src/
├── components/Badge.tsx            ← 수정 (pill + style prop)
├── components/SectionTag.tsx       ← 수정 (pill + style prop)
├── layouts/TitleSlide.tsx          ← 수정 (10col + style override props)
└── layouts/SplitSlide.tsx          ← 수정 (5col + paddingLeft + style override props)

leanslide/slides/
└── test-cue.slides.json            ← 신규 (테스트 데이터)

docs/superpowers/
├── specs/2026-03-23-pipeline-pivot-design.md  ← 신규
└── plans/2026-03-23-pipeline-pivot.md         ← 신규
```

---

## 다음 세션 시작 시

1. `MEMORY.md` + 이 핸드오버 읽기
2. Task 9부터 재개 — `leanslide/remotion-slides/src/layouts/` 삭제 + 미사용 애니메이션 정리
3. 삭제 후 `npx tsc --noEmit --skipLibCheck` + 렌더링 재검증
4. Task 10~12 순차 또는 병렬 에이전트로 진행
