import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { GradientText } from '../components/GradientText';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface QuoteSlideProps {
  quotePre: string;
  quoteAccent: string;
  quotePost?: string;
  source: string;
  /** cue 애니메이션용 style overrides */
  quoteStyle?: React.CSSProperties;
  sourceStyle?: React.CSSProperties;
}

export const QuoteSlide: React.FC<QuoteSlideProps> = ({
  quotePre,
  quoteAccent,
  quotePost = '',
  source,
  quoteStyle,
  sourceStyle,
}) => {
  const margin = grid.slide.margin.top; // 96px

  return (
    <SlideBase>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: margin,
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Large quote mark — upper third (rule of thirds) */}
        <span
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: fontFamily.sans,
            fontSize: 200,
            fontWeight: fontWeight.light,
            color: colors.accent.primary,
            opacity: 0.25,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {'\u201C'}
        </span>
        {/* Center-stage quote — 8-col span, vertically at upper third */}
        <div
          style={{
            width: grid.span(8),
            maxWidth: '100%',
            position: 'relative',
            zIndex: 1,
            marginTop: `-${grid.vr(4)}px`,
            ...quoteStyle,
          }}
        >
          <h2
            style={{
              fontFamily: fontFamily.sans,
              fontSize: fontSize.h2,
              fontWeight: fontWeight.bold,
              color: colors.text.primary,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {quotePre}
            <GradientText>{quoteAccent}</GradientText>
            {quotePost}
          </h2>
          <div style={sourceStyle}>
            <p
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.caption,
                fontWeight: fontWeight.regular,
                color: colors.text.muted,
                margin: 0,
                marginTop: grid.vr(4), // 32px
              }}
            >
              {source}
            </p>
          </div>
        </div>
      </div>
    </SlideBase>
  );
};
