import type { Meta, StoryObj } from '@storybook/react-vite';
import colorsData from '../data/colors.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface ColorEntry {
  'No': string;
  'Product Type': string;
  'Primary (Hex)': string;
  'Secondary (Hex)': string;
  'CTA (Hex)': string;
  'Background (Hex)': string;
  'Text (Hex)': string;
  'Border (Hex)': string;
  'Notes': string;
}

const swatchStyle = (color: string): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: 8,
  background: color,
  border: `1px solid ${BORDER}`,
  flexShrink: 0,
});

function groupByType(data: ColorEntry[]): Record<string, ColorEntry[]> {
  const groups: Record<string, ColorEntry[]> = {};
  for (const entry of data) {
    const key = entry['Product Type'] || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}

const AllColorsPage = () => {
  const grouped = groupByType(colorsData as unknown as ColorEntry[]);
  return (
    <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Color Palettes</h1>
      <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{colorsData.length} palettes across {Object.keys(grouped).length} product types</p>
      {Object.entries(grouped).map(([type, entries]) => (
        <div key={type} style={{ marginBottom: 40 }}>
          <h2 style={{ color: ACCENT, fontSize: 18, fontWeight: 700, marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 8 }}>{type}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
            {entries.map((e) => {
              const swatches = [
                { label: 'Primary', hex: e['Primary (Hex)'] },
                { label: 'Secondary', hex: e['Secondary (Hex)'] },
                { label: 'CTA', hex: e['CTA (Hex)'] },
                { label: 'BG', hex: e['Background (Hex)'] },
                { label: 'Text', hex: e['Text (Hex)'] },
              ];
              return (
                <div key={e['No']} style={{
                  background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: 16, backdropFilter: 'blur(12px)',
                }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    {swatches.map((sw) => (
                      <div key={sw.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={swatchStyle(sw.hex)} />
                        <span style={{ color: TEXT_MUTED, fontSize: 9 }}>{sw.label}</span>
                        <span style={{ color: TEXT_MUTED, fontSize: 9, fontFamily: 'monospace' }}>{sw.hex}</span>
                      </div>
                    ))}
                  </div>
                  {e['Notes'] && <p style={{ color: TEXT_SECONDARY, fontSize: 11, margin: 0 }}>{e['Notes']}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: 'Theme System/Color Palettes',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <AllColorsPage /> };
