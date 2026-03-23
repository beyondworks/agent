import type { Meta, StoryObj } from '@storybook/react-vite';
import reasoningData from '../data/reasoning.json';

const BG_BASE = '#1A1E26';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const ACCENT = '#00BCD4';

interface ReasoningEntry {
  'No': string;
  'UI_Category': string;
  'Recommended_Pattern': string;
  'Style_Priority': string;
  'Color_Mood': string;
  'Typography_Mood': string;
  'Key_Effects': string;
  'Decision_Rules': string;
  'Anti_Patterns': string;
  'Severity': string;
}

const data = reasoningData as unknown as ReasoningEntry[];

function severityColor(s: string): string {
  if (s === 'HIGH' || s === 'CRITICAL') return '#F44336';
  if (s === 'MEDIUM') return '#FFC107';
  return '#4CAF50';
}

const UiReasoningPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>UI Reasoning Rules</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} decision rules</p>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['Category', 'Pattern', 'Style Priority', 'Color Mood', 'Typography', 'Anti-Patterns', 'Severity'].map((h) => (
              <th key={h} style={{ color: ACCENT, fontWeight: 700, padding: '10px 12px', textAlign: 'left', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r['No']} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ color: TEXT_PRIMARY, padding: '10px 12px', fontWeight: 600 }}>{r['UI_Category']}</td>
              <td style={{ color: TEXT_SECONDARY, padding: '10px 12px' }}>{r['Recommended_Pattern']}</td>
              <td style={{ color: TEXT_SECONDARY, padding: '10px 12px' }}>{r['Style_Priority']}</td>
              <td style={{ color: TEXT_SECONDARY, padding: '10px 12px' }}>{r['Color_Mood']}</td>
              <td style={{ color: TEXT_SECONDARY, padding: '10px 12px' }}>{r['Typography_Mood']}</td>
              <td style={{ color: '#F44336', padding: '10px 12px', fontSize: 11 }}>{r['Anti_Patterns']}</td>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: severityColor(r['Severity']), color: '#000' }}>{r['Severity']}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/UI Reasoning',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <UiReasoningPage /> };
