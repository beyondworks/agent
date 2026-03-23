import type { Meta, StoryObj } from '@storybook/react-vite';
import webData from '../data/web-interface.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface WebEntry {
  'No': string;
  'Category': string;
  'Issue': string;
  'Keywords': string;
  'Platform': string;
  'Description': string;
  'Do': string;
  "Don't": string;
  'Code Example Good': string;
  'Code Example Bad': string;
  'Severity': string;
}

const data = webData as unknown as WebEntry[];

function severityColor(s: string): string {
  if (s === 'Critical' || s === 'High') return '#F44336';
  if (s === 'Medium') return '#FFC107';
  return '#4CAF50';
}

function groupByCategory(items: WebEntry[]): Record<string, WebEntry[]> {
  const g: Record<string, WebEntry[]> = {};
  for (const item of items) {
    const k = item['Category'] || 'Other';
    if (!g[k]) g[k] = [];
    g[k].push(item);
  }
  return g;
}

const WebInterfacePage = () => {
  const grouped = groupByCategory(data);
  return (
    <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Web Interface Guidelines</h1>
      <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} guidelines across {Object.keys(grouped).length} categories</p>
      {Object.entries(grouped).map(([cat, rules]) => (
        <div key={cat} style={{ marginBottom: 40 }}>
          <h2 style={{ color: ACCENT, fontSize: 18, fontWeight: 700, marginBottom: 16, borderBottom: `1px solid ${BORDER}`, paddingBottom: 8 }}>{cat}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rules.map((r) => (
              <div key={r['No']} style={{
                background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
                padding: 20, backdropFilter: 'blur(12px)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700, margin: 0 }}>{r['Issue']}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace' }}>{r['Platform']}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: severityColor(r['Severity']), color: '#000',
                    }}>{r['Severity']}</span>
                  </div>
                </div>
                <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: '0 0 12px' }}>{r['Description']}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: 'rgba(76,175,80,0.08)', borderRadius: 8, padding: 12, border: '1px solid rgba(76,175,80,0.2)' }}>
                    <div style={{ color: '#4CAF50', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>DO</div>
                    <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{r['Do']}</div>
                  </div>
                  <div style={{ background: 'rgba(244,67,54,0.08)', borderRadius: 8, padding: 12, border: '1px solid rgba(244,67,54,0.2)' }}>
                    <div style={{ color: '#F44336', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>DON'T</div>
                    <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{r["Don't"]}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ color: '#4CAF50', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Good Example</div>
                    <code style={{ display: 'block', color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace', background: 'rgba(76,175,80,0.05)', padding: 8, borderRadius: 6, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{r['Code Example Good']}</code>
                  </div>
                  <div>
                    <div style={{ color: '#F44336', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Bad Example</div>
                    <code style={{ display: 'block', color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace', background: 'rgba(244,67,54,0.05)', padding: 8, borderRadius: 6, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{r['Code Example Bad']}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: 'Theme System/Web Interface',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <WebInterfacePage /> };
