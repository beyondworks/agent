import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, radius } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface TableSlideProps {
  theme: SlideTheme;
  label?: string;
  headers: string[];
  rows: string[][];
}

export const TableSlide: React.FC<TableSlideProps> = ({
  theme,
  label = 'COMPARISON TABLE',
  headers,
  rows,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const headerOpacity = fadeIn(frame, 8, 15);

  const colCount = headers.length;
  const colWidth = `${100 / colCount}%`;

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

        {/* Table */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: radius.lg,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              background: theme.accent,
              opacity: headerOpacity,
            }}
          >
            {headers.map((h, ci) => (
              <div
                key={ci}
                style={{
                  width: colWidth,
                  padding: `${sp.md}px ${sp.lg}px`,
                  ...typo.t4,
                  color: theme.bg,
                  borderRight: ci < headers.length - 1 ? `1px solid rgba(0,0,0,0.15)` : 'none',
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, ri) => {
            const rowOpacity = fadeIn(frame, 16 + ri * 5, 15);
            const isEven = ri % 2 === 0;
            return (
              <div
                key={ri}
                style={{
                  display: 'flex',
                  background: isEven ? theme.surface : theme.bg,
                  opacity: rowOpacity,
                  borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {row.map((cell, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: colWidth,
                      padding: `${sp.md}px ${sp.lg}px`,
                      ...typo.t3,
                      color: ci === 0 ? theme.text : theme.muted,
                      fontWeight: ci === 0 ? 600 : 400,
                      borderRight:
                        ci < row.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
