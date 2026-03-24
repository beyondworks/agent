import { ThemeTokens, createTheme } from './theme-base';

// Neobrutalism style: hard edges, offset shadows, no blur, Claude identity colors
function neoBrutalGlow(color: string, intensity: number = 1): string {
  const offset = Math.round(4 + intensity * 2);
  return `${offset}px ${offset}px 0 ${color}`;
}

export const themeNeobrutalism: ThemeTokens = createTheme({
  // Colors — Claude identity (cream/terracotta palette)
  bg: '#FFF8F0',
  accent: '#D4714E',
  accentLight: '#E8956A',
  danger: '#C0392B',
  secondary: '#2C2C2C',
  text: '#1A1A1A',
  textDim: 'rgba(26,26,26,0.5)',
  textMuted: 'rgba(26,26,26,0.3)',

  // Typography
  font: 'Pretendard',
  mono: 'JetBrains Mono',
  english: 'Geist',
  letterSpacing: '-0.02em',

  // Card — neobrutalism: thick border, opaque bg, no blur, offset shadow
  card: {
    backdropBlur: 0,
    border: '3px solid #1A1A1A',
    bg: '#FFFFFF',
    borderRadius: 12,
  },

  // Glow replaced with neobrutalist offset border/shadow
  glow: neoBrutalGlow,

  subtitleBg: 'rgba(26,26,26,0.85)',
});
