import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, grid } from '../tokens';
import { fadeIn, slideLeft, slideRight, drawLine } from '../utils/interpolate';

export const BeforeAfterSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const leftOpacity = fadeIn(frame, 4, 18);
  const leftX = slideLeft(frame, 4, 22);

  const rightOpacity = fadeIn(frame, 10, 18);
  const rightX = slideRight(frame, 10, 22);

  const dividerOpacity = fadeIn(frame, 20, 12);
  const lineDash = drawLine(frame, 22, 20);

  const halfWidth = Math.round((grid.contentWidth - sp['2xl']) / 2);
  const centerLineHeight = grid.height - 96 * 2;

  return (
    <div style={slideBase(theme)}>
      <div style={{ ...safeArea(), flexDirection: 'row', gap: sp['2xl'], alignItems: 'stretch' }}>
        {/* Left: BEFORE */}
        <div
          style={{
            width: halfWidth,
            opacity: leftOpacity,
            transform: `translateX(${leftX}px)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              ...typo.t4,
              color: theme.accent3,
              marginBottom: sp.md,
              letterSpacing: '0.22em',
            }}
          >
            BEFORE
          </div>
          <div
            style={{
              ...glassCard(theme),
              borderLeft: `4px solid ${theme.accent3}`,
              flex: 1,
              padding: sp.xl,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.md,
            }}
          >
            {content.before?.title && (
              <div style={{ ...typo.t2, color: theme.muted }}>{content.before.title}</div>
            )}
            {content.before?.items ? (
              content.before.items.map((item: string, i: number) => (
                <div
                  key={i}
                  style={{
                    ...typo.t3,
                    color: theme.muted,
                    paddingLeft: sp.md,
                    borderLeft: `2px solid ${theme.accent3}44`,
                  }}
                >
                  {item}
                </div>
              ))
            ) : (
              <div style={{ ...typo.t3, color: theme.muted }}>{content.before?.description ?? ''}</div>
            )}
          </div>
        </div>

        {/* Center divider with arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: dividerOpacity,
            position: 'relative',
            width: 32,
            flexShrink: 0,
          }}
        >
          <svg
            width={32}
            height={centerLineHeight}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Vertical line */}
            <line
              x1={16}
              y1={0}
              x2={16}
              y2={centerLineHeight}
              stroke={`${theme.muted}66`}
              strokeWidth={1}
              strokeDasharray={centerLineHeight}
              strokeDashoffset={lineDash * centerLineHeight}
            />
            {/* Arrow head pointing right at center */}
            <polygon
              points={`24,${centerLineHeight / 2} 8,${centerLineHeight / 2 - 10} 8,${centerLineHeight / 2 + 10}`}
              fill={theme.accent}
              opacity={fadeIn(frame, 36, 12)}
            />
          </svg>
        </div>

        {/* Right: AFTER */}
        <div
          style={{
            width: halfWidth,
            opacity: rightOpacity,
            transform: `translateX(${rightX}px)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              ...typo.t4,
              color: theme.accent,
              marginBottom: sp.md,
              letterSpacing: '0.22em',
            }}
          >
            AFTER
          </div>
          <div
            style={{
              ...glassCard(theme),
              borderLeft: `4px solid ${theme.accent}`,
              flex: 1,
              padding: sp.xl,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.md,
            }}
          >
            {content.after?.title && (
              <div style={{ ...typo.t2, color: theme.accent }}>{content.after.title}</div>
            )}
            {content.after?.items ? (
              content.after.items.map((item: string, i: number) => (
                <div
                  key={i}
                  style={{
                    ...typo.t3,
                    color: theme.text,
                    paddingLeft: sp.md,
                    borderLeft: `2px solid ${theme.accent}66`,
                  }}
                >
                  {item}
                </div>
              ))
            ) : (
              <div style={{ ...typo.t3, color: theme.text }}>{content.after?.description ?? ''}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
