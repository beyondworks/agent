import type React from 'react';

interface BentoItem {
  content: React.ReactNode;
  size: 'large' | 'small';
}

interface BentoLayoutProps {
  items: BentoItem[];
  gap?: string;
}

export const BentoLayout: React.FC<BentoLayoutProps> = ({
  items,
  gap = '1.5vw',
}) => {
  // Expect 4 items: arranged as 2 rows
  // Row 1: items[0] (large=7, small=5) + items[1]
  // Row 2: items[2] + items[3] (large=7, small=5)
  const row1 = items.slice(0, 2);
  const row2 = items.slice(2, 4);

  const getFlex = (item: BentoItem) => (item.size === 'large' ? 7 : 5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        width: '100%',
      }}
    >
      {[row1, row2].map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap, flex: 1 }}>
          {row.map((item, ci) => (
            <div key={ci} style={{ flex: getFlex(item) }}>
              {item.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
