import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, grid } from '../tokens';
import { fadeIn, slideUp, staggerIn, drawLine } from '../utils/interpolate';
import { CheckList } from '../animations';

interface ProcessStep {
  label: string;
  description?: string;
}

export const ProcessSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleY = slideUp(frame, 0, 18);

  const steps: ProcessStep[] = (content.steps ?? []).slice(0, 4);
  const stepCount = steps.length;

  // connector line draws after title appears
  const lineProgress = drawLine(frame, 20, 30);

  // content area width divided equally
  const stepWidth = Math.floor((grid.contentWidth - sp.lg * (stepCount - 1)) / stepCount);
  const connectorY = 96; // vertical center of step circle area

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

        {/* CheckList style */}
        {content.checklistStyle === true && Array.isArray(content.checklist) ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <CheckList
              items={content.checklist}
              accentColor={theme.accent}
            />
          </div>
        ) : (
        /* Steps row */
        <div style={{ position: 'relative', flex: 1 }}>
          {/* Connecting line SVG */}
          <svg
            style={{ position: 'absolute', top: connectorY - 1, left: 0, pointerEvents: 'none', zIndex: 0 }}
            width={grid.contentWidth}
            height={2}
          >
            <line
              x1={stepWidth / 2}
              y1={1}
              x2={grid.contentWidth - stepWidth / 2}
              y2={1}
              stroke={`${theme.muted}44`}
              strokeWidth={2}
              strokeDasharray={grid.contentWidth}
              strokeDashoffset={lineProgress * grid.contentWidth}
            />
          </svg>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: sp.lg,
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {steps.map((step, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 18, 8);
              return (
                <div
                  key={i}
                  style={{
                    width: stepWidth,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: sp.lg,
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                >
                  {/* Numbered circle */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: theme.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 24px ${theme.accent}44`,
                    }}
                  >
                    <span
                      style={{
                        ...typo.t2,
                        color: theme.bg,
                        fontWeight: 900,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Card with label + description */}
                  <div
                    style={{
                      ...glassCard(theme),
                      width: '100%',
                      padding: sp.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: sp.sm,
                    }}
                  >
                    <div style={{ ...typo.t2, color: theme.text }}>{step.label}</div>
                    {step.description && (
                      <div style={{ ...typo.t3, color: theme.muted }}>{step.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
