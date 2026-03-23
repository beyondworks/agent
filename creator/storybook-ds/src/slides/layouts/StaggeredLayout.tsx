import type React from 'react';

interface StaggeredRow {
  content: React.ReactNode;
  align: 'left' | 'right';
}

interface StaggeredLayoutProps {
  rows: StaggeredRow[];
  gap?: string;
}

export const StaggeredLayout: React.FC<StaggeredLayoutProps> = ({
  rows,
  gap = '2.5vw',
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
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: row.align === 'left' ? 'flex-start' : 'flex-end',
          }}
        >
          <div style={{ width: '70%' }}>{row.content}</div>
        </div>
      ))}
    </div>
  );
};
