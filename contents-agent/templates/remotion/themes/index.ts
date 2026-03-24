import { ThemeTokens } from './theme-base';
import { infographicMotionTheme } from './theme-infographic-motion';
import { themeNeobrutalism } from './theme-neobrutalism-claude';

// Theme registry
const themeRegistry: Record<string, ThemeTokens> = {
  'infographic-motion': infographicMotionTheme,
  'neobrutalism-claude': themeNeobrutalism,
};

export const AVAILABLE_THEMES = Object.keys(themeRegistry);

const DEFAULT_THEME = 'infographic-motion';

export function getTheme(name: string): ThemeTokens {
  const theme = themeRegistry[name];
  if (!theme) {
    console.warn(`Theme "${name}" not found. Falling back to "${DEFAULT_THEME}".`);
    return themeRegistry[DEFAULT_THEME];
  }
  return theme;
}

export { infographicMotionTheme, themeNeobrutalism };
export type { ThemeTokens };
