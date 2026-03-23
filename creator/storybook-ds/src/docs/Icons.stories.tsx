import type { Meta, StoryObj } from '@storybook/react-vite';
import iconsData from '../data/icons.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface IconEntry {
  'No': string;
  'Category': string;
  'Icon Name': string;
  'Keywords': string;
  'Library': string;
  'Import Code': string;
  'Usage': string;
  'Best For': string;
  'Style': string;
}

const data = iconsData as unknown as IconEntry[];

function groupByCategory(items: IconEntry[]): Record<string, IconEntry[]> {
  const g: Record<string, IconEntry[]> = {};
  for (const item of items) {
    const k = item['Category'] || 'Other';
    if (!g[k]) g[k] = [];
    g[k].push(item);
  }
  return g;
}

const IconsPage = () => {
  const grouped = groupByCategory(data);
  return (
    <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Icon Guidelines</h1>
      <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} icons across {Object.keys(grouped).length} categories</p>
      {Object.entries(grouped).map(([cat, icons]) => (
        <div key={cat} style={{ marginBottom: 40 }}>
          <h2 style={{ color: ACCENT, fontSize: 18, fontWeight: 700, marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 8 }}>{cat}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {icons.map((icon) => (
              <div key={icon['No']} style={{
                background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
                padding: 14, backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: TEXT_PRIMARY, fontSize: 13, fontWeight: 700, margin: 0 }}>{icon['Icon Name']}</h4>
                  <span style={{ color: TEXT_MUTED, fontSize: 9, fontFamily: 'monospace' }}>{icon['Style']}</span>
                </div>
                <div style={{ color: TEXT_MUTED, fontSize: 10 }}>{icon['Keywords']}</div>
                <div style={{ color: TEXT_SECONDARY, fontSize: 11 }}>
                  <strong style={{ color: ACCENT }}>Library:</strong> {icon['Library']}
                </div>
                <code style={{ color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: 4, overflowX: 'auto' }}>{icon['Import Code']}</code>
                <div style={{ color: TEXT_SECONDARY, fontSize: 11 }}>{icon['Best For']}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: 'Theme System/Icons',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <IconsPage /> };
