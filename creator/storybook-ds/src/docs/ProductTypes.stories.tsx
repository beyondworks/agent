import type { Meta, StoryObj } from '@storybook/react-vite';
import productsData from '../data/products.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';

interface ProductEntry {
  'No': string;
  'Product Type': string;
  'Keywords': string;
  'Primary Style Recommendation': string;
  'Secondary Styles': string;
  'Landing Page Pattern': string;
  'Dashboard Style (if applicable)': string;
  'Color Palette Focus': string;
  'Key Considerations': string;
}

const data = productsData as unknown as ProductEntry[];

const ProductTypesPage = () => (
  <div style={{ padding: 32, background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
    <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Product Type Recommendations</h1>
    <p style={{ color: TEXT_SECONDARY, fontSize: 14, marginBottom: 32 }}>{data.length} product types</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
      {data.map((p) => (
        <div key={p['No']} style={{
          background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: 20, backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <h3 style={{ color: TEXT_PRIMARY, fontSize: 16, fontWeight: 700, margin: 0 }}>{p['Product Type']}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p['Keywords'].split(',').slice(0, 6).map((kw) => (
              <span key={kw} style={{ color: TEXT_MUTED, fontSize: 10, padding: '2px 6px', border: `1px solid ${BORDER}`, borderRadius: 4 }}>{kw.trim()}</span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
            <strong style={{ color: ACCENT }}>Style:</strong> {p['Primary Style Recommendation']}
          </div>
          {p['Secondary Styles'] && (
            <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
              <strong style={{ color: ACCENT }}>Alt styles:</strong> {p['Secondary Styles']}
            </div>
          )}
          <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
            <strong style={{ color: ACCENT }}>Landing:</strong> {p['Landing Page Pattern']}
          </div>
          {p['Dashboard Style (if applicable)'] && (
            <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
              <strong style={{ color: ACCENT }}>Dashboard:</strong> {p['Dashboard Style (if applicable)']}
            </div>
          )}
          <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>
            <strong style={{ color: ACCENT }}>Color mood:</strong> {p['Color Palette Focus']}
          </div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontStyle: 'italic' }}>{p['Key Considerations']}</div>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Theme System/Product Types',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <ProductTypesPage /> };
