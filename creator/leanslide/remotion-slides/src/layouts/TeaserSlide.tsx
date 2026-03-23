import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface TeaserSlideContent {
  teaserText: string;
  label?: string;
}

export const TeaserSlide: React.FC<{ content: TeaserSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);
  const textOpacity = fadeIn(frame, 10, 18);
  const textY = slideUp(frame, 10, 18, 40);
  const arrowOpacity = fadeIn(frame, 25, 15);
  const arrowY = slideUp(frame, 25, 15, 20);

  return (
    <div style={slideBase(theme)}>
      {/* Subtle top gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(180deg, ${theme.accent}18 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={safeArea()}>
        {/* NEXT label at top */}
        <div style={{ opacity: labelOpacity, marginBottom: sp.xl }}>
          <span style={{ ...typo.t4, color: theme.accent }}>
            {content.label ?? 'NEXT'}
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

        {/* Teaser text centered */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              ...typo.t2,
              color: theme.text,
              margin: 0,
              textAlign: 'center',
              maxWidth: grid.span(8),
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
            }}
          >
            {content.teaserText}
          </p>
        </div>

        {/* Arrow at bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: sp.xl,
            opacity: arrowOpacity,
            transform: `translateY(${arrowY}px)`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 6L16 26M16 26L8 18M16 26L24 18"
              stroke={theme.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
