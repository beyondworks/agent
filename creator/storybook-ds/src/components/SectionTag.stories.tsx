import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionTag } from './SectionTag';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof SectionTag> = {
  title: 'Components/SectionTag',
  component: SectionTag,
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
type Story = StoryObj<typeof SectionTag>;

export const Default: Story = {
  args: { label: 'Design System' },
};

export const Korean: Story = {
  args: { label: '핵심 원칙' },
};
