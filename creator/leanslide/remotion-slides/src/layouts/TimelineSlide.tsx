import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, grid } from '../tokens';
import { fadeIn, slideUp, staggerIn, drawLine } from '../utils/interpolate';

interface TimelineEvent {
  year?: string;
  stage?: string;
  description: string;
}

export const TimelineSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleY = slideUp(frame, 0, 18);

  const events: TimelineEvent[] = content.events ?? [];

  // vertical line draws after title
  const lineProgress = drawLine(frame, 18, 35);

  const contentH = grid.height - 96 * 2;
  // reserve top portion for title (~130px) then timeline area
  const timelineTop = 130;
  const timelineHeight = contentH - timelineTop;

  // center x of content area for the vertical line
  const centerX = grid.contentWidth / 2;
  const cardWidth = Math.floor(centerX - sp['2xl'] - sp.lg);
  const dotSize = 16;

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
            marginBottom: sp.xl,
          }}
        >
          {content.title}
        </div>

        {/* Timeline area */}
        <div style={{ position: 'relative', flex: 1 }}>
          {/* Vertical center line SVG */}
          <svg
            style={{ position: 'absolute', top: 0, left: centerX - 1, pointerEvents: 'none' }}
            width={2}
            height={timelineHeight}
          >
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={timelineHeight}
              stroke={`${theme.muted}55`}
              strokeWidth={2}
              strokeDasharray={timelineHeight}
              strokeDashoffset={lineProgress * timelineHeight}
            />
          </svg>

          {events.map((evt, i) => {
            const { opacity, translateY: ty } = staggerIn(frame, i, 20, 7);
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: sp.xl,
                  position: 'relative',
                  opacity,
                  transform: `translateY(${ty}px)`,
                }}
              >
                {/* Left card slot */}
                <div style={{ width: cardWidth, display: 'flex', justifyContent: 'flex-end' }}>
                  {isLeft && (
                    <div
                      style={{
                        ...glassCard(theme),
                        width: cardWidth - sp.lg,
                        padding: `${sp.md}px ${sp.lg}px`,
                        borderRight: `4px solid ${theme.accent}`,
                      }}
                    >
                      <div style={{ ...typo.t4, color: theme.accent, marginBottom: sp.xs }}>
                        {evt.year ?? evt.stage ?? `Step ${i + 1}`}
                      </div>
                      <div style={{ ...typo.t3, color: theme.text }}>{evt.description}</div>
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: theme.accent,
                    border: `3px solid ${theme.bg}`,
                    flexShrink: 0,
                    marginLeft: sp.lg,
                    marginRight: sp.lg,
                    boxShadow: `0 0 12px ${theme.accent}66`,
                  }}
                />

                {/* Right card slot */}
                <div style={{ width: cardWidth }}>
                  {!isLeft && (
                    <div
                      style={{
                        ...glassCard(theme),
                        width: cardWidth - sp.lg,
                        padding: `${sp.md}px ${sp.lg}px`,
                        borderLeft: `4px solid ${theme.accent2}`,
                      }}
                    >
                      <div style={{ ...typo.t4, color: theme.accent2, marginBottom: sp.xs }}>
                        {evt.year ?? evt.stage ?? `Step ${i + 1}`}
                      </div>
                      <div style={{ ...typo.t3, color: theme.text }}>{evt.description}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
