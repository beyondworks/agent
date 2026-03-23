import type { Meta, StoryObj } from '@storybook/react-vite';

const textRoles = {
  readable: {
    headline: { size: '2.2vw', weight: 800, lineHeight: 1.2, label: 'headline', attention: 50 },
    subheadline: { size: '1.1vw', weight: 400, lineHeight: 1.7, label: 'subheadline', attention: 30 },
    body: { size: '0.85vw', weight: 400, lineHeight: 1.75, label: 'body', attention: 15 },
    caption: { size: '0.65vw', weight: 400, lineHeight: 1.6, label: 'caption', attention: 5 },
  },
  decorative: {
    marker: { size: '0.52vw', weight: 600, opacity: 0.7, label: 'marker' },
    cli: { size: '0.55vw', weight: 400, opacity: 0.35, label: 'cli' },
    accent: { size: '3.5vw', weight: 300, opacity: 0.15, label: 'accent' },
    index: { size: '0.6vw', weight: 700, label: 'index' },
    code: { size: '0.55vw', weight: 400, lineHeight: 1.9, label: 'code' },
  },
} as const;

const BG = '#2B303B';
const TEXT_PRIMARY = '#E8E8E8';
const TEXT_SECONDARY = '#A0A8B8';
const TEXT_MUTED = '#6B7280';
const ACCENT_ORANGE = '#FF6B35';
const ACCENT_TEAL = '#4ECDC4';
const ACCENT_YELLOW = '#FFE66D';
const ACCENT_PINK = '#FF6B8A';
const BAR_COLOR = '#4ECDC4';

const FONT_HEADING = "'Inter', sans-serif";
const FONT_BODY = "'Pretendard Variable', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const attentionColors: Record<number, string> = {
  50: ACCENT_ORANGE,
  30: ACCENT_TEAL,
  15: ACCENT_YELLOW,
  5: ACCENT_PINK,
};

function ReadableRow({ role, text, pxRef }: { role: keyof typeof textRoles.readable; text: string; pxRef: string }) {
  const spec = textRoles.readable[role];
  const barColor = attentionColors[spec.attention] ?? BAR_COLOR;
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'stretch', marginBottom: 32 }}>
      {/* attention bar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, flexShrink: 0 }}>
        <div
          style={{
            width: 6,
            height: `${spec.attention}%`,
            minHeight: 4,
            background: barColor,
            borderRadius: 3,
          }}
        />
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: TEXT_MUTED, marginTop: 4 }}>
          {spec.attention}%
        </span>
      </div>
      {/* text sample */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              color: barColor,
              textTransform: 'uppercase' as const,
              letterSpacing: 1,
            }}
          >
            {spec.label}
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: TEXT_MUTED }}>
            {spec.size} / {spec.weight} / lh {spec.lineHeight} ({pxRef})
          </span>
        </div>
        <div
          style={{
            fontFamily: role === 'headline' ? FONT_HEADING : FONT_BODY,
            fontSize: spec.size,
            fontWeight: spec.weight,
            lineHeight: spec.lineHeight,
            color: role === 'body' ? TEXT_SECONDARY : role === 'caption' ? TEXT_MUTED : TEXT_PRIMARY,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function DecorativeRow({
  role,
  children,
  pxRef,
}: {
  role: keyof typeof textRoles.decorative;
  children: React.ReactNode;
  pxRef: string;
}) {
  const spec = textRoles.decorative[role];
  const opacity = 'opacity' in spec ? spec.opacity : 1;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            color: ACCENT_TEAL,
            textTransform: 'uppercase' as const,
            letterSpacing: 1,
          }}
        >
          {spec.label}
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: TEXT_MUTED }}>
          {spec.size} / {spec.weight} / opacity {opacity} ({pxRef})
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: spec.size,
          fontWeight: spec.weight,
          lineHeight: 'lineHeight' in spec ? spec.lineHeight : 1.4,
          opacity,
          color: TEXT_PRIMARY,
          textTransform: role === 'marker' ? ('uppercase' as const) : ('none' as const),
          letterSpacing: role === 'marker' ? 2 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const rulesData = [
  { rule: 'Readable text must pass WCAG AA contrast (4.5:1 minimum)', applies: 'headline, subheadline, body, caption' },
  { rule: 'Decorative text is exempt from contrast requirements', applies: 'marker, cli, accent, index, code' },
  { rule: 'Only ONE headline per slide (attention anchor)', applies: 'headline' },
  { rule: 'Subheadline supplements headline, never competes', applies: 'subheadline' },
  { rule: 'CLI text is atmosphere — opacity 0.35, never readable', applies: 'cli' },
  { rule: 'Accent elements are decorative flourishes — opacity 0.15', applies: 'accent' },
  { rule: 'Section tags (PROBLEM, SKILLS, etc.) are markers, not headlines', applies: 'marker' },
  { rule: 'Index numbers in badges are decorative, not content', applies: 'index' },
  { rule: 'Code blocks use mono at decorative.code size', applies: 'code' },
  { rule: 'Maximum 60% of slide area for content (whitespace rule)', applies: 'all' },
];

function TextRolesDoc() {
  return (
    <div
      style={{
        background: BG,
        borderRadius: 16,
        padding: 48,
        fontFamily: FONT_BODY,
        color: TEXT_PRIMARY,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 48, textAlign: 'center' as const }}>
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 28,
            fontWeight: 800,
            color: TEXT_PRIMARY,
            marginBottom: 8,
          }}
        >
          Text Role System
        </h1>
        <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: TEXT_MUTED }}>
          ALL text splits into two categories: READABLE (content) vs DECORATIVE (design element)
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 48, marginBottom: 56 }}>
        {/* Left: Readable */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
              paddingBottom: 16,
              borderBottom: `2px solid ${ACCENT_ORANGE}`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 16,
                fontWeight: 700,
                color: ACCENT_ORANGE,
                textTransform: 'uppercase' as const,
                letterSpacing: 2,
              }}
            >
              Readable
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: TEXT_MUTED }}>
              — content the viewer must read
            </span>
          </div>

          <ReadableRow role="headline" text="설계하는 사람이 직접 만드는 시대" pxRef="~42px at 1920" />
          <ReadableRow
            role="subheadline"
            text="코드를 몰라도, 구조를 아는 사람은 만들 수 있습니다."
            pxRef="~21px at 1920"
          />
          <ReadableRow
            role="body"
            text="수백 장의 기획서를 쓸 수 있지만, 정작 화면 하나 만들지 못하는 기획자의 현실."
            pxRef="~16px at 1920"
          />
          <ReadableRow role="caption" text="— 12년간 브리프를 써온 기획자의 결론" pxRef="~12px at 1920" />
        </div>

        {/* Right: Decorative */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
              paddingBottom: 16,
              borderBottom: `2px solid ${ACCENT_TEAL}`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 16,
                fontWeight: 700,
                color: ACCENT_TEAL,
                textTransform: 'uppercase' as const,
                letterSpacing: 2,
              }}
            >
              Decorative
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: TEXT_MUTED }}>
              — design elements, not for reading
            </span>
          </div>

          <DecorativeRow role="marker" pxRef="~10px at 1920">
            PROBLEM
          </DecorativeRow>

          <DecorativeRow role="cli" pxRef="~10px at 1920">
            $ creator --mode build --with ai
          </DecorativeRow>

          <DecorativeRow role="accent" pxRef="~67px at 1920">
            &ldquo;
          </DecorativeRow>

          <DecorativeRow role="index" pxRef="~11px at 1920">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(78, 205, 196, 0.15)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
              }}
            >
              01
            </span>
          </DecorativeRow>

          <DecorativeRow role="code" pxRef="~10px at 1920">
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {'type: 갤러리 웹사이트'}
            </span>
          </DecorativeRow>
        </div>
      </div>

      {/* Bottom: Rules table */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            paddingBottom: 12,
            borderBottom: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 14,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              textTransform: 'uppercase' as const,
              letterSpacing: 2,
            }}
          >
            Normalization Rules
          </span>
        </div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse' as const,
            fontFamily: FONT_BODY,
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left' as const,
                  padding: '8px 16px',
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: 'uppercase' as const,
                  letterSpacing: 1,
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                }}
              >
                Rule
              </th>
              <th
                style={{
                  textAlign: 'left' as const,
                  padding: '8px 16px',
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  fontWeight: 600,
                  color: TEXT_MUTED,
                  textTransform: 'uppercase' as const,
                  letterSpacing: 1,
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                  width: 200,
                }}
              >
                Applies to
              </th>
            </tr>
          </thead>
          <tbody>
            {rulesData.map((row, i) => (
              <tr key={i}>
                <td
                  style={{
                    padding: '10px 16px',
                    color: TEXT_SECONDARY,
                    borderBottom: `1px solid rgba(255,255,255,0.04)`,
                  }}
                >
                  {row.rule}
                </td>
                <td
                  style={{
                    padding: '10px 16px',
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: ACCENT_TEAL,
                    borderBottom: `1px solid rgba(255,255,255,0.04)`,
                  }}
                >
                  {row.applies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Theme System/Text Roles',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <TextRolesDoc />,
};
