import type { Meta, StoryObj } from '@storybook/react-vite';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';
const CODE_BG = '#15181E';

interface NormRule {
  name: string;
  explanation: string;
  css: string;
}

const rules: NormRule[] = [
  {
    name: 'CSS Reset — Box Sizing',
    explanation: 'Forces all elements to include padding and border in their declared width/height, preventing unexpected overflow.',
    css: `*, *::before, *::after {
  box-sizing: border-box;
}`,
  },
  {
    name: 'CSS Reset — Margin & Padding',
    explanation: 'Removes browser-default margins and padding from all elements, providing a consistent blank slate across browsers.',
    css: `* {
  margin: 0;
  padding: 0;
}`,
  },
  {
    name: 'Default Font — Body (Noto Sans KR)',
    explanation: 'Sets Noto Sans KR as the default body typeface with a comfortable base size and line-height for Korean/Latin mixed content.',
    css: `body {
  font-family: 'Noto Sans KR', 'Noto Sans', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
  },
  {
    name: 'Default Font — Code (JetBrains Mono)',
    explanation: 'Applies JetBrains Mono to all code, pre, and kbd elements for consistent monospace rendering with ligature support.',
    css: `code, pre, kbd, samp {
  font-family: 'JetBrains Mono', 'Fira Mono', 'Cascadia Code', monospace;
  font-size: 0.875em;
  font-variant-ligatures: common-ligatures;
}`,
  },
  {
    name: 'Dark Mode — Background & Text',
    explanation: 'Establishes the base dark surface color and primary text color, ensuring sufficient contrast (WCAG AA ≥ 4.5:1).',
    css: `:root {
  --bg-base: #1A1E26;
  --text-primary: #ECECEC;
  --text-secondary: rgba(236, 236, 236, 0.6);
  --text-muted: rgba(236, 236, 236, 0.3);
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
}`,
  },
  {
    name: 'Dark Mode — Selection Color',
    explanation: 'Overrides the default browser selection highlight with an accent-tinted background, keeping text readable on dark surfaces.',
    css: `::selection {
  background-color: rgba(0, 188, 212, 0.3);
  color: #ECECEC;
}

::-moz-selection {
  background-color: rgba(0, 188, 212, 0.3);
  color: #ECECEC;
}`,
  },
  {
    name: 'Slide — 16:9 Aspect Ratio',
    explanation: 'Constrains slide containers to a strict 16:9 ratio and hides overflow, ensuring content never bleeds outside the frame during rendering.',
    css: `.slide {
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  position: relative;
}`,
  },
  {
    name: 'Slide — Font Smoothing',
    explanation: 'Enables subpixel and grayscale antialiasing on slide containers so text looks crisp at all zoom levels and in video exports.',
    css: `.slide {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}`,
  },
  {
    name: 'Animation — prefers-reduced-motion',
    explanation: 'Disables all CSS transitions and animations for users who have requested reduced motion in their OS accessibility settings.',
    css: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
  },
  {
    name: 'Focus Styles — Visible Focus Ring',
    explanation: 'Replaces the browser default outline with a high-contrast accent ring, satisfying WCAG 2.4.11 (Focus Appearance) for keyboard navigation.',
    css: `:focus-visible {
  outline: 2px solid #00BCD4;
  outline-offset: 2px;
  border-radius: 3px;
}

:focus:not(:focus-visible) {
  outline: none;
}`,
  },
  {
    name: 'Scrollbar Styling — Thin Dark',
    explanation: 'Applies a minimal dark scrollbar to keep the UI consistent on dark surfaces without relying on the operating system default.',
    css: `/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}`,
  },
  {
    name: 'Image Defaults',
    explanation: 'Prevents images from overflowing their containers and removes the inline baseline gap that causes unwanted whitespace below images.',
    css: `img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}`,
  },
];

function RuleCard({ rule }: { rule: NormRule }) {
  return (
    <div style={{
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px 12px' }}>
        <h3 style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>{rule.name}</h3>
        <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{rule.explanation}</p>
      </div>
      <pre style={{
        background: CODE_BG,
        borderTop: `1px solid ${BORDER}`,
        margin: 0,
        padding: '14px 20px',
        fontFamily: '"JetBrains Mono", "Fira Mono", monospace',
        fontSize: 11,
        color: TEXT_SECONDARY,
        overflowX: 'auto',
        whiteSpace: 'pre',
        lineHeight: 1.6,
      }}>{rule.css}</pre>
    </div>
  );
}

function NormalizationPage() {
  return (
    <div style={{ background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '32px 32px 64px' }}>
      <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Normalization & Reset</h1>
      <p style={{ color: TEXT_SECONDARY, fontSize: 14, margin: '0 0 8px' }}>
        Base CSS rules applied before any component styles. Ensures a consistent cross-browser baseline for all slides and UI.
      </p>
      <p style={{ color: TEXT_MUTED, fontSize: 12, margin: '0 0 40px' }}>
        {rules.length} rules across: Box Model · Fonts · Dark Mode · Slides · Animations · Accessibility · Scrollbars · Images
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rules.map((rule) => (
          <RuleCard key={rule.name} rule={rule} />
        ))}
      </div>

      <div style={{
        marginTop: 48, padding: 20,
        background: `linear-gradient(135deg, rgba(0,188,212,0.06), rgba(0,188,212,0.02))`,
        border: `1px solid rgba(0,188,212,0.15)`,
        borderRadius: 12,
      }}>
        <div style={{ color: ACCENT, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Apply Order</div>
        <div style={{ color: TEXT_SECONDARY, fontSize: 12, lineHeight: 1.8 }}>
          1. Box Model Reset → 2. Margin/Padding Reset → 3. Body Font → 4. Code Font → 5. Dark Mode Vars →
          6. Selection Color → 7. Slide Constraints → 8. Font Smoothing → 9. Reduced Motion → 10. Focus Ring →
          11. Scrollbar → 12. Image Defaults
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Theme System/Normalization',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Rules: Story = { render: () => <NormalizationPage /> };
