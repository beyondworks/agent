import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors, fontFamily, fontSize, fontWeight, spacing } from '../tokens/tokens';

const sampleText = '설계하는 사람이 직접 만드는 시대';

const TypeRow = ({
  label,
  size,
  weight,
  family,
}: {
  label: string;
  size: number;
  weight: number;
  family: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
      paddingBottom: spacing.xl,
      borderBottom: `1px solid ${colors.border.dim}`,
    }}
  >
    <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'baseline' }}>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: fontSize.label,
          fontWeight: fontWeight.medium,
          color: colors.accent.primary,
          minWidth: 100,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: fontSize.label - 2,
          color: colors.text.muted,
        }}
      >
        {family} / {size}px / {weight}
      </span>
    </div>
    <div
      style={{
        fontFamily: family,
        fontSize: size,
        fontWeight: weight,
        color: colors.text.primary,
        lineHeight: 1.3,
      }}
    >
      {sampleText}
    </div>
  </div>
);

const TypographyPage = () => (
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
      Typography Scale
    </h1>

    <TypeRow label="display" size={fontSize.display} weight={fontWeight.black} family={fontFamily.sans} />
    <TypeRow label="h1" size={fontSize.h1} weight={fontWeight.black} family={fontFamily.sans} />
    <TypeRow label="h2" size={fontSize.h2} weight={fontWeight.bold} family={fontFamily.sans} />
    <TypeRow label="h3" size={fontSize.h3} weight={fontWeight.medium} family={fontFamily.sans} />
    <TypeRow label="body" size={fontSize.body} weight={fontWeight.regular} family={fontFamily.sans} />
    <TypeRow label="caption" size={fontSize.caption} weight={fontWeight.regular} family={fontFamily.sans} />
    <TypeRow label="label" size={fontSize.label} weight={fontWeight.medium} family={fontFamily.sans} />
    <TypeRow label="mono" size={fontSize.mono} weight={fontWeight.regular} family={fontFamily.mono} />

    <h2
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.body,
        fontWeight: fontWeight.bold,
        color: colors.text.primary,
        marginTop: spacing.xl,
      }}
    >
      Font Weights
    </h2>
    {(
      [
        ['light', fontWeight.light],
        ['regular', fontWeight.regular],
        ['medium', fontWeight.medium],
        ['bold', fontWeight.bold],
        ['black', fontWeight.black],
      ] as const
    ).map(([name, weight]) => (
      <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: spacing.lg }}>
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: fontSize.label,
            color: colors.accent.primary,
            minWidth: 80,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: fontSize.label - 2,
            color: colors.text.muted,
            minWidth: 40,
          }}
        >
          {weight}
        </span>
        <span
          style={{
            fontFamily: fontFamily.sans,
            fontSize: fontSize.h3,
            fontWeight: weight,
            color: colors.text.primary,
          }}
        >
          {sampleText}
        </span>
      </div>
    ))}
  </div>
);

const meta: Meta = {
  title: 'Docs/Typography',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllTypography: Story = {
  render: () => <TypographyPage />,
};
