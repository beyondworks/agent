import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors, fontFamily, fontSize, fontWeight, spacing, borderRadius } from '../tokens/tokens';

const SpacingBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
    <span
      style={{
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.accent.primary,
        minWidth: 48,
        textAlign: 'right',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label - 2,
        color: colors.text.muted,
        minWidth: 40,
      }}
    >
      {value}px
    </span>
    <div
      style={{
        height: spacing.lg,
        width: value * 4,
        background: `linear-gradient(90deg, ${colors.accent.primary}, rgba(0, 188, 212, 0.2))`,
        borderRadius: borderRadius.sm,
        minWidth: 4,
      }}
    />
  </div>
);

const SpacingPage = () => (
  <div
    style={{
      padding: spacing['2xl'],
      background: colors.bg.base,
      minHeight: '100vh',
      fontFamily: fontFamily.sans,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xl,
    }}
  >
    <h1
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.h3,
        fontWeight: fontWeight.black,
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}
    >
      Spacing Scale
    </h1>

    <SpacingBar label="xs" value={spacing.xs} />
    <SpacingBar label="sm" value={spacing.sm} />
    <SpacingBar label="md" value={spacing.md} />
    <SpacingBar label="lg" value={spacing.lg} />
    <SpacingBar label="xl" value={spacing.xl} />
    <SpacingBar label="2xl" value={spacing['2xl']} />
    <SpacingBar label="3xl" value={spacing['3xl']} />

    <h2
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.body,
        fontWeight: fontWeight.bold,
        color: colors.text.primary,
        marginTop: spacing.xl,
      }}
    >
      Spacing Boxes
    </h2>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.lg }}>
      {(
        [
          ['xs', spacing.xs],
          ['sm', spacing.sm],
          ['md', spacing.md],
          ['lg', spacing.lg],
          ['xl', spacing.xl],
          ['2xl', spacing['2xl']],
          ['3xl', spacing['3xl']],
        ] as const
      ).map(([label, value]) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm }}>
          <div
            style={{
              width: value,
              height: value,
              background: colors.accent.soft,
              border: `1px solid ${colors.accent.border}`,
              borderRadius: borderRadius.sm,
            }}
          />
          <span
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.label - 2,
              color: colors.text.muted,
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Docs/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllSpacing: Story = {
  render: () => <SpacingPage />,
};
