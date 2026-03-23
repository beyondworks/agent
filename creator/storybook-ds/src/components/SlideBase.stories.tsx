import type { Meta, StoryObj } from '@storybook/react-vite';
import { SlideBase } from './SlideBase';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';

const meta: Meta<typeof SlideBase> = {
  title: 'Components/SlideBase',
  component: SlideBase,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SlideBase>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 960 }}>
      <SlideBase>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontFamily: fontFamily.sans,
            fontSize: fontSize.h2,
            fontWeight: fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          기본 슬라이드 배경
        </div>
      </SlideBase>
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div style={{ width: 960 }}>
      <SlideBase variant="dark">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontFamily: fontFamily.sans,
            fontSize: fontSize.h2,
            fontWeight: fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          다크 변형 슬라이드
        </div>
      </SlideBase>
    </div>
  ),
};
