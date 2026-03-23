import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';
import { TextBlink } from '../animations';

interface HighlightSlideContent {
  /** Full sentence. Wrap key word(s) in <em>...</em> for accent color */
  sentence: string;
  /** The key word(s) to highlight in accent color */
  keyWord?: string;
  label?: string;
  /** When provided, renders TextBlink below the sentence */
  textBlink?: { items: string[]; mode: 'sequential' | 'highlight' };
}

export const HighlightSlide: React.FC<{ content: HighlightSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const textOpacity = fadeIn(frame, 0, 20);
  const textY = slideUp(frame, 0, 20, 50);

  // Accent ring: slowly pulsing scale
  const ringScale = interpolate(frame, [0, 60, 120], [0.85, 1.05, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const ringOpacity = fadeIn(frame, 0, 30) * 0.18;

  // Parse sentence to highlight keyWord
  const renderSentence = () => {
    if (!content.keyWord) {
      return <span>{content.sentence}</span>;
    }
    const parts = content.sentence.split(content.keyWord);
    if (parts.length === 1) {
      return <span>{content.sentence}</span>;
    }
    return (
      <>
        {parts[0]}
        <span
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {content.keyWord}
        </span>
        {parts.slice(1).join(content.keyWord)}
      </>
    );
  };

  return (
    <div style={slideBase(theme)}>
      {/* CircleProgress-style accent ring behind */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: `2px solid ${theme.accent}`,
          opacity: ringOpacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${ringScale * 0.85})`,
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `1px solid ${theme.accent2}`,
          opacity: ringOpacity * 0.6,
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
            opacity: fadeIn(frame, 0, 12),
          }}
        >
          <span style={{ ...typo.t4, color: theme.accent }}>{content.label}</span>
        </div>
      )}

      {/* Centered sentence + optional TextBlink */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${grid.margin * 2}px`,
          gap: sp.xl,
        }}
      >
        <h1
          style={{
            ...typo.t1,
            fontSize: 64,
            color: theme.text,
            textAlign: 'center',
            margin: 0,
            maxWidth: grid.span(10),
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          {renderSentence()}
        </h1>
        {content.textBlink && (
          <TextBlink
            items={content.textBlink.items}
            mode={content.textBlink.mode}
            fontSize={48}
            accentColor={theme.accent}
            startFrame={20}
          />
        )}
      </div>
    </div>
  );
};
