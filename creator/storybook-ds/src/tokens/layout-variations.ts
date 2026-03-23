/**
 * Layout Variation System
 *
 * 콘텐츠 성격에 따라 적절한 레이아웃 패턴을 선택하는 규칙.
 * 같은 구조가 연속으로 반복되지 않도록 한다.
 */

// All available layout patterns for 16:9 slides
export type LayoutPattern =
  | 'center-stage'
  | 'split-7-5'
  | 'split-5-7'
  | 'split-equal'
  | 'asymmetric-8-4'
  | 'asymmetric-4-8'
  | 'bento-grid'
  | 'staggered-rows'
  | 'feature-callout'
  | 'magazine-editorial'
  | 'full-bleed'
  | 'hero-supporting'
  | 'alternating-zigzag'
  | 'filmstrip'
  | 'quote-spotlight'
  | 'data-dashboard'
  | 'timeline'
  | 'comparison-table';

// Content type identifiers
export type ContentType =
  | 'title'
  | 'problem'
  | 'quote'
  | 'comparison'
  | 'list3'
  | 'list4plus'
  | 'code'
  | 'cta'
  | 'process'
  | 'stats';

// Content type -> recommended layouts mapping
export const contentLayoutMap: Record<ContentType, readonly LayoutPattern[]> = {
  title: ['center-stage', 'magazine-editorial', 'split-7-5'],
  problem: ['split-7-5', 'feature-callout', 'asymmetric-8-4'],
  quote: ['quote-spotlight', 'center-stage', 'full-bleed'],
  comparison: ['split-equal', 'alternating-zigzag', 'comparison-table'],
  list3: ['bento-grid', 'feature-callout', 'staggered-rows', 'asymmetric-8-4'],
  list4plus: ['bento-grid', 'data-dashboard', 'alternating-zigzag'],
  code: ['split-equal', 'asymmetric-4-8', 'staggered-rows'],
  cta: ['center-stage', 'full-bleed', 'magazine-editorial'],
  process: ['timeline', 'filmstrip', 'staggered-rows'],
  stats: ['data-dashboard', 'bento-grid', 'hero-supporting'],
} as const;

// Layout family groupings for anti-repetition
export type LayoutFamily = 'center' | 'split' | 'grid' | 'asymmetric' | 'editorial' | 'bleed' | 'sequence' | 'data';

export const layoutFamilyMap: Record<LayoutPattern, LayoutFamily> = {
  'center-stage': 'center',
  'split-7-5': 'split',
  'split-5-7': 'split',
  'split-equal': 'split',
  'asymmetric-8-4': 'asymmetric',
  'asymmetric-4-8': 'asymmetric',
  'bento-grid': 'grid',
  'staggered-rows': 'grid',
  'feature-callout': 'asymmetric',
  'magazine-editorial': 'editorial',
  'full-bleed': 'bleed',
  'hero-supporting': 'asymmetric',
  'alternating-zigzag': 'sequence',
  'filmstrip': 'sequence',
  'quote-spotlight': 'center',
  'data-dashboard': 'data',
  'timeline': 'sequence',
  'comparison-table': 'data',
} as const;

// Anti-repetition rules
export const sequenceRules = {
  description: '연속된 슬라이드에서 같은 레이아웃 패턴을 반복하지 않는다.',
  rules: [
    'center-stage -> center-stage 연속 금지',
    'split-*-* -> split-*-* 연속 금지 (방향이 달라도)',
    'bento/staggered/grid 계열 -> 같은 계열 연속 금지',
    '최소 2슬라이드 간격 후에 같은 패턴 재사용 가능',
    '7슬라이드 세트 기준 최소 5가지 다른 패턴 사용',
  ],
} as const;

/** Validates a slide sequence against anti-repetition rules. */
export function validateSequence(patterns: readonly LayoutPattern[]): {
  valid: boolean;
  violations: { index: number; reason: string }[];
  uniqueFamilies: number;
} {
  const violations: { index: number; reason: string }[] = [];

  for (let i = 1; i < patterns.length; i++) {
    const prev = patterns[i - 1]!;
    const curr = patterns[i]!;

    // Same pattern consecutive
    if (prev === curr) {
      violations.push({ index: i, reason: `같은 패턴 연속: ${curr}` });
      continue;
    }

    // Same family consecutive
    const prevFamily = layoutFamilyMap[prev];
    const currFamily = layoutFamilyMap[curr];
    if (prevFamily === currFamily) {
      violations.push({
        index: i,
        reason: `같은 계열(${currFamily}) 연속: ${prev} -> ${curr}`,
      });
    }
  }

  // Check minimum variety in 7-slide windows
  for (let start = 0; start + 7 <= patterns.length; start++) {
    const window = patterns.slice(start, start + 7);
    const families = new Set(window.map((p) => layoutFamilyMap[p]));
    if (families.size < 5) {
      violations.push({
        index: start,
        reason: `슬라이드 ${start + 1}~${start + 7}: ${families.size}가지 계열만 사용 (최소 5가지 필요)`,
      });
    }
  }

  const uniqueFamilies = new Set(patterns.map((p) => layoutFamilyMap[p])).size;

  return { valid: violations.length === 0, violations, uniqueFamilies };
}

// Grid specification for each pattern (12-column system, 1920x1080)
export interface PatternSpec {
  /** CSS grid-template-columns or flex description */
  columns: string;
  /** Content alignment within the pattern */
  contentAlignment: string;
  /** Content types this pattern works best for */
  bestFor: readonly ContentType[];
  /** Patterns that should NOT immediately precede this one */
  avoidAfter: readonly LayoutPattern[];
  /** Named grid areas (optional) */
  gridAreas?: string;
  /** ASCII sketch of the layout (3-4 lines) */
  sketch: string;
  /** Korean description */
  description: string;
}

export const patternSpecs: Record<LayoutPattern, PatternSpec> = {
  'center-stage': {
    columns: '3fr 6fr 3fr',
    contentAlignment: 'center center',
    bestFor: ['title', 'quote', 'cta'],
    avoidAfter: ['center-stage', 'quote-spotlight'],
    gridAreas: `". content ."`,
    sketch: [
      '|   +---------+   |',
      '|   | CONTENT |   |',
      '|   +---------+   |',
    ].join('\n'),
    description: '단일 포컬포인트, 중앙 배치',
  },

  'split-7-5': {
    columns: '7fr 5fr',
    contentAlignment: 'start center',
    bestFor: ['problem', 'title'],
    avoidAfter: ['split-5-7', 'split-equal', 'split-7-5'],
    gridAreas: `"text visual"`,
    sketch: [
      '|  TEXT     | VISUAL |',
      '|  area     |  area  |',
      '|  (7col)   | (5col) |',
    ].join('\n'),
    description: '좌 7컬럼 텍스트, 우 5컬럼 비주얼',
  },

  'split-5-7': {
    columns: '5fr 7fr',
    contentAlignment: 'center start',
    bestFor: ['problem', 'code'],
    avoidAfter: ['split-7-5', 'split-equal', 'split-5-7'],
    gridAreas: `"visual text"`,
    sketch: [
      '| VISUAL |  TEXT     |',
      '|  area  |  area     |',
      '| (5col) |  (7col)   |',
    ].join('\n'),
    description: '좌 비주얼, 우 텍스트 (반전)',
  },

  'split-equal': {
    columns: '1fr 1fr',
    contentAlignment: 'center center',
    bestFor: ['comparison', 'code'],
    avoidAfter: ['split-7-5', 'split-5-7', 'split-equal'],
    gridAreas: `"left right"`,
    sketch: [
      '|  LEFT   |  RIGHT  |',
      '|  side   |  side   |',
      '| (6col)  | (6col)  |',
    ].join('\n'),
    description: '50/50 균등 분할',
  },

  'asymmetric-8-4': {
    columns: '8fr 4fr',
    contentAlignment: 'start center',
    bestFor: ['problem', 'list3'],
    avoidAfter: ['asymmetric-4-8', 'asymmetric-8-4', 'feature-callout'],
    gridAreas: `"main side"`,
    sketch: [
      '|  MAIN CONTENT  |SIDE|',
      '|  area           |    |',
      '|  (8 columns)    |(4) |',
    ].join('\n'),
    description: '큰 영역 + 작은 보조 영역',
  },

  'asymmetric-4-8': {
    columns: '4fr 8fr',
    contentAlignment: 'center start',
    bestFor: ['code'],
    avoidAfter: ['asymmetric-8-4', 'asymmetric-4-8', 'feature-callout'],
    gridAreas: `"side main"`,
    sketch: [
      '|SIDE|  MAIN CONTENT  |',
      '|    |  area           |',
      '|(4) |  (8 columns)    |',
    ].join('\n'),
    description: '작은 보조 + 큰 영역 (반전)',
  },

  'bento-grid': {
    columns: '1fr 1fr 1fr',
    contentAlignment: 'stretch stretch',
    bestFor: ['list3', 'list4plus', 'stats'],
    avoidAfter: ['staggered-rows', 'bento-grid', 'data-dashboard'],
    gridAreas: `"a a b" "c d d"`,
    sketch: [
      '| A  A  | B    |',
      '|-------+------|',
      '| C    | D  D  |',
    ].join('\n'),
    description: '모듈형 카드 그리드 (다양한 크기)',
  },

  'staggered-rows': {
    columns: '1fr 1fr 1fr 1fr',
    contentAlignment: 'start start',
    bestFor: ['list3', 'code', 'process'],
    avoidAfter: ['bento-grid', 'staggered-rows'],
    sketch: [
      '| ITEM-1   ITEM-2  |',
      '|    ITEM-3   ITEM-4|',
      '| ITEM-5   ITEM-6  |',
    ].join('\n'),
    description: '엇갈린 행 (좌정렬 <-> 우정렬 교차)',
  },

  'feature-callout': {
    columns: '2fr 1fr 1fr',
    contentAlignment: 'start start',
    bestFor: ['problem', 'list3'],
    avoidAfter: ['asymmetric-8-4', 'asymmetric-4-8', 'feature-callout', 'hero-supporting'],
    gridAreas: `"hero sub1" "hero sub2"`,
    sketch: [
      '| HERO      | sub1 |',
      '| card      |------|',
      '| (big)     | sub2 |',
    ].join('\n'),
    description: '큰 주인공 카드 1개 + 작은 보조 2~3개',
  },

  'magazine-editorial': {
    columns: '5fr 1fr 4fr',
    contentAlignment: 'start end',
    bestFor: ['title', 'cta'],
    avoidAfter: ['magazine-editorial', 'quote-spotlight'],
    sketch: [
      '| BIG TYPO  |   |      |',
      '| headline  |   | body |',
      '|           |   | text |',
    ].join('\n'),
    description: '비대칭 타이포 + 여백, 에디토리얼 느낌',
  },

  'full-bleed': {
    columns: '1fr',
    contentAlignment: 'center center',
    bestFor: ['quote', 'cta'],
    avoidAfter: ['full-bleed', 'center-stage'],
    sketch: [
      '|=====================|',
      '|   FULL AREA USED    |',
      '|=====================|',
    ].join('\n'),
    description: '전체 영역 사용 (배경색 전환)',
  },

  'hero-supporting': {
    columns: '1fr',
    contentAlignment: 'center start',
    bestFor: ['stats'],
    avoidAfter: ['feature-callout', 'hero-supporting'],
    gridAreas: `"hero" "support"`,
    sketch: [
      '|  HERO (top 60%)     |',
      '|---------------------|',
      '| sup1 | sup2 | sup3  |',
    ].join('\n'),
    description: '상단 큰 영역 + 하단 작은 보조 영역',
  },

  'alternating-zigzag': {
    columns: '1fr 1fr',
    contentAlignment: 'center center',
    bestFor: ['comparison', 'list4plus'],
    avoidAfter: ['alternating-zigzag', 'split-equal'],
    sketch: [
      '| IMG  | TEXT  |',
      '| TEXT | IMG   |',
      '| IMG  | TEXT  |',
    ].join('\n'),
    description: '홀수행: 좌이미지/우텍스트, 짝수행: 반전',
  },

  filmstrip: {
    columns: 'repeat(auto-fill, 1fr)',
    contentAlignment: 'center start',
    bestFor: ['process'],
    avoidAfter: ['filmstrip', 'timeline'],
    sketch: [
      '| [1] | [2] | [3] | [4] | [5] |',
      '|  ^  |  ^  |  ^  |  ^  |  ^  |',
      '| card  card  card  card  card |',
    ].join('\n'),
    description: '가로 스크롤 느낌의 카드 행',
  },

  'quote-spotlight': {
    columns: '2fr 8fr 2fr',
    contentAlignment: 'center center',
    bestFor: ['quote'],
    avoidAfter: ['center-stage', 'quote-spotlight', 'full-bleed'],
    gridAreas: `". quote ."`,
    sketch: [
      '|    +-------------+    |',
      '|    | " QUOTE  "  |    |',
      '|    +-------------+    |',
    ].join('\n'),
    description: '인용문에 특화된 극단적 여백',
  },

  'data-dashboard': {
    columns: '1fr 1fr 1fr 1fr',
    contentAlignment: 'start start',
    bestFor: ['stats', 'list4plus'],
    avoidAfter: ['bento-grid', 'data-dashboard', 'comparison-table'],
    gridAreas: `"a b c d" "e e f f"`,
    sketch: [
      '| N1 | N2 | N3 | N4 |',
      '|---------+---------|',
      '| chart1  | chart2  |',
    ].join('\n'),
    description: '숫자/통계를 강조하는 멀티컬럼',
  },

  timeline: {
    columns: '1fr auto 1fr',
    contentAlignment: 'center center',
    bestFor: ['process'],
    avoidAfter: ['timeline', 'filmstrip'],
    gridAreas: `"left line right"`,
    sketch: [
      '| step1 | | |       |',
      '|       | |o| step2 |',
      '| step3 | | |       |',
    ].join('\n'),
    description: '좌우 교차 타임라인',
  },

  'comparison-table': {
    columns: '3fr 4.5fr 4.5fr',
    contentAlignment: 'start start',
    bestFor: ['comparison'],
    avoidAfter: ['comparison-table', 'data-dashboard', 'split-equal'],
    gridAreas: `"label col1 col2"`,
    sketch: [
      '| Label | ColA | ColB |',
      '|-------|------|------|',
      '| row2  | val  | val  |',
    ].join('\n'),
    description: '표 형태 비교',
  },
} as const;

/** All pattern names in order */
export const allPatterns: readonly LayoutPattern[] = Object.keys(patternSpecs) as LayoutPattern[];
