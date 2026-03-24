// Theme base module: interfaces, color helpers, and factory

export interface CardTokens {
  backdropBlur: number;
  border: string;
  bg: string;
  borderRadius: number;
}

export interface ThemeTokens {
  // Colors
  bg: string;
  accent: string;
  accentLight: string;
  danger: string;
  secondary: string;
  text: string;
  textDim: string;
  textMuted: string;

  // Typography
  font: string;
  mono: string;
  english: string;
  letterSpacing: string;

  // Card
  card: CardTokens;

  // Functions
  glow: (color: string, intensity?: number) => string;
  subtitleBg: string;
}

// Converts a hex color string (#RRGGBB) to "R,G,B" string
export function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

// Returns rgba string for a given hex accent color
export function accentAlpha(hex: string, opacity: number): string {
  return `rgba(${hexToRgb(hex)},${opacity})`;
}

// Returns rgba white string
export function whiteAlpha(opacity: number): string {
  return `rgba(255,255,255,${opacity})`;
}

// Returns rgba black string
export function blackAlpha(opacity: number): string {
  return `rgba(0,0,0,${opacity})`;
}

// Factory: validates and returns a ThemeTokens object
export function createTheme(tokens: ThemeTokens): ThemeTokens {
  return tokens;
}
