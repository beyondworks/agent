import type { Meta, StoryObj } from '@storybook/react-vite';
import stylesData from '../data/styles.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

function parseHexColors(str: string): string[] {
  const matches = str.match(/#[0-9A-Fa-f]{6}/g);
  return matches ?? [];
}

function complexityColor(c: string): string {
  if (c === 'Low') return '#4CAF50';
  if (c === 'Medium') return '#FFC107';
  return '#F44336';
}

function ratingLabel(val: string): { color: string } {
  if (val.includes('Excellent') || val.includes('AAA')) return { color: '#4CAF50' };
  if (val.includes('Good') || val.includes('AA')) return { color: '#8BC34A' };
  if (val.includes('Low') || val.includes('Partial')) return { color: '#FFC107' };
  return { color: TEXT_SECONDARY };
}

const card: React.CSSProperties = {
  background: BG_CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 20,
  backdropFilter: 'blur(12px)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const StylesPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Style Catalog</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{stylesData.length} styles</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340, 1fr))', gap: 20 }}>
      {stylesData.map((s) => {
        const colors = parseHexColors(s['Primary Colors'] ?? '');
        return (
          <div key={s['No']} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 700, margin: 0 }}>{s['Style Category']}</h3>
                <span style={{ color: TEXT_MUTED, fontSize: 11, fontFamily: 'monospace' }}>{s['Type']}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                background: complexityColor(s['Complexity']),
                color: '#000',
              }}>{s['Complexity']}</span>
            </div>

            <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0 }}>{s['Keywords']}</p>

            {colors.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {colors.map((c, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `1px solid ${BORDER}` }} />
                    <span style={{ color: TEXT_MUTED, fontSize: 9, fontFamily: 'monospace' }}>{c}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
              <strong style={{ color: ACCENT }}>Best for:</strong> {s['Best For']}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
              <span style={{ color: ratingLabel(s['Performance']).color }}>Perf: {s['Performance']}</span>
              <span style={{ color: ratingLabel(s['Accessibility']).color }}>A11y: {s['Accessibility']}</span>
              <span style={{ color: ratingLabel(s['Mobile-Friendly']).color }}>Mobile: {s['Mobile-Friendly']}</span>
            </div>

            <div style={{ fontSize: 11, color: TEXT_MUTED }}>{s['Era/Origin']}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/Styles',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <StylesPage /> };
