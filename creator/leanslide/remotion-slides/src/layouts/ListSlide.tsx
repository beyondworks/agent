import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, staggerIn } from '../utils/interpolate';
import { CardGrid } from '../animations';

interface ListItem {
  icon?: string;
  title: string;
  description: string;
}

interface ListSlideProps {
  theme: SlideTheme;
  label?: string;
  items: ListItem[];
  gridStyle?: 'bento' | 'card-grid';
}

export const ListSlide: React.FC<ListSlideProps> = ({ theme, label = 'LIST', items, gridStyle }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const cols = items.length <= 4 ? 2 : 2;
  const rows = Math.ceil(items.length / cols);

  // stagger order: left-top → right-top → left-bottom → right-bottom
  const staggerOrder: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      staggerOrder.push(row * cols + col);
    }
  }

  const gap = sp.lg;
  const cardWidth = (grid.contentWidth - gap * (cols - 1)) / cols;
  const cardHeight = items.length <= 4 ? 380 : 280;

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div
          style={{
            ...typo.t4,
            color: theme.accent,
            opacity: labelOpacity,
            marginBottom: sp.lg,
          }}
        >
          {label}
        </div>

        {/* Grid — CardGrid or Bento */}
        {gridStyle === 'card-grid' ? (
          <CardGrid
            cards={items.slice(0, 6).map((item) => ({
              title: item.title,
              subtitle: item.description,
            }))}
            columns={items.length <= 4 ? 2 : 3}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap,
              flex: 1,
            }}
          >
            {items.slice(0, 6).map((item, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 10, 6);
              return (
                <div
                  key={i}
                  style={{
                    ...glassCard(theme),
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: sp.sm,
                    minHeight: cardHeight,
                  }}
                >
                  {item.icon && (
                    <div
                      style={{
                        fontSize: 32,
                        lineHeight: 1,
                        marginBottom: sp.xs,
                      }}
                    >
                      {item.icon}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                      color: theme.text,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      ...typo.t3,
                      color: theme.muted,
                      flex: 1,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
