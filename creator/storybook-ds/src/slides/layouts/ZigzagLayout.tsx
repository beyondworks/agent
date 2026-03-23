import type React from 'react';

interface ZigzagSide {
  label: string;
  content: React.ReactNode;
}

interface ZigzagLayoutProps {
  before: ZigzagSide;
  after: ZigzagSide;
  gap?: string;
}

export const ZigzagLayout: React.FC<ZigzagLayoutProps> = ({
  before,
  after,
  gap = '3vw',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap,
        width: '100%',
      }}
    >
      {/* Before: left-aligned, muted */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ opacity: 0.5, maxWidth: '70%' }}>{before.content}</div>
      </div>
      {/* After: right-aligned, bold */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ maxWidth: '70%' }}>{after.content}</div>
      </div>
    </div>
  );
};
