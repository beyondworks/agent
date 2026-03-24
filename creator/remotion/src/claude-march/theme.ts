/**
 * Claude Code March Update — Design Tokens
 * #111111 배경 + #FFC505 골드 악센트
 * taste skill + HeroUI 기반
 */

export const fs = {
  bg: '#111111',
  accent: '#FFC505',
  accentLight: '#FFD84D',
  danger: '#FF4D4D',
  secondary: '#16213e',
  text: '#f1f1f1',
  textDim: 'rgba(241,241,241,0.5)',
  textMuted: 'rgba(241,241,241,0.3)',
  font: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  english: "'Geist', -apple-system, sans-serif",
  letterSpacing: '-0.02em',
  card: {
    backdropBlur: 40,
    border: '1px solid rgba(255,197,5,0.12)',
    bg: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
  },
  glow: (color: string, intensity = 0.15) =>
    `0 0 60px rgba(${color === 'accent' ? '255,197,5' : '255,77,77'},${intensity})`,
  subtitleBg: 'rgba(0,0,0,0.75)',
} as const;
