import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuoteSlide } from './QuoteSlide';

const meta: Meta<typeof QuoteSlide> = {
  title: 'Layouts/QuoteSlide',
  component: QuoteSlide,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 960 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuoteSlide>;

export const Default: Story = {
  args: {
    quotePre: '좋은 디자인은 ',
    quoteAccent: '보이지 않는 것',
    quotePost: '이다',
    source: '디터 람스 (Dieter Rams)',
  },
};

export const Long: Story = {
  args: {
    quotePre: '코드를 작성하는 것은 ',
    quoteAccent: '미래의 자신에게 보내는 편지',
    quotePost: '와 같다',
    source: '작자 미상',
  },
};
