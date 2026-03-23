import type { Meta, StoryObj } from '@storybook/react-vite';
import { CliPrompt } from './CliPrompt';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof CliPrompt> = {
  title: 'Components/CliPrompt',
  component: CliPrompt,
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
type Story = StoryObj<typeof CliPrompt>;

export const Default: Story = {
  render: () => <CliPrompt>npx create-design-system</CliPrompt>,
};

export const LongCommand: Story = {
  render: () => <CliPrompt>npm install --save-dev storybook @storybook/react-vite</CliPrompt>,
};
