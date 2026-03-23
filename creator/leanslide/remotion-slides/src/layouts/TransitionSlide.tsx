import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface TransitionSlideContent {
  label?: string;
}

export const TransitionSlide: React.FC<{ content: TransitionSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  // 3 dots sequential scale animation, each 8 frames apart, cycling
  const DOT_DELAY = 8;
  const DOT_DURATION = 12;
  const CYCLE = 36;

  const dotScale = (index: number) => {
    const localFrame = (frame - index * DOT_DELAY + CYCLE * 10) % CYCLE;
    return interpolate(localFrame, [0, DOT_DURATION / 2, DOT_DURATION, CYCLE], [1, 1.8, 1, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  };

  const dotOpacity = (index: number) => {
    const localFrame = (frame - index * DOT_DELAY + CYCLE * 10) % CYCLE;
    return interpolate(localFrame, [0, DOT_DURATION / 2, DOT_DURATION, CYCLE], [0.3, 1, 0.3, 0.3], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  const containerOpacity = fadeIn(frame, 0, 10);

  return (
    <div style={slideBase(theme)}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sp.md,
          opacity: containerOpacity,
        }}
      >
        {/* Three dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.md }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: theme.accent,
                opacity: dotOpacity(i),
                transform: `scale(${dotScale(i)})`,
              }}
            />
          ))}
        </div>

        {content.label && (
          <span
            style={{
              ...typo.t4,
              color: theme.muted,
              marginTop: sp.lg,
            }}
          >
            {content.label}
          </span>
        )}
      </div>
    </div>
  );
};
