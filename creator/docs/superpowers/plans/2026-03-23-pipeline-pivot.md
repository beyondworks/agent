# Pipeline Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remotion이 storybook-ds 컴포넌트를 직접 import하고, cue 기반 나레이션-동기 애니메이션으로 영상을 렌더링하는 새 파이프라인 구축

**Architecture:** storybook-ds의 토큰·컴포넌트·레이아웃을 tsconfig paths로 직접 참조. Remotion은 cue 시스템(CueContext + useCue + actions)으로 애니메이션만 담당. md-to-slides.js가 대본→JSON 변환, inject-cues.js가 TTS 타임스탬프→cue 주입.

**Tech Stack:** React 19, Remotion 4, TypeScript 5.7, storybook-ds (순수 React 컴포넌트)

**Spec:** `docs/superpowers/specs/2026-03-23-pipeline-pivot-design.md`

---

## File Map

### 수정

| 파일 | 변경 내용 |
|------|-----------|
| `leanslide/remotion-slides/tsconfig.json` | `@ds/*` paths 추가 |
| `leanslide/remotion-slides/src/Root.tsx` | calculateMetadata를 ms 기반으로 변경 |
| `leanslide/remotion-slides/src/SlideVideo.tsx` | 전체 재작성 — cue 기반 타이밍 |

### 생성

| 파일 | 역할 |
|------|------|
| `leanslide/remotion-slides/src/bridge/importMap.ts` | storybook 레이아웃 → Remotion 라우팅 |
| `leanslide/remotion-slides/src/cue/CueContext.tsx` | cue 프레임 계산 + React Context |
| `leanslide/remotion-slides/src/cue/useCue.ts` | target별 현재 애니메이션 상태 hook |
| `leanslide/remotion-slides/src/cue/AnimatedSlide.tsx` | storybook 컴포넌트 cue 래핑 |
| `leanslide/remotion-slides/src/cue/actions/fadeIn.ts` | 페이드 인 |
| `leanslide/remotion-slides/src/cue/actions/slideUp.ts` | 아래→위 슬라이드 |
| `leanslide/remotion-slides/src/cue/actions/typeIn.ts` | CLI 타이핑 효과 |
| `leanslide/remotion-slides/src/cue/actions/clickSim.ts` | 클릭 시뮬레이션 |
| `leanslide/remotion-slides/src/cue/actions/staggerReveal.ts` | 프로세스 순차 등장 |
| `leanslide/remotion-slides/src/cue/actions/index.ts` | action 레지스트리 |
| `leanslide/remotion-slides/src/subtitle/SubtitleTrack.tsx` | 유튜브 스타일 자막 |
| `leanslide/remotion-slides/src/types.ts` | 새 slides.json 타입 정의 |
| `leanslide/md-to-slides.js` | 대본 md → slides.json 변환 |
| `leanslide/inject-cues.js` | TTS 타임스탬프 → cue 주입 |
| `leanslide/slides/test-cue.slides.json` | cue 시스템 테스트용 고정 데이터 |

### 삭제

| 대상 | 이유 |
|------|------|
| `leanslide/remotion-slides/src/layouts/` (전체 디렉토리) | storybook 레이아웃으로 대체 |
| `leanslide/remotion-slides/src/tokens.ts` | storybook 토큰 사용 |
| `leanslide/remotion-slides/src/animations/BentoGrid.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/DotsLoader.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/BubbleSpeech.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/MockupBrowser.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/ComparePanel.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/BarChart.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/XMark.tsx` | 미사용 |
| `leanslide/remotion-slides/src/animations/CardGrid.tsx` | 미사용 |

---

## Task 1: 타입 정의 + tsconfig 브릿지

**Files:**
- Create: `leanslide/remotion-slides/src/types.ts`
- Modify: `leanslide/remotion-slides/tsconfig.json`

- [ ] **Step 1: 새 slides.json 타입 정의**

```typescript
// src/types.ts
export interface Cue {
  ms: number;
  target: string;
  action: 'fadeIn' | 'slideUp' | 'typeIn' | 'clickSim' | 'staggerReveal';
}

export interface SlideTiming {
  startMs: number;
  endMs: number;
  cues: Cue[];
}

export interface SlideData {
  id: number;
  layout: string;
  content: Record<string, any>;
  timing: SlideTiming;
}

export interface SubtitleWord {
  text: string;
  startMs: number;
  endMs: number;
}

export interface SubtitleSentence {
  text: string;
  startMs: number;
  endMs: number;
}

export interface SlidesJson {
  meta: {
    title: string;
    theme?: string;
    font?: string;
    totalSlides?: number;
  };
  slides: SlideData[];
  subtitles?: {
    words: SubtitleWord[];
    sentences: SubtitleSentence[];
  };
}
```

- [ ] **Step 2: tsconfig에 @ds paths 추가**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "declaration": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@ds/*": ["../../storybook-ds/src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: tsc로 타입 체크 통과 확인**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/types.ts`
Expected: 에러 없음

- [ ] **Step 4: @ds import 경로 테스트**

`src/types.ts` 끝에 임시 추가:
```typescript
// 브릿지 테스트 (확인 후 삭제)
import type { LayoutPattern } from '@ds/tokens/layout-variations';
```

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/types.ts`
Expected: 에러 없음 — storybook-ds 타입 참조 성공

임시 import 라인 삭제 후 커밋.

---

## Task 2: importMap — 레이아웃 라우팅

**Files:**
- Create: `leanslide/remotion-slides/src/bridge/importMap.ts`

- [ ] **Step 1: importMap 작성**

```typescript
// src/bridge/importMap.ts
import React from 'react';

// storybook-ds 레이아웃 컴포넌트
import { TitleSlide } from '@ds/layouts/TitleSlide';
import { SplitSlide } from '@ds/layouts/SplitSlide';
import { CompareSlide } from '@ds/layouts/CompareSlide';
import { ListSlide } from '@ds/layouts/ListSlide';
import { QuoteSlide } from '@ds/layouts/QuoteSlide';
import { CodeSlide } from '@ds/layouts/CodeSlide';
import { CtaSlide } from '@ds/layouts/CtaSlide';

// storybook-ds 슬라이드 레이아웃 (범용 래퍼)
import { BentoLayout } from '@ds/slides/layouts/BentoLayout';
import { CenterLayout } from '@ds/slides/layouts/CenterLayout';
import { FeatureCalloutLayout } from '@ds/slides/layouts/FeatureCalloutLayout';
import { StaggeredLayout } from '@ds/slides/layouts/StaggeredLayout';
import { ZigzagLayout } from '@ds/slides/layouts/ZigzagLayout';
import { SplitLayout } from '@ds/slides/layouts/SplitLayout';
import { SlideLayout } from '@ds/slides/layouts/SlideLayout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const layoutMap: Record<string, React.FC<any>> = {
  // 레이아웃 컴포넌트 (props 기반)
  'title':          TitleSlide,
  'split-7-5':      SplitSlide,
  'split-5-7':      SplitSlide,
  'compare':        CompareSlide,
  'list':           ListSlide,
  'quote':          QuoteSlide,
  'code':           CodeSlide,
  'cta':            CtaSlide,

  // 슬라이드 레이아웃 (children 기반)
  'bento-grid':        BentoLayout,
  'center-stage':      CenterLayout,
  'feature-callout':   FeatureCalloutLayout,
  'staggered-rows':    StaggeredLayout,
  'zigzag':            ZigzagLayout,
  'split-layout':      SplitLayout,
  'slide-layout':      SlideLayout,
};

/** importMap에 등록된 레이아웃 목록 (md-to-slides에서 필터용) */
export const supportedLayouts = Object.keys(layoutMap);

export function getLayout(name: string): React.FC<any> | null {
  return layoutMap[name] ?? null;
}
```

- [ ] **Step 2: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/bridge/importMap.ts`
Expected: 에러 없음 — storybook 컴포넌트 14종 import 성공

- [ ] **Step 3: 커밋**

```bash
git add leanslide/remotion-slides/src/bridge/importMap.ts
git commit -m "feat: add storybook→remotion layout importMap (14 layouts)"
```

---

## Task 3: cue 시스템 코어

**Files:**
- Create: `leanslide/remotion-slides/src/cue/CueContext.tsx`
- Create: `leanslide/remotion-slides/src/cue/useCue.ts`

- [ ] **Step 1: CueContext 작성**

```typescript
// src/cue/CueContext.tsx
import React, { createContext, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Cue } from '../types';

export interface CueFrame extends Cue {
  /** cue 시점을 슬라이드 내 상대 프레임으로 변환한 값 */
  frame: number;
}

interface CueContextValue {
  /** 슬라이드 내 현재 프레임 (0부터 시작) */
  frame: number;
  fps: number;
  cues: CueFrame[];
}

export const CueCtx = createContext<CueContextValue>({
  frame: 0,
  fps: 30,
  cues: [],
});

interface CueProviderProps {
  slideStartMs: number;
  cues: Cue[];
  children: React.ReactNode;
}

export const CueProvider: React.FC<CueProviderProps> = ({
  slideStartMs,
  cues,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueFrames = useMemo(
    () =>
      cues.map((cue) => ({
        ...cue,
        frame: Math.round(((cue.ms - slideStartMs) / 1000) * fps),
      })),
    [cues, slideStartMs, fps],
  );

  return (
    <CueCtx.Provider value={{ frame, fps, cues: cueFrames }}>
      {children}
    </CueCtx.Provider>
  );
};
```

- [ ] **Step 2: useCue hook 작성**

```typescript
// src/cue/useCue.ts
import { useContext } from 'react';
import { interpolate } from 'remotion';
import { CueCtx } from './CueContext';
import type { CueFrame } from './CueContext';

interface AnimationStyle {
  opacity: number;
  transform: string;
}

const DEFAULT_VISIBLE: AnimationStyle = { opacity: 1, transform: 'none' };

/**
 * target에 대한 현재 프레임의 애니메이션 스타일을 반환.
 * cue가 없으면 즉시 표시 (opacity: 1).
 */
export function useCue(target: string): AnimationStyle {
  const { frame, cues } = useContext(CueCtx);

  const cue = cues.find((c) => c.target === target);
  if (!cue) return DEFAULT_VISIBLE; // cue 없으면 즉시 표시

  return computeStyle(frame, cue);
}

function computeStyle(frame: number, cue: CueFrame): AnimationStyle {
  const elapsed = frame - cue.frame;

  switch (cue.action) {
    case 'fadeIn': {
      const duration = 15; // 0.5초 @30fps
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: 'none' };
    }

    case 'slideUp': {
      const duration = 18; // 0.6초 @30fps
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const translateY = interpolate(elapsed, [0, duration], [30, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: `translateY(${translateY}px)` };
    }

    case 'staggerReveal': {
      const duration = 18;
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const translateY = interpolate(elapsed, [0, duration], [20, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const scale = interpolate(elapsed, [0, duration], [0.95, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return {
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      };
    }

    case 'typeIn':
    case 'clickSim':
      // 전용 컴포넌트에서 처리 — useCue는 visibility만 제어
      return frame >= cue.frame ? DEFAULT_VISIBLE : { opacity: 0, transform: 'none' };

    default:
      return DEFAULT_VISIBLE;
  }
}
```

- [ ] **Step 3: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/cue/CueContext.tsx src/cue/useCue.ts`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add leanslide/remotion-slides/src/cue/
git commit -m "feat: add cue system core (CueContext + useCue)"
```

---

## Task 4: cue action 전용 컴포넌트

**Files:**
- Create: `leanslide/remotion-slides/src/cue/actions/fadeIn.ts`
- Create: `leanslide/remotion-slides/src/cue/actions/slideUp.ts`
- Create: `leanslide/remotion-slides/src/cue/actions/typeIn.ts`
- Create: `leanslide/remotion-slides/src/cue/actions/clickSim.ts`
- Create: `leanslide/remotion-slides/src/cue/actions/staggerReveal.ts`
- Create: `leanslide/remotion-slides/src/cue/actions/index.ts`

- [ ] **Step 1: typeIn action (CLI 타이핑)**

```typescript
// src/cue/actions/typeIn.ts
import { useContext } from 'react';
import { interpolate } from 'remotion';
import { CueCtx } from '../CueContext';

/**
 * CLI 타이핑 효과: cue 시점부터 텍스트를 한 글자씩 표시.
 * @param target cue target 이름
 * @param fullText 전체 텍스트
 * @param durationFrames 타이핑 완료까지 프레임 수 (기본 60 = 2초 @30fps)
 * @returns 현재 표시할 텍스트 + 커서 깜빡임 여부
 */
export function useTypeIn(
  target: string,
  fullText: string,
  durationFrames = 60,
): { displayText: string; showCursor: boolean } {
  const { frame, cues } = useContext(CueCtx);
  const cue = cues.find((c) => c.target === target && c.action === 'typeIn');

  if (!cue) return { displayText: fullText, showCursor: false };

  const elapsed = frame - cue.frame;
  if (elapsed < 0) return { displayText: '', showCursor: false };

  const progress = interpolate(elapsed, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const charCount = Math.floor(progress * fullText.length);
  const displayText = fullText.slice(0, charCount);
  const showCursor = elapsed % 15 < 10; // 깜빡임: 10프레임 on, 5프레임 off

  return { displayText, showCursor };
}
```

- [ ] **Step 2: clickSim action (클릭 시뮬레이션)**

```typescript
// src/cue/actions/clickSim.ts
import { useContext } from 'react';
import { interpolate, spring } from 'remotion';
import { CueCtx } from '../CueContext';

export interface ClickSimState {
  /** 커서 위치 (0→시작점, 1→타겟점) */
  cursorProgress: number;
  /** 클릭 ripple 효과 (0→없음, 1→최대) */
  rippleScale: number;
  /** 결과 등장 opacity */
  resultOpacity: number;
  phase: 'idle' | 'moving' | 'clicking' | 'result';
}

/**
 * 클릭 시뮬레이션: 커서 이동 → 클릭 ripple → 결과 등장
 * @param target cue target 이름
 */
export function useClickSim(target: string): ClickSimState {
  const { frame, fps, cues } = useContext(CueCtx);
  const cue = cues.find((c) => c.target === target && c.action === 'clickSim');

  const idle: ClickSimState = {
    cursorProgress: 0,
    rippleScale: 0,
    resultOpacity: 0,
    phase: 'idle',
  };

  if (!cue) return { ...idle, cursorProgress: 1, resultOpacity: 1, phase: 'result' };

  const elapsed = frame - cue.frame;
  if (elapsed < 0) return idle;

  // Phase 1: 커서 이동 (0~20프레임)
  const moveEnd = 20;
  // Phase 2: 클릭 (20~30프레임)
  const clickEnd = 30;
  // Phase 3: 결과 등장 (30~45프레임)
  const resultEnd = 45;

  if (elapsed < moveEnd) {
    return {
      cursorProgress: interpolate(elapsed, [0, moveEnd], [0, 1], {
        extrapolateRight: 'clamp',
      }),
      rippleScale: 0,
      resultOpacity: 0,
      phase: 'moving',
    };
  }

  if (elapsed < clickEnd) {
    const ripple = spring({ frame: elapsed - moveEnd, fps, durationInFrames: 10 });
    return {
      cursorProgress: 1,
      rippleScale: ripple,
      resultOpacity: 0,
      phase: 'clicking',
    };
  }

  return {
    cursorProgress: 1,
    rippleScale: 0,
    resultOpacity: interpolate(elapsed, [clickEnd, resultEnd], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    phase: 'result',
  };
}
```

- [ ] **Step 3: action index (레지스트리)**

```typescript
// src/cue/actions/index.ts
export { useTypeIn } from './typeIn';
export { useClickSim } from './clickSim';
// fadeIn, slideUp, staggerReveal은 useCue.ts에서 직접 처리
// typeIn, clickSim은 전용 컴포넌트에서 이 hook 사용
```

- [ ] **Step 4: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/cue/actions/index.ts`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add leanslide/remotion-slides/src/cue/actions/
git commit -m "feat: add cue actions (typeIn, clickSim)"
```

---

## Task 5: SubtitleTrack (유튜브 스타일 자막)

**Files:**
- Create: `leanslide/remotion-slides/src/subtitle/SubtitleTrack.tsx`

- [ ] **Step 1: SubtitleTrack 작성**

```typescript
// src/subtitle/SubtitleTrack.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SubtitleSentence } from '../types';

interface SubtitleTrackProps {
  sentences: SubtitleSentence[];
}

const MAX_CHARS = 25;
const SILENCE_THRESHOLD_MS = 300;

/** 25자 초과 문장을 자연스러운 끊김으로 분할 */
function splitSentence(sentence: SubtitleSentence): SubtitleSentence[] {
  const { text, startMs, endMs } = sentence;
  if (text.length <= MAX_CHARS) return [sentence];

  const words = text.split(' ');
  const chunks: SubtitleSentence[] = [];
  let current = '';
  const totalDuration = endMs - startMs;
  const msPerChar = totalDuration / text.length;

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS && current) {
      const chunkStart = startMs + Math.round(
        (text.indexOf(current) / text.length) * totalDuration
      );
      const chunkEnd = chunkStart + Math.round(current.length * msPerChar);
      chunks.push({ text: current, startMs: chunkStart, endMs: chunkEnd });
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    const chunkStart = chunks.length > 0
      ? chunks[chunks.length - 1]!.endMs
      : startMs;
    chunks.push({ text: current, startMs: chunkStart, endMs });
  }

  return chunks;
}

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({ sentences }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // 모든 문장을 25자 이하로 분할
  const chunks = sentences.flatMap(splitSentence);

  // 현재 시점의 자막 찾기
  const active = chunks.find(
    (c) => currentMs >= c.startMs && currentMs <= c.endMs,
  );

  // 무음 구간 체크
  if (!active) {
    const nextChunk = chunks.find((c) => c.startMs > currentMs);
    if (nextChunk && nextChunk.startMs - currentMs > SILENCE_THRESHOLD_MS) {
      return null; // 0.3초 이상 무음이면 숨김
    }
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.75)',
          borderRadius: 8,
          padding: '8px 24px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.4,
          }}
        >
          {active.text}
        </span>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/subtitle/SubtitleTrack.tsx`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add leanslide/remotion-slides/src/subtitle/
git commit -m "feat: add SubtitleTrack (youtube-style, 1-line, instant swap)"
```

---

## Task 6: AnimatedSlide 래퍼

**Files:**
- Create: `leanslide/remotion-slides/src/cue/AnimatedSlide.tsx`

- [ ] **Step 1: AnimatedSlide 작성**

storybook 레이아웃 컴포넌트를 CueProvider로 감싸고, 레이아웃별 props에 cue 스타일을 주입.

```typescript
// src/cue/AnimatedSlide.tsx
import React from 'react';
import { CueProvider } from './CueContext';
import { getLayout } from '../bridge/importMap';
import type { SlideData } from '../types';

interface AnimatedSlideProps {
  slide: SlideData;
}

export const AnimatedSlide: React.FC<AnimatedSlideProps> = ({ slide }) => {
  const Layout = getLayout(slide.layout);

  if (!Layout) {
    console.warn(`Unknown layout: ${slide.layout}`);
    return null;
  }

  return (
    <CueProvider
      slideStartMs={slide.timing.startMs}
      cues={slide.timing.cues}
    >
      <Layout {...slide.content} />
    </CueProvider>
  );
};
```

- [ ] **Step 2: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit src/cue/AnimatedSlide.tsx`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add leanslide/remotion-slides/src/cue/AnimatedSlide.tsx
git commit -m "feat: add AnimatedSlide wrapper (storybook + cue)"
```

---

## Task 7: SlideVideo + Root 재작성

**Files:**
- Modify: `leanslide/remotion-slides/src/SlideVideo.tsx` (전체 재작성)
- Modify: `leanslide/remotion-slides/src/Root.tsx`

- [ ] **Step 1: SlideVideo 재작성 (ms 기반 타이밍)**

```typescript
// src/SlideVideo.tsx
import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import { AnimatedSlide } from './cue/AnimatedSlide';
import { SubtitleTrack } from './subtitle/SubtitleTrack';
import type { SlidesJson } from './types';

const FPS = 30;

/** ms → 프레임 변환 */
const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

export const SlideVideo: React.FC<SlidesJson> = ({ slides, subtitles }) => {
  return (
    <>
      {slides.map((slide) => {
        const from = msToFrame(slide.timing.startMs);
        const durationInFrames = msToFrame(slide.timing.endMs - slide.timing.startMs);

        return (
          <Sequence key={slide.id} from={from} durationInFrames={durationInFrames}>
            <AnimatedSlide slide={slide} />
          </Sequence>
        );
      })}

      {/* 자막 — 전체 영상 위에 오버레이 */}
      {subtitles?.sentences && (
        <Sequence from={0} durationInFrames={Infinity}>
          <SubtitleTrack sentences={subtitles.sentences} />
        </Sequence>
      )}
    </>
  );
};
```

- [ ] **Step 2: Root.tsx 수정 (ms 기반 calculateMetadata)**

```typescript
// src/Root.tsx
import React from 'react';
import { Composition } from 'remotion';
import { SlideVideo } from './SlideVideo';
import type { SlidesJson } from './types';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SlideVideo"
        component={SlideVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={FPS * 60 * 15}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          meta: { title: 'Untitled' },
          slides: [],
        } as Record<string, unknown>}
        calculateMetadata={async ({ props }) => {
          const { slides } = props as unknown as SlidesJson;
          if (!slides?.length) return { durationInFrames: FPS };

          const lastSlide = slides[slides.length - 1]!;
          const totalMs = lastSlide.timing.endMs;
          const totalFrames = Math.round((totalMs / 1000) * FPS);

          return {
            durationInFrames: Math.max(totalFrames, FPS),
          };
        }}
      />
    </>
  );
};
```

- [ ] **Step 3: tsc 타입 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit`
Expected: 에러 없음 (기존 layouts/ import 제거 상태)

- [ ] **Step 4: 커밋**

```bash
git add leanslide/remotion-slides/src/SlideVideo.tsx leanslide/remotion-slides/src/Root.tsx
git commit -m "feat: rewrite SlideVideo + Root for ms-based cue timing"
```

---

## Task 8: 테스트 데이터로 렌더링 검증

**Files:**
- Create: `leanslide/slides/test-cue.slides.json`

- [ ] **Step 1: cue 포함 테스트 JSON 작성**

storybook TitleSlide + SplitSlide 2장으로 구성. timing은 하드코딩 (TTS 없이 테스트).

```json
{
  "meta": {
    "title": "cue 시스템 테스트",
    "theme": "creator"
  },
  "slides": [
    {
      "id": 1,
      "layout": "title",
      "content": {
        "badge": "TEST",
        "titlePre": "cue 시스템",
        "titleAccent": "동작 테스트",
        "titlePost": "",
        "subtitle": "나레이션 동기화 검증용",
        "command": "$ npm run test-cue"
      },
      "timing": {
        "startMs": 0,
        "endMs": 5000,
        "cues": [
          { "ms": 0, "target": "badge", "action": "fadeIn" },
          { "ms": 500, "target": "headline", "action": "fadeIn" },
          { "ms": 1500, "target": "subtitle", "action": "slideUp" },
          { "ms": 3000, "target": "cli", "action": "typeIn" }
        ]
      }
    },
    {
      "id": 2,
      "layout": "split-7-5",
      "content": {
        "tag": "검증",
        "title": "순차 등장 테스트",
        "description": "각 항목이 cue 시점에 맞춰 등장하는지 확인",
        "items": [
          { "title": "항목 1", "description": "첫 번째 카드" },
          { "title": "항목 2", "description": "두 번째 카드" },
          { "title": "항목 3", "description": "세 번째 카드" }
        ]
      },
      "timing": {
        "startMs": 5000,
        "endMs": 12000,
        "cues": [
          { "ms": 5000, "target": "headline", "action": "fadeIn" },
          { "ms": 6000, "target": "item-0", "action": "staggerReveal" },
          { "ms": 7500, "target": "item-1", "action": "staggerReveal" },
          { "ms": 9000, "target": "item-2", "action": "staggerReveal" }
        ]
      }
    }
  ],
  "subtitles": {
    "words": [],
    "sentences": [
      { "text": "cue 시스템 동작 테스트입니다", "startMs": 0, "endMs": 2500 },
      { "text": "나레이션에 맞춰 화면이 움직입니다", "startMs": 2800, "endMs": 5000 },
      { "text": "첫 번째 항목이 등장합니다", "startMs": 5500, "endMs": 7000 },
      { "text": "두 번째 항목이 등장합니다", "startMs": 7500, "endMs": 9000 },
      { "text": "세 번째 항목이 등장합니다", "startMs": 9000, "endMs": 11000 }
    ]
  }
}
```

- [ ] **Step 2: Remotion Studio로 미리보기**

Run: `cd leanslide/remotion-slides && npx remotion studio src/index.ts`
Expected: 브라우저에서 2장 슬라이드가 cue 타이밍에 맞춰 애니메이션 동작 확인

- [ ] **Step 3: MP4 렌더링 테스트**

Run: `cd leanslide/remotion-slides && npx remotion render src/index.ts SlideVideo out/test-cue.mp4 --props=../slides/test-cue.slides.json`
Expected: `out/test-cue.mp4` 생성 (12초, 1920×1080)

- [ ] **Step 4: 결과 확인**

출력 MP4에서 확인할 것:
1. TitleSlide — badge가 0초에 페이드인, 헤드라인이 0.5초에 페이드인, 자막이 1.5초에 슬라이드업, CLI가 3초부터 타이핑
2. SplitSlide — 항목 3개가 6초, 7.5초, 9초에 순차 등장
3. 자막이 하단 중앙에 1줄로 표시, 페이드 없이 즉시 교체

- [ ] **Step 5: 커밋**

```bash
git add leanslide/slides/test-cue.slides.json
git commit -m "feat: add cue system test data (2 slides, subtitle)"
```

---

## Task 9: 기존 Remotion 레이아웃/애니메이션 정리

**Files:**
- Delete: `leanslide/remotion-slides/src/layouts/` (전체 디렉토리)
- Delete: `leanslide/remotion-slides/src/tokens.ts`
- Delete: 8종 미사용 애니메이션

이 작업은 Task 8 (렌더링 검증) 성공 후 진행.

- [ ] **Step 1: layouts 디렉토리 삭제**

```bash
rm -rf leanslide/remotion-slides/src/layouts/
```

- [ ] **Step 2: 기존 tokens.ts 삭제**

```bash
rm leanslide/remotion-slides/src/tokens.ts
```

- [ ] **Step 3: 미사용 애니메이션 8종 삭제**

```bash
rm leanslide/remotion-slides/src/animations/BentoGrid.tsx
rm leanslide/remotion-slides/src/animations/DotsLoader.tsx
rm leanslide/remotion-slides/src/animations/BubbleSpeech.tsx
rm leanslide/remotion-slides/src/animations/MockupBrowser.tsx
rm leanslide/remotion-slides/src/animations/ComparePanel.tsx
rm leanslide/remotion-slides/src/animations/BarChart.tsx
rm leanslide/remotion-slides/src/animations/XMark.tsx
rm leanslide/remotion-slides/src/animations/CardGrid.tsx
```

- [ ] **Step 4: animations/index.ts 업데이트**

유지 대상 7종만 export:
```typescript
// src/animations/index.ts
export { RadarScan } from './RadarScan';
export { CardPop } from './CardPop';
export { StrokeProgress } from './StrokeProgress';
export { FlowChart } from './FlowChart';
export { CheckList } from './CheckList';
export { TextBlink } from './TextBlink';
export { CountUp } from './CountUp';
export { CircleProgress } from './CircleProgress';
```

- [ ] **Step 5: tsc 전체 체크**

Run: `cd leanslide/remotion-slides && npx tsc --noEmit`
Expected: 에러 없음 — 기존 코드의 layouts import가 없어진 상태

- [ ] **Step 6: 렌더링 재검증**

Run: `cd leanslide/remotion-slides && npx remotion render src/index.ts SlideVideo out/test-cue-clean.mp4 --props=../slides/test-cue.slides.json`
Expected: Task 8과 동일한 결과

- [ ] **Step 7: 커밋**

```bash
git add -A leanslide/remotion-slides/src/
git commit -m "refactor: remove old layouts/tokens, keep 8 core animations"
```

---

## Task 10: md-to-slides.js (대본 → JSON 변환)

**Files:**
- Create: `leanslide/md-to-slides.js`

- [ ] **Step 1: 기본 구조 작성**

대본 md를 파싱하여 씬별로 slides.json을 생성. storybook의 `contentLayoutMap`과 `supportedLayouts`를 참조하여 유효한 레이아웃만 출력.

```javascript
// leanslide/md-to-slides.js
import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

// storybook 레이아웃 규칙 (런타임에 TS import 불가 → 하드코딩)
const SUPPORTED_LAYOUTS = [
  'title', 'split-7-5', 'split-5-7', 'compare', 'list',
  'quote', 'code', 'cta', 'bento-grid', 'center-stage',
  'feature-callout', 'staggered-rows', 'zigzag', 'split-layout',
  'slide-layout',
];

// contentType → 추천 레이아웃 (layout-variations.ts 기반, 지원 레이아웃만)
const CONTENT_LAYOUT_MAP = {
  title:      ['center-stage', 'split-7-5', 'title'],
  problem:    ['split-7-5', 'feature-callout'],
  quote:      ['quote', 'center-stage'],
  comparison: ['compare', 'zigzag'],
  list3:      ['bento-grid', 'feature-callout', 'staggered-rows'],
  list4plus:  ['bento-grid', 'zigzag'],
  code:       ['code', 'split-7-5', 'staggered-rows'],
  cta:        ['cta', 'center-stage'],
  process:    ['staggered-rows', 'list'],
  stats:      ['bento-grid', 'list'],
};

// 레이아웃 패밀리 (반복 방지)
const LAYOUT_FAMILY = {
  'title': 'center', 'center-stage': 'center', 'quote': 'center', 'cta': 'center',
  'split-7-5': 'split', 'split-5-7': 'split', 'split-layout': 'split',
  'compare': 'split',
  'list': 'grid', 'bento-grid': 'grid', 'staggered-rows': 'grid',
  'feature-callout': 'asymmetric',
  'zigzag': 'sequence',
  'code': 'data', 'slide-layout': 'data',
};

function parseMarkdown(mdContent) {
  // ## 씬 N 으로 분리
  const scenes = mdContent.split(/^## 씬 \d+/m).filter(Boolean);
  const slides = [];
  let lastFamily = null;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];

    // 레이아웃 지시 파싱: **레이아웃:** xxx
    const layoutMatch = scene.match(/\*\*레이아웃:\*\*\s*(\S+)/);
    let requestedLayout = layoutMatch?.[1] ?? null;

    // 지원 레이아웃 필터
    if (requestedLayout && !SUPPORTED_LAYOUTS.includes(requestedLayout)) {
      console.warn(`⚠️ 미지원 레이아웃 "${requestedLayout}" → 대체 선택`);
      requestedLayout = null;
    }

    // contentType 추론 (간단 휴리스틱)
    const contentType = inferContentType(scene);
    const candidates = CONTENT_LAYOUT_MAP[contentType] ?? ['slide-layout'];

    // 반복 방지: 같은 패밀리 연속 금지
    let layout = requestedLayout;
    if (!layout) {
      layout = candidates.find(c => LAYOUT_FAMILY[c] !== lastFamily) ?? candidates[0];
    }

    lastFamily = LAYOUT_FAMILY[layout] ?? null;

    // content 추출
    const content = extractContent(scene, layout);

    slides.push({
      id: i + 1,
      layout,
      content,
      timing: {
        startMs: 0,  // inject-cues.js가 채움
        endMs: 0,
        cues: [],
      },
    });
  }

  return slides;
}

function inferContentType(sceneText) {
  if (/오프닝|후킹|인트로/i.test(sceneText)) return 'title';
  if (/문제|왜\?|한계/i.test(sceneText)) return 'problem';
  if (/인용|명언/i.test(sceneText)) return 'quote';
  if (/비교|vs|대/i.test(sceneText)) return 'comparison';
  if (/코드|```/i.test(sceneText)) return 'code';
  if (/마무리|CTA|정리/i.test(sceneText)) return 'cta';
  if (/단계|프로세스|절차/i.test(sceneText)) return 'process';
  if (/수치|통계|\d+%/i.test(sceneText)) return 'stats';
  // 나열 항목 수 카운트
  const bulletCount = (sceneText.match(/^[-*]\s/gm) || []).length;
  if (bulletCount >= 4) return 'list4plus';
  if (bulletCount >= 3) return 'list3';
  return 'list3'; // 기본값
}

function extractContent(sceneText, layout) {
  // 헤드라인 추출
  const headlineMatch = sceneText.match(/헤드라인:\s*"([^"]+)"/);
  const headline = headlineMatch?.[1] ?? '';

  // 대본 추출 (### 대본 아래)
  const scriptMatch = sceneText.match(/### 대본\s*\n([\s\S]*?)(?=###|$)/);
  const script = scriptMatch?.[1]?.trim() ?? '';

  // 기본 content
  return {
    tag: '',
    title: headline || script.split('\n')[0]?.slice(0, 40) || 'Untitled',
    description: script.split('\n').slice(0, 3).join(' ').slice(0, 120),
    badge: '',
    titlePre: '',
    titleAccent: headline,
    titlePost: '',
    subtitle: '',
    command: '',
    items: [],
  };
}

// Main
const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node md-to-slides.js <script.md>');
  process.exit(1);
}

const md = readFileSync(inputPath, 'utf-8');
const slides = parseMarkdown(md);
const name = basename(inputPath, '.md');
const output = {
  meta: { title: name, theme: 'creator', font: 'Noto Sans KR', totalSlides: slides.length },
  slides,
};

const outPath = `leanslide/slides/${name}.slides.json`;
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`✅ ${outPath} (${slides.length} slides)`);
```

- [ ] **Step 2: 기존 대본으로 변환 테스트**

Run: `node leanslide/md-to-slides.js scripts/script-001-ai-tools-converge.md`
Expected: `leanslide/slides/script-001-ai-tools-converge.slides.json` 생성, 모든 layout이 SUPPORTED_LAYOUTS에 포함

- [ ] **Step 3: 커밋**

```bash
git add leanslide/md-to-slides.js
git commit -m "feat: add md-to-slides.js (storybook layouts, anti-repeat)"
```

---

## Task 11: inject-cues.js (TTS 타임스탬프 → cue 주입)

**Files:**
- Create: `leanslide/inject-cues.js`

- [ ] **Step 1: inject-cues.js 작성**

TTS 출력 타임스탬프 JSON을 읽어 slides.json의 timing에 cue를 자동 생성.

```javascript
// leanslide/inject-cues.js
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * TTS 타임스탬프에서 cue를 자동 생성하여 slides.json에 주입
 *
 * 사용법: node inject-cues.js <slides.json> <tts-output-dir>
 *
 * tts-output-dir 구조:
 *   scene-01.json  { durationMs, words: [...], sentences: [...] }
 *   scene-02.json
 *   ...
 */

function generateCues(slide, ttsData, slideStartMs) {
  const cues = [];
  const sentences = ttsData.sentences || [];

  // headline: 첫 문장 시작
  if (sentences[0]) {
    cues.push({
      ms: slideStartMs + sentences[0].startMs,
      target: 'headline',
      action: 'fadeIn',
    });
  }

  // items: 나열 항목 매칭
  // "첫째" "둘째" "셋째" 또는 번호(1. 2. 3.) 매칭
  const ordinalPattern = /첫째|둘째|셋째|넷째|다섯째|\d+\.\s/;
  let itemIndex = 0;

  for (const sentence of sentences) {
    if (ordinalPattern.test(sentence.text)) {
      cues.push({
        ms: slideStartMs + sentence.startMs,
        target: `item-${itemIndex}`,
        action: 'staggerReveal',
      });
      itemIndex++;
    }
  }

  // items가 없으면 문장 순서대로 item 매핑
  if (itemIndex === 0 && (slide.content.items?.length ?? 0) > 0) {
    const itemCount = slide.content.items.length;
    const usableSentences = sentences.slice(1); // 첫 문장은 headline에 사용

    for (let i = 0; i < itemCount && i < usableSentences.length; i++) {
      cues.push({
        ms: slideStartMs + usableSentences[i].startMs,
        target: `item-${i}`,
        action: 'slideUp',
      });
    }
  }

  // CLI: command가 있으면 마지막 문장 시점에 typeIn
  if (slide.content.command) {
    const lastSentence = sentences[sentences.length - 1];
    if (lastSentence) {
      cues.push({
        ms: slideStartMs + lastSentence.startMs,
        target: 'cli',
        action: 'typeIn',
      });
    }
  }

  return cues;
}

// Main
const slidesPath = process.argv[2];
const ttsDir = process.argv[3];

if (!slidesPath || !ttsDir) {
  console.error('Usage: node inject-cues.js <slides.json> <tts-output-dir>');
  process.exit(1);
}

const slidesJson = JSON.parse(readFileSync(slidesPath, 'utf-8'));
let currentMs = 0;
const allSentences = [];

for (let i = 0; i < slidesJson.slides.length; i++) {
  const slide = slidesJson.slides[i];
  const ttsPath = join(ttsDir, `scene-${String(i + 1).padStart(2, '0')}.json`);

  let ttsData;
  try {
    ttsData = JSON.parse(readFileSync(ttsPath, 'utf-8'));
  } catch {
    console.warn(`⚠️ ${ttsPath} 없음 — timing 스킵`);
    slide.timing = { startMs: currentMs, endMs: currentMs + 5000, cues: [] };
    currentMs += 5000;
    continue;
  }

  const slideStartMs = currentMs;
  const slideEndMs = currentMs + ttsData.durationMs;

  slide.timing = {
    startMs: slideStartMs,
    endMs: slideEndMs,
    cues: generateCues(slide, ttsData, slideStartMs),
  };

  // 자막 수집 (절대 시간으로 변환)
  for (const s of ttsData.sentences || []) {
    allSentences.push({
      text: s.text,
      startMs: slideStartMs + s.startMs,
      endMs: slideStartMs + s.endMs,
    });
  }

  currentMs = slideEndMs + 200; // 씬 간 0.2초 간격
}

// subtitles 주입
slidesJson.subtitles = {
  words: [], // word-level은 TTS에서 직접 가져옴
  sentences: allSentences,
};

writeFileSync(slidesPath, JSON.stringify(slidesJson, null, 2));
console.log(`✅ ${slidesPath} — ${slidesJson.slides.length} slides에 cue 주입 완료`);
```

- [ ] **Step 2: 수동 TTS 데이터로 테스트**

테스트용 TTS JSON 2개 작성:
```bash
mkdir -p tts/test-output
```

```json
// tts/test-output/scene-01.json
{
  "durationMs": 5000,
  "sentences": [
    { "text": "cue 시스템 동작 테스트입니다", "startMs": 0, "endMs": 2500 },
    { "text": "나레이션에 맞춰 화면이 움직입니다", "startMs": 2800, "endMs": 5000 }
  ]
}
```

Run: `node leanslide/inject-cues.js leanslide/slides/test-cue.slides.json tts/test-output/`
Expected: test-cue.slides.json의 timing이 TTS 기반으로 업데이트됨

- [ ] **Step 3: 커밋**

```bash
git add leanslide/inject-cues.js
git commit -m "feat: add inject-cues.js (TTS timestamp → cue injection)"
```

---

## Task 12: CLAUDE.md + VISUAL_SPEC.md 업데이트

**Files:**
- Modify: `CLAUDE.md`
- Modify: `VISUAL_SPEC.md` (폐기 표시)

- [ ] **Step 1: CLAUDE.md 파이프라인 섹션 업데이트**

새 파이프라인, 레이아웃 목록(14종), cue 시스템, 자막 규칙 반영.
기존 30종 레이아웃 테이블 → 14종 importMap 테이블로 교체.
기존 애니메이션 15종 → 유지 8종 + cue actions 5종으로 교체.

- [ ] **Step 2: VISUAL_SPEC.md에 폐기 표시**

파일 최상단에 추가:
```markdown
> ⚠️ DEPRECATED: 이 파일은 Remotion 전용 비주얼 가이드였으나, 파이프라인 전환(2026-03-23)으로 폐기됨.
> 디자인 토큰의 Source of Truth는 `storybook-ds/src/tokens/` 입니다.
```

- [ ] **Step 3: 커밋**

```bash
git add CLAUDE.md VISUAL_SPEC.md
git commit -m "docs: update CLAUDE.md for pipeline pivot, deprecate VISUAL_SPEC.md"
```

---

## 실행 순서 요약

```
Task 1  → 타입 + tsconfig 브릿지
Task 2  → importMap
Task 3  → cue 코어 (CueContext + useCue)
Task 4  → cue actions (typeIn, clickSim)
Task 5  → SubtitleTrack
Task 6  → AnimatedSlide 래퍼
Task 7  → SlideVideo + Root 재작성
Task 8  → 테스트 데이터 렌더링 검증 ← 여기서 첫 시각 확인
Task 9  → 기존 코드 정리 (검증 성공 후)
Task 10 → md-to-slides.js
Task 11 → inject-cues.js
Task 12 → 문서 업데이트
```

Task 1~7은 병렬 가능하나, Task 8이 통합 검증 게이트.
Task 9는 Task 8 성공 후에만 진행 (롤백 안전망).
Task 10~11은 독립적으로 진행 가능.
