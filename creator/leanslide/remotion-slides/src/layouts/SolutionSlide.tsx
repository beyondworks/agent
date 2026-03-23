import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, radius } from '../tokens';
import { fadeIn, slideUp, staggerIn } from '../utils/interpolate';

export const SolutionSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);
  const titleOpacity = fadeIn(frame, 8, 15);
  const titleY = slideUp(frame, 8, 18);

  const points: string[] = content.points ?? content.items ?? [];

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div
          style={{
            ...typo.t4,
            color: theme.accent,
            opacity: labelOpacity,
            marginBottom: sp.md,
            letterSpacing: '0.22em',
          }}
        >
          SOLUTION
        </div>

        {/* Title */}
        <div
          style={{
            ...typo.t1,
            color: theme.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: sp.xl,
            maxWidth: 960,
          }}
        >
          {content.title}
        </div>

        {/* Solution items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sp.md,
            flex: 1,
          }}
        >
          {points.map((point: string, i: number) => {
            const { opacity, translateY } = staggerIn(frame, i, 20, 6);
            return (
              <div
                key={i}
                style={{
                  ...glassCard(theme),
                  borderLeft: `4px solid ${theme.accent}`,
                  borderRadius: radius.lg,
                  padding: `${sp.md}px ${sp.lg}px`,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.md,
                }}
              >
                {/* Checkmark indicator */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: theme.accent,
                    flexShrink: 0,
                  }}
                />
                <span style={{ ...typo.t2, color: theme.text, fontWeight: 400 }}>{point}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
