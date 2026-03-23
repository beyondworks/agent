import type { Meta, StoryObj } from '@storybook/react-vite';
import typographyData from '../data/typography-pairs.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface FontPair {
  'No': string;
  'Font Pairing Name': string;
  'Category': string;
  'Heading Font': string;
  'Body Font': string;
  'Mood/Style Keywords': string;
  'Best For': string;
  'CSS Import': string;
  'Notes': string;
}

const data = typographyData as unknown as FontPair[];

function buildImportUrl(fonts: string[]): string {
  const families = fonts.map(f => f.replace(/ /g, '+') + ':wght@400;700').join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

const allFonts = [...new Set(data.flatMap(d => [d['Heading Font'], d['Body Font']]).filter(Boolean))];
const fontsUrl = buildImportUrl(allFonts);

const FontPairingsPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <style>{`@import url('${fontsUrl}');`}</style>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Font Pairings</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} pairings</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
      {data.map((pair) => (
        <div key={pair['No']} style={{
          background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: 24, backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700, margin: 0 }}>{pair['Font Pairing Name']}</h3>
            <span style={{ color: ACCENT, fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', border: `1px solid ${ACCENT}`, borderRadius: 99 }}>{pair['Category']}</span>
          </div>
          <div style={{ borderRadius: 8, background: 'rgba(255,255,255,0.02)', padding: 16 }}>
            <p style={{ fontFamily: `'${pair['Heading Font']}', serif`, fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY, margin: '0 0 8px' }}>
              {pair['Heading Font']}
            </p>
            <p style={{ fontFamily: `'${pair['Body Font']}', sans-serif`, fontSize: 14, color: TEXT_SECONDARY, margin: 0, lineHeight: 1.6 }}>
              {pair['Body Font']} - The quick brown fox jumps over the lazy dog. 0123456789
            </p>
          </div>
          <p style={{ color: TEXT_SECONDARY, fontSize: 11, margin: 0 }}>
            <strong style={{ color: ACCENT }}>Mood:</strong> {pair['Mood/Style Keywords']}
          </p>
          <p style={{ color: TEXT_SECONDARY, fontSize: 11, margin: 0 }}>
            <strong style={{ color: ACCENT }}>Best for:</strong> {pair['Best For']}
          </p>
          {pair['Notes'] && <p style={{ color: TEXT_MUTED, fontSize: 10, margin: 0 }}>{pair['Notes']}</p>}
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/Font Pairings',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <FontPairingsPage /> };
