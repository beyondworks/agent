export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  cta: string;
  background: string;
  text: string;
  border: string;
  isDark: boolean;
}

export const palettes: Record<string, ColorPalette> = {
  creator: { name: 'Creator', primary: '#2B303B', secondary: '#4A4558', cta: '#00BCD4', background: '#1A1E26', text: '#ECECEC', border: 'rgba(255,255,255,0.06)', isDark: true },
  ocean: { name: 'Ocean', primary: '#0EA5E9', secondary: '#38BDF8', cta: '#F97316', background: '#F0F9FF', text: '#0C4A6E', border: '#BAE6FD', isDark: false },
  midnight: { name: 'Midnight', primary: '#1E1B4B', secondary: '#312E81', cta: '#F97316', background: '#0F0F23', text: '#F8FAFC', border: 'rgba(255,255,255,0.08)', isDark: true },
  forest: { name: 'Forest', primary: '#059669', secondary: '#10B981', cta: '#F97316', background: '#ECFDF5', text: '#064E3B', border: '#A7F3D0', isDark: false },
  luxury: { name: 'Luxury', primary: '#1C1917', secondary: '#44403C', cta: '#CA8A04', background: '#FAFAF9', text: '#0C0A09', border: '#D6D3D1', isDark: false },
  neon: { name: 'Neon', primary: '#7C3AED', secondary: '#A78BFA', cta: '#F43F5E', background: '#0F0F23', text: '#E2E8F0', border: 'rgba(124,58,237,0.2)', isDark: true },
  coral: { name: 'Coral', primary: '#E11D48', secondary: '#FB7185', cta: '#2563EB', background: '#FFF1F2', text: '#881337', border: '#FECDD3', isDark: false },
  indigo: { name: 'Indigo', primary: '#4F46E5', secondary: '#818CF8', cta: '#F97316', background: '#EEF2FF', text: '#312E81', border: '#C7D2FE', isDark: false },
  carbon: { name: 'Carbon', primary: '#18181B', secondary: '#3F3F46', cta: '#2563EB', background: '#FAFAFA', text: '#09090B', border: '#E4E4E7', isDark: false },
  sunset: { name: 'Sunset', primary: '#F97316', secondary: '#FB923C', cta: '#2563EB', background: '#FFF7ED', text: '#9A3412', border: '#FDBA74', isDark: false },
  fintech: { name: 'Fintech', primary: '#F59E0B', secondary: '#FBBF24', cta: '#8B5CF6', background: '#0F172A', text: '#F8FAFC', border: 'rgba(245,158,11,0.15)', isDark: true },
  health: { name: 'Health', primary: '#0891B2', secondary: '#22D3EE', cta: '#059669', background: '#ECFEFF', text: '#164E63', border: '#A5F3FC', isDark: false },
  pink: { name: 'Pink', primary: '#EC4899', secondary: '#F472B6', cta: '#06B6D4', background: '#FDF2F8', text: '#831843', border: '#FBCFE8', isDark: false },
  cyber: { name: 'Cyber', primary: '#8B5CF6', secondary: '#A78BFA', cta: '#FBBF24', background: '#0F0F23', text: '#F8FAFC', border: 'rgba(139,92,246,0.2)', isDark: true },
  earth: { name: 'Earth', primary: '#92400E', secondary: '#B45309', cta: '#059669', background: '#FFFBEB', text: '#78350F', border: '#FDE68A', isDark: false },
  mono: { name: 'Mono', primary: '#000000', secondary: '#404040', cta: '#000000', background: '#FFFFFF', text: '#000000', border: '#E5E5E5', isDark: false },
  darkMono: { name: 'Dark Mono', primary: '#FFFFFF', secondary: '#A0A0A0', cta: '#FFFFFF', background: '#000000', text: '#FFFFFF', border: 'rgba(255,255,255,0.1)', isDark: true },
  lavender: { name: 'Lavender', primary: '#8B5CF6', secondary: '#C4B5FD', cta: '#10B981', background: '#FAF5FF', text: '#4C1D95', border: '#DDD6FE', isDark: false },
  slate: { name: 'Slate', primary: '#0F172A', secondary: '#334155', cta: '#0369A1', background: '#F8FAFC', text: '#020617', border: '#CBD5E1', isDark: false },
  aurora: { name: 'Aurora', primary: '#06B6D4', secondary: '#8B5CF6', cta: '#F97316', background: '#0F172A', text: '#F8FAFC', border: 'rgba(6,182,212,0.15)', isDark: true },
  biotech: { name: 'Biotech / Life Sciences', primary: '#0EA5E9', secondary: '#0284C7', cta: '#10B981', background: '#F0F9FF', text: '#0C4A6E', border: '#BAE6FD', isDark: false },
};
