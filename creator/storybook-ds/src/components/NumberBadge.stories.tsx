import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberBadge } from './NumberBadge';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof NumberBadge> = {
  title: 'Components/NumberBadge',
  component: NumberBadge,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <SlideBase>
          <div style={{ padding: spacing['3xl'], display: 'flex', gap: spacing.md, alignItems: 'center' }}>
            <Story />
          </div>
        </SlideBase>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberBadge>;

export const Single: Story = {
  args: { n: 1 },
};

export const AllNumbers: Story = {
  render: () => (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <NumberBadge key={n} n={n} />
      ))}
    </>
  ),
};

export const WithString: Story = {
  args: { n: 'A' },
};
