import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListSlide } from './ListSlide';

const meta: Meta<typeof ListSlide> = {
  title: 'Layouts/ListSlide',
  component: ListSlide,
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
type Story = StoryObj<typeof ListSlide>;

export const Default: Story = {
  args: {
    tag: 'Components',
    title: '핵심 컴포넌트 목록',
    items: [
      { title: 'SlideBase', description: '모든 슬라이드의 기본 배경 컴포넌트' },
      { title: 'GlassCard', description: '글래스모피즘 효과의 카드 컨테이너' },
      { title: 'GradientText', description: '틸 그라디언트가 적용된 강조 텍스트' },
      { title: 'NumberBadge', description: '순서를 나타내는 원형 번호 뱃지' },
    ],
  },
};

export const ThreeItems: Story = {
  args: {
    tag: 'Workflow',
    title: '작업 흐름',
    items: [
      { title: '분석', description: '크리에이터의 스타일과 톤을 자동으로 프로파일링' },
      { title: '생성', description: '프로파일 기반으로 대본과 시각 자료를 생성' },
      { title: '합성', description: '음성, 자막, 영상을 하나로 렌더링' },
    ],
  },
};
