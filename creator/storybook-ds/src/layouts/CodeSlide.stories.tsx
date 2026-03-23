import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeSlide } from './CodeSlide';

const meta: Meta<typeof CodeSlide> = {
  title: 'Layouts/CodeSlide',
  component: CodeSlide,
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
type Story = StoryObj<typeof CodeSlide>;

export const Default: Story = {
  args: {
    badge: 'Best Practice',
    title: '토큰을 사용하세요',
    badLabel: 'before.ts',
    badCode: `const card = {
  background: '#1a1a2e',
  borderRadius: '16px',
  padding: '24px',
  color: '#e0e0e0',
};`,
    goodLabel: 'after.ts',
    goodCode: `const card = {
  background: colors.bg.card,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  color: colors.text.primary,
};`,
  },
};

export const StyleComparison: Story = {
  args: {
    badge: 'Typography',
    title: '폰트 시스템 활용',
    badLabel: 'bad.tsx',
    badCode: `<h1 style={{
  fontSize: '48px',
  fontWeight: 700,
  fontFamily: 'Arial',
}}>
  제목
</h1>`,
    goodLabel: 'good.tsx',
    goodCode: `<h1 style={{
  fontSize: fontSize.h2,
  fontWeight: fontWeight.bold,
  fontFamily: fontFamily.sans,
}}>
  제목
</h1>`,
  },
};
