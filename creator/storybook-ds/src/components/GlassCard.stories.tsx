import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassCard } from './GlassCard';
import { SlideBase } from './SlideBase';
import { colors, fontSize, fontWeight, fontFamily, spacing } from '../tokens/tokens';

const meta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <SlideBase>
          <div style={{ padding: spacing['3xl'], display: 'flex', gap: spacing.lg }}>
            <Story />
          </div>
        </SlideBase>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  render: () => (
    <GlassCard>
      <div
        style={{
          fontFamily: fontFamily.sans,
          fontSize: fontSize.body,
          color: colors.text.primary,
        }}
      >
        기본 글래스 카드입니다. 반투명 배경에 블러 효과가 적용됩니다.
      </div>
    </GlassCard>
  ),
};

export const WithGlow: Story = {
  render: () => (
    <GlassCard glow>
      <div
        style={{
          fontFamily: fontFamily.sans,
          fontSize: fontSize.body,
          color: colors.text.primary,
        }}
      >
        글로우 효과가 적용된 카드입니다. 틸 컬러 외곽선이 빛납니다.
      </div>
    </GlassCard>
  ),
};

export const LargePadding: Story = {
  render: () => (
    <GlassCard padding="lg">
      <div
        style={{
          fontFamily: fontFamily.sans,
          fontSize: fontSize.body,
          color: colors.text.primary,
        }}
      >
        넓은 패딩이 적용된 카드
      </div>
    </GlassCard>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <GlassCard>
        <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text.primary, fontWeight: fontWeight.medium }}>
          기본 카드
        </span>
      </GlassCard>
      <GlassCard glow>
        <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text.primary, fontWeight: fontWeight.medium }}>
          글로우 카드
        </span>
      </GlassCard>
      <GlassCard glow padding="lg">
        <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text.primary, fontWeight: fontWeight.medium }}>
          글로우 + 넓은 패딩
        </span>
      </GlassCard>
    </div>
  ),
};
