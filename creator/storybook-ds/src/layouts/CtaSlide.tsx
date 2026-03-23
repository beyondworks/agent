import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { GradientDivider } from '../components/GradientDivider';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface CtaSlideProps {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  /** cue 애니메이션용 style overrides */
  headlineStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
}

export const CtaSlide: React.FC<CtaSlideProps> = ({ titleLine1, titleLine2, subtitle, headlineStyle, subtitleStyle }) => {
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
          gap: grid.vr(3), // 24px
        }}
      >
        {/* Layer 1: headline — 50% attention */}
        <div style={headlineStyle}>
          <h2
            style={{
              fontFamily: fontFamily.sans,
              fontSize: fontSize.h2,
              fontWeight: fontWeight.bold,
              color: colors.text.primary,
              margin: 0,
              lineHeight: 1.4,
              maxWidth: grid.span(8),
            }}
          >
            {titleLine1}
            <br />
            <span style={{ color: colors.accent.primary }}>{titleLine2}</span>
          </h2>
        </div>
        <GradientDivider width={64} />
        {/* Layer 4: meta — 5% attention */}
        <div style={subtitleStyle}>
          <p
            style={{
              fontFamily: fontFamily.sans,
              fontSize: fontSize.caption,
              fontWeight: fontWeight.light,
              color: colors.text.muted,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </SlideBase>
  );
};
