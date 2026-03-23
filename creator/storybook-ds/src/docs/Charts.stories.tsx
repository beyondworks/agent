import type { Meta, StoryObj } from '@storybook/react-vite';
import chartsData from '../data/charts.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface ChartEntry {
  'No': string;
  'Data Type': string;
  'Keywords': string;
  'Best Chart Type': string;
  'Secondary Options': string;
  'Color Guidance': string;
  'Performance Impact': string;
  'Accessibility Notes': string;
  'Library Recommendation': string;
  'Interactive Level': string;
}

const data = chartsData as unknown as ChartEntry[];

const ChartsPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Chart Types</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} chart type recommendations</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
      {data.map((c) => (
        <div key={c['No']} style={{
          background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: 20, backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 700, margin: 0 }}>{c['Best Chart Type']}</h3>
              <span style={{ color: TEXT_MUTED, fontSize: 11 }}>{c['Data Type']}</span>
            </div>
            <span style={{ color: ACCENT, fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', border: `1px solid ${ACCENT}`, borderRadius: 99, whiteSpace: 'nowrap' }}>{c['Interactive Level']}</span>
          </div>
          <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0 }}>
            <strong style={{ color: ACCENT }}>Keywords:</strong> {c['Keywords']}
          </p>
          {c['Secondary Options'] && (
            <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0 }}>
              <strong style={{ color: ACCENT }}>Alternatives:</strong> {c['Secondary Options']}
            </p>
          )}
          <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0 }}>
            <strong style={{ color: ACCENT }}>Color:</strong> {c['Color Guidance']}
          </p>
          <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: 0 }}>
            <strong style={{ color: ACCENT }}>Libraries:</strong> {c['Library Recommendation']}
          </p>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ color: TEXT_MUTED }}>{c['Performance Impact']}</span>
            <span style={{ color: TEXT_MUTED }}>{c['Accessibility Notes']}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/Charts',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <ChartsPage /> };
