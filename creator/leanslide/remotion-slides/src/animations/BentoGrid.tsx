import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';

type GridSpan = '1x1' | '2x1' | '1x2';

interface BentoItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  /** 그리드 크기 (기본 1x1) — colxrow */
  span?: GridSpan;
}

interface BentoGridProps {
  items: BentoItem[];
  theme: {
    accent: string;
    bg: string;
    bgLight: string;
    text: string;
    textDim: string;
  };
  /** 컬럼 수 (기본 3) */
  columns?: number;
  /** 카드 간 stagger 프레임 간격 (기본 6) */
  staggerDelay?: number;
  /** 그리드 갭 px (기본 16) */
  gap?: number;
  /** 셀 기본 크기 px (기본 180) */
  cellSize?: number;
}

/** span → grid-column / grid-row */
function spanToGrid(span: GridSpan = '1x1') {
  const [col, row] = span.split('x').map(Number);
  return {
    gridColumn: `span ${col}`,
    gridRow: `span ${row}`,
  };
}

/** 등장 순서: 좌상→우상→좌하→우하 (행 우선) */
function getOrderIndex(i: number, columns: number): number {
  return i; // 이미 items 배열 순서 = 행 우선
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  items,
  theme,
  columns = 3,
  staggerDelay = 6,
  gap = 16,
  cellSize = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap,
      }}
    >
      {items.map((item, i) => {
        const order = getOrderIndex(i, columns);
        const startFrame = order * staggerDelay;

        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 12],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const scale = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 12, stiffness: 160, mass: 0.5 },
        });

        const translateY = interpolate(
          frame,
          [startFrame, startFrame + 15],
          [30, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          },
        );

        const { gridColumn, gridRow } = spanToGrid(item.span);

        return (
          <div
            key={i}
            style={{
              gridColumn,
              gridRow,
              borderRadius: 16,
              background: theme.bgLight,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              overflow: 'hidden',
            }}
          >
            {/* 아이콘 */}
            {item.icon && (
              <div style={{ fontSize: 28 }}>{item.icon}</div>
            )}

            {/* 텍스트 */}
            <div>
              <div
                style={{
                  color: theme.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: item.description ? 6 : 0,
                }}
              >
                {item.title}
              </div>
              {item.description && (
                <div
                  style={{
                    color: theme.textDim,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>

            {/* 하단 accent dot */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: theme.accent,
                opacity: interpolate(
                  frame,
                  [startFrame + 15, startFrame + 22],
                  [0, 0.6],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
