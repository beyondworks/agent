export interface FontSet {
  name: string;
  heading: string;
  body: string;
  mono: string;
  importUrl: string;
}

export const fonts: Record<string, FontSet> = {
  default: {
    name: 'Noto Sans KR',
    heading: "'Noto Sans KR', sans-serif",
    body: "'Noto Sans KR', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  outfit: {
    name: 'Outfit + Rubik',
    heading: "'Outfit', sans-serif",
    body: "'Rubik', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Rubik:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  inter: {
    name: 'Inter',
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  spaceGrotesk: {
    name: 'Space Grotesk + DM Sans',
    heading: "'Space Grotesk', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  poppins: {
    name: 'Poppins + Open Sans',
    heading: "'Poppins', sans-serif",
    body: "'Open Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  playfair: {
    name: 'Playfair Display + Inter',
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  bebas: {
    name: 'Bebas Neue + Source Sans 3',
    heading: "'Bebas Neue', sans-serif",
    body: "'Source Sans 3', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  cormorant: {
    name: 'Cormorant + Libre Baskerville',
    heading: "'Cormorant Garamond', serif",
    body: "'Libre Baskerville', serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  lexend: {
    name: 'Lexend Mega + Public Sans',
    heading: "'Lexend Mega', sans-serif",
    body: "'Public Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@400;500;600;700;800;900&family=Public+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  raleway: {
    name: 'Raleway + Lato',
    heading: "'Raleway', sans-serif",
    body: "'Lato', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&family=Lato:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  montserrat: {
    name: 'Montserrat + Hind',
    heading: "'Montserrat', sans-serif",
    body: "'Hind', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Hind:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  system: {
    name: 'System',
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, monospace",
    importUrl: "",
  },
  pressStart: {
    name: 'Press Start 2P',
    heading: "'Press Start 2P', monospace",
    body: "'Space Mono', monospace",
    mono: "'Space Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap",
  },
  dmSerif: {
    name: 'DM Serif + DM Sans',
    heading: "'DM Serif Display', serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  archivo: {
    name: 'Archivo Black + Work Sans',
    heading: "'Archivo Black', sans-serif",
    body: "'Work Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  interPretendard: {
    name: 'Inter + Pretendard',
    heading: "'Inter', 'Pretendard Variable', 'Pretendard', sans-serif",
    body: "'Pretendard Variable', 'Pretendard', 'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
};
