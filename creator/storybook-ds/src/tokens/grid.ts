export const grid = {
  // 12-column grid for 1920x1080 slides
  slide: {
    width: 1920,
    height: 1080,
    columns: 12,
    columnWidth: 120, // (1920 - 2*96 - 11*24) / 12
    gutter: 24,
    margin: { top: 96, right: 96, bottom: 96, left: 96 },
    safeArea: { top: 96, right: 96, bottom: 96, left: 96 },
  },

  // Column span helpers (how many px for N columns)
  span: (n: number) => n * 120 + (n - 1) * 24,

  // Common layout splits
  splits: {
    '6-6': [6, 6] as const,
    '7-5': [7, 5] as const,
    '8-4': [8, 4] as const,
    '4-4-4': [4, 4, 4] as const,
    '3-3-3-3': [3, 3, 3, 3] as const,
    '3-6-3': [3, 6, 3] as const,
    '12': [12] as const,
  },

  // Vertical rhythm (8px base unit)
  vr: (n: number) => n * 8,
} as const;

// Layout composition types (extended in layout-variations.ts)
export type { LayoutPattern } from './layout-variations';
export {
  patternSpecs,
  contentLayoutMap,
  allPatterns,
  layoutFamilyMap,
  sequenceRules,
  validateSequence,
} from './layout-variations';

// Visual hierarchy layers (attention allocation)
export const hierarchy = {
  layer1_headline: { attention: '50%', fontSize: 'display or h1', weight: 800 },
  layer2_subtext: { attention: '30%', fontSize: 'h2 or h3', weight: 500 },
  layer3_support: { attention: '15%', fontSize: 'body', weight: 400 },
  layer4_meta: { attention: '5%', fontSize: 'caption or label', weight: 300 },
} as const;
