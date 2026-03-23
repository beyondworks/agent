export const colors = {
  bg: {
    base: '#1A1E26',
    slide: '#2B303B',
    card: 'rgba(255, 255, 255, 0.03)',
  },
  text: {
    primary: '#ECECEC',
    secondary: 'rgba(236, 236, 236, 0.6)',
    muted: 'rgba(236, 236, 236, 0.3)',
    accent: 'rgba(0, 188, 212, 0.85)',
  },
  accent: {
    primary: '#00BCD4',
    soft: 'rgba(0, 188, 212, 0.1)',
    border: 'rgba(0, 188, 212, 0.15)',
  },
  border: {
    glass: 'rgba(255, 255, 255, 0.06)',
    dim: 'rgba(255, 255, 255, 0.04)',
  },
  orb: {
    teal: 'radial-gradient(ellipse at 75% 20%, rgba(0, 188, 212, 0.08) 0%, transparent 60%)',
    purple: 'radial-gradient(ellipse at 25% 80%, rgba(74, 69, 88, 0.25) 0%, transparent 60%)',
  },
  palette: {
    darkNavy: '#2B303B',
    darkPurple: '#4A4558',
    teal: '#00BCD4',
    lightGray: '#ECECEC',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const fontSize = {
  display: 96,
  h1: 72,
  h2: 48,
  h3: 36,
  body: 24,
  caption: 18,
  label: 14,
  mono: 20,
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
  black: 900,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const blur = {
  glass: 24,
  subtle: 12,
} as const;

export const fontFamily = {
  sans: "'Noto Sans KR', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;
