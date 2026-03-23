import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromptBlock } from './PromptBlock';
import { SlideBase } from './SlideBase';
import { spacing } from '../tokens/tokens';

const meta: Meta<typeof PromptBlock> = {
  title: 'Components/PromptBlock',
  component: PromptBlock,
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
type Story = StoryObj<typeof PromptBlock>;

export const Default: Story = {
  render: () => (
    <PromptBlock label="terminal">
      {`npm create vite@latest my-app\ncd my-app\nnpm install`}
    </PromptBlock>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <PromptBlock label="config.ts">
      {`export default {\n  theme: 'dark',\n  accent: '#00BCD4',\n}`}
    </PromptBlock>
  ),
};

export const BadExample: Story = {
  render: () => (
    <PromptBlock label="bad-practice.ts" bad>
      {`// any 타입 남발\nconst data: any = fetchData();\nconst result: any = process(data);`}
    </PromptBlock>
  ),
};

export const Comparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: spacing.lg }}>
      <div style={{ flex: 1 }}>
        <PromptBlock label="before.ts" bad>
          {`const style = {\n  color: 'red',\n  fontSize: '14px',\n};`}
        </PromptBlock>
      </div>
      <div style={{ flex: 1 }}>
        <PromptBlock label="after.ts">
          {`const style = {\n  color: colors.accent,\n  fontSize: fontSize.label,\n};`}
        </PromptBlock>
      </div>
    </div>
  ),
};
