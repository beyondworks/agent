import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface FullscreenTextSlideContent {
  text: string;
  label?: string;
}

export const FullscreenTextSlide: React.FC<{ content: FullscreenTextSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const textOpacity = fadeIn(frame, 0, 18);
  const textY = slideUp(frame, 0, 18, 60);

  // Subtle background pulse: opacity oscillation on a glow element
  const pulseOpacity = interpolate(frame, [0, 45, 90], [0.04, 0.12, 0.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <div style={slideBase(theme)}>
      {/* Background pulse glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${theme.accent} 0%, transparent 70%)`,
          opacity: pulseOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Optional label */}
      {content.label && (
        <div
          style={{
            position: 'absolute',
            top: grid.margin,
            left: grid.margin,
            opacity: fadeIn(frame, 0, 10),
          }}
        >
          <span style={{ ...typo.t4, color: theme.accent }}>{content.label}</span>
        </div>
      )}

      {/* Dead-center single line */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${grid.margin}px`,
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: theme.text,
            textAlign: 'center',
            margin: 0,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            fontFamily: `'${theme.font}', 'Noto Sans KR', sans-serif`,
          }}
        >
          {content.text}
        </h1>
      </div>
    </div>
  );
};
