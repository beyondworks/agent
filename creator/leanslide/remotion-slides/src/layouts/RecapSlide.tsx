import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface RecapSlideContent {
  label?: string;
  points: string[];
}

export const RecapSlide: React.FC<{ content: RecapSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);
  const titleAnim = staggerIn(frame, 0, 8, 6);

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div style={{ opacity: labelOpacity, marginBottom: sp.sm }}>
          <span style={{ ...typo.t4, color: theme.accent }}>
            {content.label ?? 'RECAP'}
          </span>
          <div
            style={{
              width: 32,
              height: 2,
              background: theme.accent,
              marginTop: sp.xs,
            }}
          />
        </div>

        {/* Title */}
        <h2
          style={{
            ...typo.t2,
            color: theme.text,
            margin: 0,
            marginBottom: sp.xl,
            opacity: titleAnim.opacity,
            transform: `translateY(${titleAnim.translateY}px)`,
          }}
        >
          지금까지 배운 내용
        </h2>

        {/* Bullet points as glass card rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, maxWidth: grid.span(9) }}>
          {content.points.map((point, i) => {
            const anim = staggerIn(frame, i, 18, 8);
            return (
              <div
                key={i}
                style={{
                  ...glassCard({ ...theme, surface: `${theme.surface}cc` } as SlideTheme),
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.md,
                  padding: `${sp.md}px ${sp.lg}px`,
                  opacity: anim.opacity,
                  transform: `translateY(${anim.translateY}px)`,
                }}
              >
                {/* Checkmark icon */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `${theme.accent}22`,
                    border: `1.5px solid ${theme.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke={theme.accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ ...typo.t3, color: theme.text }}>{point}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
