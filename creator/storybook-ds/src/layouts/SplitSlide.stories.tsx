import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitSlide } from './SplitSlide';

const meta: Meta<typeof SplitSlide> = {
  title: 'Layouts/SplitSlide',
  component: SplitSlide,
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
type Story = StoryObj<typeof SplitSlide>;

export const Default: Story = {
  args: {
    tag: '핵심 원칙',
    title: '디자인 시스템의 세 가지 기둥',
    description: '일관성, 재사용성, 확장성을 기반으로 구축된 컴포넌트 라이브러리는 팀 전체의 생산성을 높입니다.',
    items: [
      { title: '일관성', description: '토큰 기반의 통일된 시각 언어' },
      { title: '재사용성', description: '합성 가능한 컴포넌트 설계' },
      { title: '확장성', description: '새로운 패턴을 쉽게 추가' },
    ],
  },
};

export const FourItems: Story = {
  args: {
    tag: 'Pipeline',
    title: '영상 제작 파이프라인',
    description: '스타일 분석부터 최종 렌더링까지 자동화된 워크플로우를 제공합니다.',
    items: [
      { title: '스타일 분석', description: '크리에이터의 고유한 톤 추출' },
      { title: '대본 생성', description: '씬 단위 구조화된 스크립트' },
      { title: 'TTS 변환', description: '자연스러운 한국어 음성 합성' },
      { title: '영상 렌더링', description: 'Remotion 기반 자동 합성' },
    ],
  },
};
