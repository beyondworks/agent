import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompareSlide } from './CompareSlide';

const meta: Meta<typeof CompareSlide> = {
  title: 'Layouts/CompareSlide',
  component: CompareSlide,
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
type Story = StoryObj<typeof CompareSlide>;

export const Default: Story = {
  args: {
    beforeTitle: 'Before',
    afterTitle: 'After',
    beforeItems: [
      '매번 새로 디자인',
      '일관성 없는 색상 사용',
      '하드코딩된 값들',
      '재사용 불가능한 컴포넌트',
    ],
    afterItems: [
      '토큰 기반 디자인 시스템',
      '팔레트에서 자동 적용',
      '중앙 관리되는 설계 값',
      '합성 가능한 컴포넌트',
    ],
  },
};

export const CodeComparison: Story = {
  args: {
    beforeTitle: '기존 방식',
    afterTitle: '새로운 방식',
    beforeItems: [
      '수동으로 영상 편집',
      '자막 하나하나 입력',
      'BGM 찾기에 시간 낭비',
    ],
    afterItems: [
      '자동 씬 분할 렌더링',
      'TTS 기반 자막 동기화',
      '템플릿 매칭으로 즉시 완성',
    ],
  },
};
