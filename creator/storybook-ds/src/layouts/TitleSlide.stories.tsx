import type { Meta, StoryObj } from '@storybook/react-vite';
import { TitleSlide } from './TitleSlide';

const meta: Meta<typeof TitleSlide> = {
  title: 'Layouts/TitleSlide',
  component: TitleSlide,
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
type Story = StoryObj<typeof TitleSlide>;

export const Default: Story = {
  args: {
    badge: 'Design System',
    titlePre: '설계하는 사람이 ',
    titleAccent: '직접 만드는',
    titlePost: ' 시대',
    subtitle: '디자인 토큰부터 슬라이드 레이아웃까지, 코드로 완성하는 프레젠테이션 시스템',
    command: 'npx create-slide-system',
  },
};

export const Minimal: Story = {
  args: {
    badge: 'Introduction',
    titlePre: '',
    titleAccent: 'AI 콘텐츠 파이프라인',
    titlePost: '',
    subtitle: '한 마디로 시작하는 영상 제작 자동화',
    command: 'creator start --topic "디자인 시스템"',
  },
};
