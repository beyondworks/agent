import type { Meta, StoryObj } from '@storybook/react-vite';
import { GradientDivider } from './GradientDivider';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof GradientDivider> = {
  title: 'Components/GradientDivider',
  component: GradientDivider,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <SlideBase>
          <div style={{ padding: spacing['3xl'], display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <Story />
          </div>
        </SlideBase>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GradientDivider>;

export const Default: Story = {
  render: () => <GradientDivider />,
};

export const Wide: Story = {
  render: () => <GradientDivider width={120} />,
};

export const AllWidths: Story = {
  render: () => (
    <>
      <GradientDivider width={32} />
      <GradientDivider width={64} />
      <GradientDivider width={120} />
      <GradientDivider width={240} />
    </>
  ),
};
