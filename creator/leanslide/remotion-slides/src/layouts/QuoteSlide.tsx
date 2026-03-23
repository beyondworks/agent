import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface QuoteSlideContent {
  quote: string;
  attribution?: string;
  label?: string;
}

export const QuoteSlide: React.FC<{ content: QuoteSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const decoOpacity = fadeIn(frame, 0, 20) * 0.1;
  const quoteOpacity = fadeIn(frame, 10, 20);
  const quoteY = slideUp(frame, 10, 20, 40);
  const attributionOpacity = fadeIn(frame, 28, 15);
  const attributionY = slideUp(frame, 28, 15, 20);

  return (
    <div style={slideBase(theme)}>
      {/* Decorative large opening quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: grid.margin - 20,
          fontSize: 400,
          fontWeight: 900,
          lineHeight: 1,
          color: theme.accent,
          opacity: decoOpacity,
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: `Georgia, serif`,
        }}
      >
        "
      </div>

      {/* Decorative closing quote mark */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: grid.margin - 20,
          fontSize: 400,
          fontWeight: 900,
          lineHeight: 1,
          color: theme.accent,
          opacity: decoOpacity,
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: `Georgia, serif`,
          transform: 'rotate(180deg)',
        }}
      >
        "
      </div>

      {/* Optional label */}
      {content.label && (
        <div
          style={{
            position: 'absolute',
            top: grid.margin,
            left: grid.margin,
            opacity: fadeIn(frame, 0, 12),
          }}
        >
          <span style={{ ...typo.t4, color: theme.accent }}>{content.label}</span>
        </div>
      )}

      {/* Centered quote */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${grid.margin * 2.5}px`,
          gap: sp.xl,
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            width: 48,
            height: 3,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
            borderRadius: 2,
            opacity: quoteOpacity,
          }}
        />

        <blockquote
          style={{
            ...typo.t2,
            color: theme.text,
            fontStyle: 'italic',
            textAlign: 'center',
            margin: 0,
            maxWidth: grid.span(9),
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
          }}
        >
          {content.quote}
        </blockquote>

        {content.attribution && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: sp.xs,
              opacity: attributionOpacity,
              transform: `translateY(${attributionY}px)`,
            }}
          >
            <div style={{ width: 24, height: 1, background: theme.muted }} />
            <span style={{ ...typo.t5, color: theme.muted }}>
              {content.attribution}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
