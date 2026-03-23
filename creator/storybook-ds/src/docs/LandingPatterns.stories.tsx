import type { Meta, StoryObj } from '@storybook/react-vite';
import landingData from '../data/landing.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface LandingEntry {
  'No': string;
  'Pattern Name': string;
  'Keywords': string;
  'Section Order': string;
  'Primary CTA Placement': string;
  'Color Strategy': string;
  'Recommended Effects': string;
  'Conversion Optimization': string;
}

const data = landingData as unknown as LandingEntry[];

const LandingPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Landing Page Patterns</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} patterns</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {data.map((p) => (
        <div key={p['No']} style={{
          background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: 24, backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 700, margin: 0 }}>{p['Pattern Name']}</h3>
            <span style={{ color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace' }}>#{p['No']}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
            <div>
              <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Section Order</div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{p['Section Order']}</div>
            </div>
            <div>
              <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>CTA Placement</div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{p['Primary CTA Placement']}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Color Strategy</div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{p['Color Strategy']}</div>
            </div>
            <div>
              <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Effects</div>
              <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{p['Recommended Effects']}</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ color: ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Conversion Strategy</div>
            <div style={{ color: TEXT_SECONDARY, fontSize: 12 }}>{p['Conversion Optimization']}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/Landing Patterns',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <LandingPage /> };
