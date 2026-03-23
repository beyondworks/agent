import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
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
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { label: 'Component' },
};

export const Korean: Story = {
  args: { label: '디자인 시스템' },
};

export const Multiple: Story = {
  render: () => (
    <>
      <Badge label="React" />
      <Badge label="TypeScript" />
      <Badge label="Storybook" />
    </>
  ),
};
