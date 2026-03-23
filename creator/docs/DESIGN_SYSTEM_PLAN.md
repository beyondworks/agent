# 디자인 시스템 규칙화 계획

> Theme System(ui-ux-pro-max)의 데이터를 활용하되,
> 구현 단계에서 자유도를 제거하여 일관된 퀄리티를 보장하는 구조.

---

## 1. 핵심 원칙: "선택지만 있고, 자유 입력은 없다"

```
❌ 현재: color: #2B303B  → 임의 hex 값 허용 → 매번 다른 결과
✅ 목표: color: var(--bg-slide)  → 토큰만 허용 → 항상 동일
```

모든 시각적 결정을 3단계로 제한:
1. **토큰 (Design Tokens)** — 색상, 간격, 폰트 크기의 허용된 값 목록
2. **컴포넌트 (Components)** — 토큰만 사용하는 사전 정의된 UI 블록
3. **레이아웃 (Layouts)** — 컴포넌트만 배치하는 사전 정의된 슬라이드 구조

---

## 2. 3계층 규칙 체계

### Layer 1: Design Tokens (값의 제한)

```typescript
// tokens.ts — 이 파일에 없는 값은 사용 불가

export const colors = {
  // 배경
  bgBase:    '#1A1E26',
  bgSlide:   '#2B303B',
  bgCard:    'rgba(255,255,255,0.03)',

  // 텍스트
  textPrimary:   '#ECECEC',
  textSecondary: 'rgba(236,236,236,0.6)',
  textMuted:     'rgba(236,236,236,0.3)',
  textAccent:    'rgba(0,188,212,0.85)',

  // 액센트
  accent:      '#00BCD4',
  accentSoft:  'rgba(0,188,212,0.1)',
  accentBorder:'rgba(0,188,212,0.15)',

  // 보더
  borderGlass: 'rgba(255,255,255,0.06)',
  borderDim:   'rgba(255,255,255,0.04)',
} as const;

export const spacing = {
  xs:  4,   // 타이트 갭
  sm:  8,   // 아이콘 갭
  md:  16,  // 기본 패딩
  lg:  24,  // 섹션 패딩
  xl:  32,  // 큰 갭
  '2xl': 48, // 섹션 마진
  '3xl': 64, // 슬라이드 패딩
} as const;

export const fontSize = {
  // 슬라이드 전용 (1920x1080 기준)
  display:  96,  // 타이틀 슬라이드 제목
  h1:       72,  // 섹션 제목
  h2:       48,  // 카드 제목
  h3:       36,  // 서브 헤딩
  body:     24,  // 본문
  caption:  18,  // 캡션
  label:    14,  // 라벨/태그
  mono:     20,  // 코드/CLI
} as const;

export const fontWeight = {
  light:    300,
  regular:  400,
  medium:   500,
  bold:     700,
  black:    900,  // 제목 전용
} as const;

export const borderRadius = {
  sm:   8,
  md:   12,
  lg:   16,
  full: 9999,
} as const;

export const blur = {
  glass:  24,  // 글래스 카드
  subtle: 12,  // 배지/태그
} as const;
```

**규칙:** 컴포넌트에서 `tokens.ts`에 없는 값을 직접 쓰면 빌드 에러.

### Layer 2: Components (구조의 제한)

각 컴포넌트는 **허용된 props만 받는 TypeScript 인터페이스**로 정의.

```typescript
// 예: GlassCard 컴포넌트
interface GlassCardProps {
  children: React.ReactNode;
  glow?: boolean;          // true면 accent 글로우 추가
  padding?: 'md' | 'lg';   // tokens.spacing에서만 선택
  // ❌ style?: React.CSSProperties  — 자유 스타일 금지
  // ❌ className?: string          — 자유 클래스 금지
}

// 예: NumberBadge 컴포넌트
interface NumberBadgeProps {
  n: number | string;
  // 색상/크기 옵션 없음 — 항상 동일한 모습
}

// 예: SectionTag 컴포넌트
interface SectionTagProps {
  label: string;
  // 색상/스타일 옵션 없음 — 항상 동일한 모습
}
```

**전체 컴포넌트 목록:**

| 컴포넌트 | 용도 | 커스텀 가능한 것 | 고정된 것 |
|---------|------|----------------|----------|
| `SlideBase` | 슬라이드 배경 | variant (default/dark) | 배경색, orb, 그리드 |
| `GlassCard` | 카드 | glow, padding | 배경, 블러, 보더 |
| `GradientText` | 강조 텍스트 | (없음) | 그라데이션 방향, 색상 |
| `NumberBadge` | 번호 | n (값만) | 크기, 색상, 폰트 |
| `SectionTag` | 섹션 라벨 | label (텍스트만) | 색상, 크기, 폰트 |
| `Badge` | 태그 | label (텍스트만) | 색상, 크기, 폰트 |
| `PromptBlock` | 터미널/코드 | bad, label, children | 헤더 스타일, 폰트, 색상 |
| `GradientDivider` | 구분선 | (없음) | 폭, 색상, 두께 |
| `CliPrompt` | CLI 라인 | children | 폰트, 색상, 커서 |

### Layer 3: Layouts (배치의 제한)

슬라이드 레이아웃을 **사전 정의된 템플릿**으로 제한.

```typescript
type SlideLayout =
  | 'title'      // 제목 + 부제 + CLI (중앙 정렬)
  | 'split'      // 좌 텍스트 + 우 카드 (6:4 비율)
  | 'quote'      // 중앙 인용문
  | 'compare'    // 좌우 50:50 비교
  | 'list'       // 제목 + 번호 리스트 (글래스 행)
  | 'code'       // 제목 + 좌우 코드 블록
  | 'cta'        // 마무리 (중앙 정렬 + 디바이더)
  | 'diagram'    // 제목 + 다이어그램 영역
  | 'stats'      // 숫자 강조 (2~4 컬럼)

// 레이아웃 사용 예:
<Slide layout="split">
  <SlideLeft>
    <SectionTag label="Problem" />
    <Heading>기획서는 완벽한데 구현이 안 된다</Heading>
    <Body>설명 텍스트</Body>
  </SlideLeft>
  <SlideRight>
    <GlassCard glow><NumberBadge n={1} />텍스트</GlassCard>
    <GlassCard><NumberBadge n={2} />텍스트</GlassCard>
  </SlideRight>
</Slide>
```

**규칙:** 레이아웃 내 패딩, 갭, 정렬은 레이아웃이 결정. 컴포넌트가 위치를 제어하지 않음.

---

## 3. Storybook 적용 방안

### 왜 Storybook인가

| 문제 | Storybook 해결 |
|------|---------------|
| 컴포넌트가 토큰을 벗어나는지 코드만으로 판단 어려움 | **Visual Regression Test** — 스냅샷 비교로 시각적 변화 감지 |
| 컴포넌트 조합이 의도대로 보이는지 확인 어려움 | **Stories** — 모든 variant를 미리 렌더링해서 확인 |
| 새 슬라이드 만들 때 기존 컴포넌트를 어떻게 쓰는지 기억 어려움 | **Docs** — 컴포넌트 카탈로그 + 사용 예시 |
| AI(나)가 임의로 스타일을 추가하는 걸 방지 | **Chromatic** — PR마다 시각적 diff 생성 |

### Storybook 구조

```
src/
├── tokens/
│   └── tokens.ts              ← 값의 유일한 출처
├── components/
│   ├── SlideBase.tsx
│   ├── SlideBase.stories.tsx   ← 모든 variant 시각 확인
│   ├── GlassCard.tsx
│   ├── GlassCard.stories.tsx
│   ├── PromptBlock.tsx
│   ├── PromptBlock.stories.tsx
│   └── ...
├── layouts/
│   ├── TitleSlide.tsx
│   ├── TitleSlide.stories.tsx  ← 샘플 콘텐츠로 레이아웃 확인
│   ├── SplitSlide.tsx
│   ├── CompareSlide.tsx
│   └── ...
└── .storybook/
    ├── main.ts
    └── preview.ts              ← 글로벌 토큰/폰트 주입
```

### Story 예시

```typescript
// GlassCard.stories.tsx
export const Default: Story = {
  args: { children: '기본 카드' }
};

export const WithGlow: Story = {
  args: { children: '글로우 카드', glow: true }
};

// ❌ 이런 Story는 만들지 않음 (자유 스타일)
// export const Custom: Story = {
//   args: { style: { background: 'red' } }
// };
```

### Visual Regression 워크플로우

```
1. Storybook에서 모든 컴포넌트/레이아웃 렌더링
2. 스냅샷 저장 (기준선)
3. 코드 변경 후 새 스냅샷과 비교
4. 의도하지 않은 시각적 변화 → 경고
```

---

## 4. Theme System 데이터 활용 방법

### 직접 적용 (자동)

| 데이터 | 적용 위치 | 방법 |
|-------|----------|------|
| `ux-guidelines.csv` | Storybook addon | 컴포넌트별 관련 UX 규칙을 Storybook 패널에 표시 |
| `styles.csv` → Glassmorphism | `tokens.ts` | CSS 변수, blur 값, opacity를 토큰으로 추출 |
| `styles.csv` → 체크리스트 | CI/Pre-commit | 빌드 전 체크리스트 자동 검증 |

### 참고용 (수동)

| 데이터 | 용도 |
|-------|------|
| `typography.csv` | 폰트 페어링 결정 시 참고 (이미 결정됨: Noto Sans KR + JetBrains Mono) |
| `colors.csv` | 팔레트 변경 시 대안 탐색 |
| `ui-reasoning.csv` | 새로운 제품 유형의 슬라이드 만들 때 스타일 방향 결정 |

---

## 5. 구현 우선순위

### Phase 1: 토큰 + 컴포넌트 (코드만으로 제한)
1. `tokens.ts` 확정 — 모든 값의 유일한 출처
2. 컴포넌트 9개 TypeScript 인터페이스 정의 — `style`/`className` prop 제거
3. 레이아웃 7~9종 정의 — 패딩/갭은 레이아웃이 소유
4. Remotion 프로젝트 세팅 + 컴포넌트 구현

### Phase 2: Storybook (시각적 검증)
5. Storybook 세팅 (Remotion 컴포넌트와 공유)
6. 모든 컴포넌트 + 레이아웃의 Story 작성
7. 기준 스냅샷 생성

### Phase 3: 자동화 (지속적 보장)
8. Chromatic 또는 로컬 visual regression 세팅
9. MASTER.md를 tokens.ts에서 자동 생성하도록 스크립트 작성
10. UX 체크리스트를 pre-commit hook으로 적용

---

## 6. 기대 효과

| 단계 | 예상 퀄리티 | 이유 |
|------|-----------|------|
| 현재 (자유 CSS) | 40~50점 | 매번 다른 값, 일관성 없음 |
| Phase 1 완료 | 70~75점 | 토큰/컴포넌트로 제한, 값이 흔들리지 않음 |
| Phase 2 완료 | 80~85점 | Storybook에서 시각 확인, 의도치 않은 변경 감지 |
| Phase 3 완료 | 85~90점 | 자동화로 퇴행 방지, 새 슬라이드도 동일 퀄리티 |

**핵심:** 감각이 없어도, 감각이 고정된 시스템을 따르면 결과가 일관됩니다.

---

*초안 — 실행 시 우선순위와 범위 조정 가능*
