/**
 * Remotion 슬라이드 디자인 토큰
 * VISUAL_SPEC.md 기반 Deep Black + Neon Green 테마
 * slides.json의 meta.theme으로 오버라이드 가능
 */

/* ── 비주얼 테마 ── */
export const VISUAL_THEME = {
  // 배경
  bg: '#0a0a0a',
  bgSecondary: '#111111',
  bgTertiary: '#1a1a1a',

  // 포인트 컬러
  accent: '#00ff88',
  accentDim: '#00cc66',
  accentGlow: 'rgba(0,255,136,0.15)',

  // 텍스트
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#555555',

  // 상태 컬러
  danger: '#ff4444',
  success: '#00ff88',
  warning: '#ffaa00',

  // 그라디언트
  gradientPurple: 'linear-gradient(135deg, #6b21a8, #a855f7)',
  gradientGreen: 'linear-gradient(135deg, #00ff88, #00cc66)',
} as const;

/* ── 슬라이드 테마 인터페이스 ── */
export interface SlideTheme {
  accent: string;
  accent2: string;
  accent3: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  font: string;
}

export const defaultTheme: SlideTheme = {
  accent: VISUAL_THEME.accent,
  accent2: '#a855f7',
  accent3: VISUAL_THEME.danger,
  bg: VISUAL_THEME.bg,
  surface: VISUAL_THEME.bgSecondary,
  text: VISUAL_THEME.textPrimary,
  muted: VISUAL_THEME.textSecondary,
  font: 'Pretendard',
};

/* ── 타이포그래피 (1920×1080 기준, VISUAL_SPEC.md) ── */
export const TYPOGRAPHY = {
  display: { fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 },
  headline: { fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 },
  title: { fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
  body: { fontSize: 24, fontWeight: 400, lineHeight: 1.6 },
  caption: { fontSize: 18, fontWeight: 400, lineHeight: 1.5 },
  label: { fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, lineHeight: 1.2 },
} as const;

/** 하위 호환: 기존 레이아웃이 typo.t1~t5 사용 */
export const typo = {
  /** Tier 1 — Display (메인 타이틀) */
  t1: { fontSize: TYPOGRAPHY.display.fontSize, fontWeight: TYPOGRAPHY.display.fontWeight, letterSpacing: TYPOGRAPHY.display.letterSpacing, lineHeight: TYPOGRAPHY.display.lineHeight },
  /** Tier 2 — Headline (소제목) */
  t2: { fontSize: TYPOGRAPHY.title.fontSize, fontWeight: TYPOGRAPHY.title.fontWeight, letterSpacing: TYPOGRAPHY.title.letterSpacing, lineHeight: TYPOGRAPHY.title.lineHeight },
  /** Tier 3 — Body (본문) */
  t3: { fontSize: TYPOGRAPHY.body.fontSize, fontWeight: TYPOGRAPHY.body.fontWeight, lineHeight: TYPOGRAPHY.body.lineHeight },
  /** Tier 4 — Label */
  t4: { fontSize: TYPOGRAPHY.label.fontSize, fontWeight: TYPOGRAPHY.label.fontWeight, letterSpacing: TYPOGRAPHY.label.letterSpacing, textTransform: TYPOGRAPHY.label.textTransform, lineHeight: TYPOGRAPHY.label.lineHeight },
  /** Tier 5 — Caption */
  t5: { fontSize: TYPOGRAPHY.caption.fontSize, fontWeight: 600 as const, lineHeight: TYPOGRAPHY.caption.lineHeight },
  /** Mono (코드/수치) */
  mono: { fontSize: 16, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" },
} as const;

/* ── 애니메이션 프리셋 (30fps 기준) ── */
export const ANIMATION_PRESETS = {
  /** 기본 등장 */
  fadeIn: { duration: 15, easing: 'cubicOut' },
  /** 슬라이드업 */
  slideUp: { duration: 18, distance: 40, easing: 'cubicOut' },
  /** 팝 등장 (overshoot) */
  popIn: { duration: 12, easing: 'backOut' },
  /** SVG 선 드로잉 */
  drawLine: { duration: 20, easing: 'cubicOut' },
  /** stagger 간격 */
  stagger: { delay: 5 },
  /** 빛 흐름 효과 속도 */
  lightFlow: { speed: 0.8, duration: 60 },
  /** 바 차트 채움 */
  barFill: { duration: 30, easing: 'cubicOut' },
  /** 바운스 팝 (말풍선) */
  bouncePop: { duration: 12, overshoot: 1.1, easing: 'backOut' },
  /** 텍스트 깜빡임 간격 */
  blinkInterval: { framesPerItem: 20 },
  /** 비교 패널 구분선 드로잉 */
  dividerDraw: { duration: 25, easing: 'cubicOut' },
} as const;

/* ── 간격 (8pt 그리드) ── */
export const sp = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
} as const;

/* ── 그리드 (1920×1080) ── */
export const grid = {
  width: 1920,
  height: 1080,
  columns: 12,
  columnWidth: 120,
  gutter: 24,
  margin: 96,
  contentWidth: 1920 - 96 * 2, // 1728
  span: (n: number) => n * 120 + (n - 1) * 24,
  marginPct: `${(96 / 1920) * 100}%`,
  marginPctV: `${(96 / 1080) * 100}%`,
} as const;

/* ── 테두리 반경 ── */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

/* ── 공통 스타일 헬퍼 ── */
export function slideBase(theme: SlideTheme): React.CSSProperties {
  return {
    width: grid.width,
    height: grid.height,
    background: theme.bg,
    fontFamily: `'${theme.font}', 'Noto Sans KR', sans-serif`,
    color: theme.text,
    overflow: 'hidden',
    position: 'relative',
  };
}

export function safeArea(): React.CSSProperties {
  return {
    position: 'absolute',
    top: grid.marginPctV,
    left: grid.marginPct,
    right: grid.marginPct,
    bottom: grid.marginPctV,
    display: 'flex',
    flexDirection: 'column',
  };
}

export function glassCard(theme: SlideTheme): React.CSSProperties {
  return {
    background: theme.surface,
    border: `1px solid ${VISUAL_THEME.bgTertiary}`,
    borderRadius: radius.lg,
    padding: sp.md,
  };
}
