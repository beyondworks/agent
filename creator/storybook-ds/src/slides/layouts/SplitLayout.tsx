import type React from 'react';

const ratioMap = {
  '7-5': ['58%', '42%'],
  '5-7': ['42%', '58%'],
  '8-4': ['67%', '33%'],
  '4-8': ['33%', '67%'],
  '6-6': ['50%', '50%'],
} as const;

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '7-5' | '5-7' | '8-4' | '4-8' | '6-6';
  gap?: string;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  left,
  right,
  ratio = '7-5',
  gap = '1.25vw',
}) => {
  const [leftWidth, rightWidth] = ratioMap[ratio];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        width: '100%',
      }}
    >
      <div style={{ width: leftWidth, flexShrink: 0 }}>{left}</div>
      <div style={{ width: rightWidth, flexShrink: 0 }}>{right}</div>
    </div>
  );
};
