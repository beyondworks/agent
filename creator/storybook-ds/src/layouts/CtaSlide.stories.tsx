import type { Meta, StoryObj } from '@storybook/react-vite';
import { CtaSlide } from './CtaSlide';

const meta: Meta<typeof CtaSlide> = {
  title: 'Layouts/CtaSlide',
  component: CtaSlide,
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
type Story = StoryObj<typeof CtaSlide>;

export const Default: Story = {
  args: {
    titleLine1: '지금 바로 시작하세요',
    titleLine2: '코드로 만드는 디자인 시스템',
    subtitle: 'github.com/creator-agent/design-system',
  },
};

export const Alternative: Story = {
  args: {
    titleLine1: '영상 제작의 미래',
    titleLine2: 'AI가 만드는 콘텐츠',
    subtitle: '한 마디로 시작하는 10분짜리 정보 영상',
  },
};
