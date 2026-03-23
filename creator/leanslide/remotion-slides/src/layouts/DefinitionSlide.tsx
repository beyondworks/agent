import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface DefinitionSlideContent {
  label?: string;
  word: string;
  definition: string;
  example?: string;
}

export const DefinitionSlide: React.FC<{ content: DefinitionSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  // Left panel: slide from left
  const leftX = interpolate(frame, [0, 18], [-80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const leftOpacity = fadeIn(frame, 0, 18);

  // Right panel: delayed fade + slide
  const rightAnim = staggerIn(frame, 1, 12, 10);
  const exampleAnim = staggerIn(frame, 2, 12, 10);

  const HALF = grid.span(6);

  return (
    <div style={slideBase(theme)}>
      <div style={{ ...safeArea(), flexDirection: 'row', gap: sp['2xl'], alignItems: 'center' }}>
        {/* Left: word + underline */}
        <div
          style={{
            width: HALF,
            flexShrink: 0,
            opacity: leftOpacity,
            transform: `translateX(${leftX}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {content.label && (
            <div style={{ marginBottom: sp.lg }}>
              <span style={{ ...typo.t4, color: theme.accent }}>{content.label}</span>
            </div>
          )}

          <h1
            style={{
              ...typo.t1,
              color: theme.text,
              margin: 0,
            }}
          >
            {content.word}
          </h1>

          {/* Accent underline */}
          <div
            style={{
              height: 4,
              width: 96,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
              borderRadius: 2,
              marginTop: sp.md,
            }}
          />
        </div>

        {/* Vertical divider */}
        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: `rgba(255,255,255,0.08)`,
            flexShrink: 0,
          }}
        />

        {/* Right: definition + example */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: sp.lg,
          }}
        >
          <p
            style={{
              ...typo.t3,
              color: theme.text,
              margin: 0,
              lineHeight: 1.8,
              opacity: rightAnim.opacity,
              transform: `translateY(${rightAnim.translateY}px)`,
            }}
          >
            {content.definition}
          </p>

          {content.example && (
            <div
              style={{
                ...glassCard(theme),
                opacity: exampleAnim.opacity,
                transform: `translateY(${exampleAnim.translateY}px)`,
                borderLeft: `3px solid ${theme.accent}`,
                borderRadius: `0 ${radius.md}px ${radius.md}px 0`,
              }}
            >
              <span style={{ ...typo.t4, color: theme.accent, display: 'block', marginBottom: sp.xs }}>
                EXAMPLE
              </span>
              <p style={{ ...typo.t3, color: theme.muted, margin: 0 }}>
                {content.example}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
