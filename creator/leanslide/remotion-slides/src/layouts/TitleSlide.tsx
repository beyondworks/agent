import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface TitleSlideContent {
  label?: string;
  title: string;
  subtitle?: string;
}

export const TitleSlide: React.FC<{ content: TitleSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);
  const labelY = slideUp(frame, 0, 12, 20);

  const dividerScale = fadeIn(frame, 10, 18);

  const titleOpacity = fadeIn(frame, 15, 18);
  const titleY = slideUp(frame, 15, 18, 40);

  const subtitleOpacity = fadeIn(frame, 28, 18);
  const subtitleY = slideUp(frame, 28, 18, 30);

  return (
    <div style={slideBase(theme)}>
      {/* Radial gradient background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${theme.accent}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={safeArea()}>
        {/* Episode / Label at top-left */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            marginBottom: sp.xl,
          }}
        >
          <span
            style={{
              ...typo.t4,
              color: theme.accent,
              letterSpacing: '0.2em',
            }}
          >
            {content.label ?? 'EPISODE 01'}
          </span>
          <div
            style={{
              width: 40,
              height: 2,
              background: theme.accent,
              marginTop: sp.xs,
              transformOrigin: 'left center',
              transform: `scaleX(${dividerScale})`,
            }}
          />
        </div>

        {/* Center-stage: title at upper third vertically */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingBottom: 120,
          }}
        >
          <div
            style={{
              maxWidth: grid.span(7),
            }}
          >
            <h1
              style={{
                ...typo.t1,
                color: theme.text,
                margin: 0,
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
              }}
            >
              {content.title}
            </h1>

            {content.subtitle && (
              <p
                style={{
                  ...typo.t3,
                  color: theme.muted,
                  margin: 0,
                  marginTop: sp.lg,
                  opacity: subtitleOpacity,
                  transform: `translateY(${subtitleY}px)`,
                  maxWidth: grid.span(6),
                }}
              >
                {content.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
