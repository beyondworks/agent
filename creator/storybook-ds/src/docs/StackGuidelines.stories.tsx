import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import htmlTailwindData from '../data/stack-html-tailwind.json';
import reactData from '../data/stack-react.json';
import nextjsData from '../data/stack-nextjs.json';
import vueData from '../data/stack-vue.json';
import svelteData from '../data/stack-svelte.json';
import swiftuiData from '../data/stack-swiftui.json';
import reactNativeData from '../data/stack-react-native.json';
import flutterData from '../data/stack-flutter.json';
import shadcnData from '../data/stack-shadcn.json';
import jetpackComposeData from '../data/stack-jetpack-compose.json';
import astroData from '../data/stack-astro.json';
import nuxtjsData from '../data/stack-nuxtjs.json';
import nuxtUiData from '../data/stack-nuxt-ui.json';

const BG_BASE = '#1A1E26';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const TEXT_MUTED = 'rgba(236,236,236,0.3)';
const ACCENT = '#00BCD4';
const CODE_BG = '#15181E';

interface StackRow {
  No: string;
  Category: string;
  Guideline: string;
  Description: string;
  Do: string;
  "Don't": string;
  'Code Good': string;
  'Code Bad': string;
  Severity: string;
  'Docs URL': string;
}

interface StackDef {
  label: string;
  data: StackRow[];
}

const stacks: StackDef[] = [
  { label: 'HTML + Tailwind', data: htmlTailwindData as unknown as StackRow[] },
  { label: 'React', data: reactData as unknown as StackRow[] },
  { label: 'Next.js', data: nextjsData as unknown as StackRow[] },
  { label: 'Vue', data: vueData as unknown as StackRow[] },
  { label: 'Svelte', data: svelteData as unknown as StackRow[] },
  { label: 'SwiftUI', data: swiftuiData as unknown as StackRow[] },
  { label: 'React Native', data: reactNativeData as unknown as StackRow[] },
  { label: 'Flutter', data: flutterData as unknown as StackRow[] },
  { label: 'shadcn/ui', data: shadcnData as unknown as StackRow[] },
  { label: 'Jetpack Compose', data: jetpackComposeData as unknown as StackRow[] },
  { label: 'Astro', data: astroData as unknown as StackRow[] },
  { label: 'Nuxt.js', data: nuxtjsData as unknown as StackRow[] },
  { label: 'Nuxt UI', data: nuxtUiData as unknown as StackRow[] },
];

function severityColor(s: string): string {
  if (s === 'High' || s === 'Critical') return '#EF4444';
  if (s === 'Medium') return '#F59E0B';
  return '#22C55E';
}

function groupByCategory(items: StackRow[]): Record<string, StackRow[]> {
  const g: Record<string, StackRow[]> = {};
  for (const item of items) {
    const k = item.Category || 'Other';
    if (!g[k]) g[k] = [];
    g[k].push(item);
  }
  return g;
}

function CodeBlock({ code, label, borderColor }: { code: string; label: string; borderColor: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: borderColor,
        marginBottom: 4, letterSpacing: '0.05em',
      }}>{label}</div>
      <pre style={{
        background: CODE_BG,
        border: `1px solid ${borderColor}33`,
        borderRadius: 6,
        padding: '8px 10px',
        margin: 0,
        fontFamily: '"JetBrains Mono", "Fira Mono", monospace',
        fontSize: 11,
        color: TEXT_SECONDARY,
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.5,
      }}>{code || '—'}</pre>
    </div>
  );
}

function GuidelineCard({ row }: { row: StackRow }) {
  return (
    <div style={{
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
        <div>
          <span style={{ color: TEXT_MUTED, fontSize: 10, fontFamily: 'monospace', marginRight: 6 }}>#{row.No}</span>
          <span style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 700 }}>{row.Guideline}</span>
        </div>
        <span style={{
          flexShrink: 0,
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          background: severityColor(row.Severity), color: '#000',
        }}>{row.Severity || 'Low'}</span>
      </div>

      {row.Description && (
        <p style={{ color: TEXT_SECONDARY, fontSize: 12, margin: '0 0 12px', lineHeight: 1.6 }}>{row.Description}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={{ background: 'rgba(34,197,94,0.07)', borderRadius: 8, padding: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
          <div style={{ color: '#22C55E', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>DO</div>
          <div style={{ color: TEXT_SECONDARY, fontSize: 12, lineHeight: 1.5 }}>{row.Do || '—'}</div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.07)', borderRadius: 8, padding: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ color: '#EF4444', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>DON'T</div>
          <div style={{ color: TEXT_SECONDARY, fontSize: 12, lineHeight: 1.5 }}>{row["Don't"] || '—'}</div>
        </div>
      </div>

      {(row['Code Good'] || row['Code Bad']) && (
        <div style={{ display: 'flex', gap: 10 }}>
          <CodeBlock code={row['Code Good']} label="GOOD EXAMPLE" borderColor="#22C55E" />
          <CodeBlock code={row['Code Bad']} label="BAD EXAMPLE" borderColor="#EF4444" />
        </div>
      )}
    </div>
  );
}

function StackGuidelinesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stacks[activeIndex];
  const grouped = groupByCategory(active.data);

  return (
    <div style={{ background: BG_BASE, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '32px 32px 0' }}>
        <h1 style={{ color: TEXT_PRIMARY, fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Stack Guidelines</h1>
        <p style={{ color: TEXT_SECONDARY, fontSize: 14, margin: '0 0 24px' }}>
          {stacks.length} stacks · {active.data.length} rules for {active.label}
        </p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        padding: '0 32px 24px',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {stacks.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              background: i === activeIndex ? ACCENT : 'transparent',
              color: i === activeIndex ? '#000' : TEXT_MUTED,
              outline: i === activeIndex ? 'none' : `1px solid ${BORDER}`,
              transition: 'all 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px 48px' }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ color: ACCENT, fontWeight: 700, fontSize: 18 }}>{active.label}</span>
          <span style={{ color: TEXT_MUTED, fontSize: 13, marginLeft: 10 }}>
            {active.data.length} guidelines · {Object.keys(grouped).length} categories
          </span>
        </div>

        {Object.entries(grouped).map(([cat, rows]) => (
          <div key={cat} style={{ marginBottom: 40 }}>
            <h2 style={{
              color: ACCENT, fontSize: 16, fontWeight: 700,
              borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, marginBottom: 16,
            }}>{cat}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rows.map((row) => (
                <GuidelineCard key={row.No} row={row} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Theme System/Stack Guidelines',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;
export const Catalog: Story = { render: () => <StackGuidelinesPage /> };
