import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors, fontFamily, fontSize, fontWeight, spacing, borderRadius } from '../tokens/tokens';

const Swatch = ({ color, name, variable }: { color: string; name: string; variable: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
    <div
      style={{
        width: 120,
        height: 80,
        borderRadius: borderRadius.md,
        background: color,
        border: `1px solid rgba(255, 255, 255, 0.1)`,
      }}
    />
    <span
      style={{
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label - 2,
        fontWeight: fontWeight.medium,
        color: colors.text.primary,
      }}
    >
      {name}
    </span>
    <span
      style={{
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label - 3,
        color: colors.text.muted,
      }}
    >
      {color}
    </span>
    <span
      style={{
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label - 4,
        color: colors.text.secondary,
      }}
    >
      {variable}
    </span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: spacing['2xl'] }}>
    <h3
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.body,
        fontWeight: fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.lg,
      }}
    >
      {title}
    </h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg }}>
      {children}
    </div>
  </div>
);

const ColorPalettePage = () => (
  <div
    style={{
      padding: spacing['2xl'],
      background: colors.bg.base,
      minHeight: '100vh',
      fontFamily: fontFamily.sans,
    }}
  >
    <h1
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.h3,
        fontWeight: fontWeight.black,
        color: colors.text.primary,
        marginBottom: spacing['2xl'],
      }}
    >
      Color Palette
    </h1>

    <Section title="Core Palette">
      <Swatch color={colors.palette.darkNavy} name="Dark Navy" variable="colors.palette.darkNavy" />
      <Swatch color={colors.palette.darkPurple} name="Dark Purple" variable="colors.palette.darkPurple" />
      <Swatch color={colors.palette.teal} name="Teal" variable="colors.palette.teal" />
      <Swatch color={colors.palette.lightGray} name="Light Gray" variable="colors.palette.lightGray" />
    </Section>

    <Section title="Backgrounds">
      <Swatch color={colors.bg.base} name="Base" variable="colors.bg.base" />
      <Swatch color={colors.bg.slide} name="Slide" variable="colors.bg.slide" />
      <Swatch color={colors.bg.card} name="Card" variable="colors.bg.card" />
    </Section>

    <Section title="Text">
      <Swatch color={colors.text.primary} name="Primary" variable="colors.text.primary" />
      <Swatch color={colors.text.secondary} name="Secondary" variable="colors.text.secondary" />
      <Swatch color={colors.text.muted} name="Muted" variable="colors.text.muted" />
      <Swatch color={colors.text.accent} name="Accent" variable="colors.text.accent" />
    </Section>

    <Section title="Accent">
      <Swatch color={colors.accent.primary} name="Primary" variable="colors.accent.primary" />
      <Swatch color={colors.accent.soft} name="Soft" variable="colors.accent.soft" />
      <Swatch color={colors.accent.border} name="Border" variable="colors.accent.border" />
    </Section>

    <Section title="Border">
      <Swatch color={colors.border.glass} name="Glass" variable="colors.border.glass" />
      <Swatch color={colors.border.dim} name="Dim" variable="colors.border.dim" />
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Docs/Color Palette',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllColors: Story = {
  render: () => <ColorPalettePage />,
};
