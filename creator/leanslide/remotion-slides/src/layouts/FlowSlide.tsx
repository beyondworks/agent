import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, radius, grid } from '../tokens';
import { fadeIn, slideUp, staggerIn, drawLine } from '../utils/interpolate';

interface FlowBox {
  icon?: string;
  label: string;
}

export const FlowSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleY = slideUp(frame, 0, 18);

  const boxes: FlowBox[] = (content.boxes ?? content.steps ?? []).slice(0, 4);
  const boxCount = boxes.length;

  // Box dimensions
  const boxW = 240;
  const boxH = 160;
  const arrowLen = Math.floor((grid.contentWidth - boxW * boxCount) / (boxCount - 1 || 1));

  // Arrows draw sequentially after boxes appear
  const arrowLineProgress = (idx: number) => drawLine(frame, 20 + idx * 8, 18);

  // Total row width for centering
  const totalW = boxW * boxCount + arrowLen * (boxCount - 1);
  const startX = Math.floor((grid.contentWidth - totalW) / 2);

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Title */}
        <div
          style={{
            ...typo.t1,
            color: theme.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: sp['2xl'],
          }}
        >
          {content.title}
        </div>

        {/* Flow boxes row */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
            }}
          >
            {boxes.map((box, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 10, 7);
              const arrowProgress = i < boxCount - 1 ? arrowLineProgress(i) : 0;

              return (
                <React.Fragment key={i}>
                  {/* Box */}
                  <div
                    style={{
                      width: boxW,
                      height: boxH,
                      ...glassCard(theme),
                      border: `1px solid ${theme.accent}33`,
                      borderRadius: radius.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: sp.sm,
                      opacity,
                      transform: `translateY(${translateY}px)`,
                      boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
                    }}
                  >
                    {box.icon && (
                      <span style={{ fontSize: 32, lineHeight: 1 }}>{box.icon}</span>
                    )}
                    <span style={{ ...typo.t2, color: theme.text, textAlign: 'center', padding: `0 ${sp.sm}px` }}>
                      {box.label}
                    </span>
                  </div>

                  {/* Arrow connector */}
                  {i < boxCount - 1 && (
                    <svg
                      width={arrowLen}
                      height={32}
                      style={{ flexShrink: 0 }}
                    >
                      {/* Line */}
                      <line
                        x1={0}
                        y1={16}
                        x2={arrowLen - 12}
                        y2={16}
                        stroke={theme.accent}
                        strokeWidth={2}
                        strokeDasharray={arrowLen}
                        strokeDashoffset={arrowProgress * arrowLen}
                        opacity={0.7}
                      />
                      {/* Arrowhead */}
                      <polygon
                        points={`${arrowLen},16 ${arrowLen - 12},10 ${arrowLen - 12},22`}
                        fill={theme.accent}
                        opacity={fadeIn(frame, 28 + i * 8, 10)}
                      />
                    </svg>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
