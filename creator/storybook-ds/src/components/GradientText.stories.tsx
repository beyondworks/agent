import type { Meta, StoryObj } from '@storybook/react-vite';
import { GradientText } from './GradientText';
import { SlideBase } from './SlideBase';
import { fontSize, fontWeight, fontFamily, spacing } from '../tokens/tokens';

const meta: Meta<typeof GradientText> = {
  title: 'Components/GradientText',
  component: GradientText,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <SlideBase>
          <div style={{ padding: spacing['3xl'] }}>
            <Story />
          </div>
        </SlideBase>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const AsSpan: Story = {
  render: () => (
    <p
      style={{
        fontFamily: fontFamily.sans,
        fontSize: fontSize.h2,
        fontWeight: fontWeight.bold,
        color: '#ECECEC',
      }}
    >
      설계하는 사람이 <GradientText>직접 만드는</GradientText> 시대
    </p>
  ),
};

export const AsH1: Story = {
  render: () => (
    <GradientText as="h1">
      <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.h1, fontWeight: fontWeight.black }}>
        그라디언트 텍스트
      </span>
    </GradientText>
  ),
};

export const AsH2: Story = {
  render: () => (
    <GradientText as="h2">
      <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.h2, fontWeight: fontWeight.bold }}>
        중간 크기 제목
      </span>
    </GradientText>
  ),
};

export const AsH3: Story = {
  render: () => (
    <GradientText as="h3">
      <span style={{ fontFamily: fontFamily.sans, fontSize: fontSize.h3, fontWeight: fontWeight.medium }}>
        작은 제목 텍스트
      </span>
    </GradientText>
  ),
};
