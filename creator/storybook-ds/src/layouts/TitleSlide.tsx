import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { Badge } from '../components/Badge';
import { GradientText } from '../components/GradientText';
import { CliPrompt } from '../components/CliPrompt';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface TitleSlideProps {
  badge: string;
  titlePre: string;
  titleAccent: string;
  titlePost?: string;
  subtitle: string;
  command: string;
  /** cue 애니메이션용 style overrides */
  badgeStyle?: React.CSSProperties;
  headlineStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  cliStyle?: React.CSSProperties;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
  badge,
  titlePre,
  titleAccent,
  titlePost = '',
  subtitle,
  command,
  badgeStyle,
  headlineStyle,
  subtitleStyle,
  cliStyle,
}) => {
  const margin = grid.slide.margin.top; // 96px

  return (
    <SlideBase>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: `${margin}px ${margin * 0.7}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Center-stage: 8-col span, centered */}
        <div
          style={{
            width: grid.span(10),
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={badgeStyle}>
            <Badge label={badge} />
          </div>
          <div style={{ height: grid.vr(3) }} />
          <div style={headlineStyle}>
            <h1
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.h1,
                fontWeight: fontWeight.black,
                color: colors.text.primary,
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: -1,
              }}
            >
              {titlePre}
              <GradientText>{titleAccent}</GradientText>
              {titlePost}
            </h1>
          </div>
          <div style={{ height: grid.vr(2.5) }} />
          <div style={subtitleStyle}>
            <p
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.body,
                fontWeight: fontWeight.regular,
                color: colors.text.secondary,
                margin: 0,
                lineHeight: 1.7,
                maxWidth: grid.span(6),
              }}
            >
              {subtitle}
            </p>
          </div>
          <div style={{ height: grid.vr(5) }} />
          <div style={cliStyle}>
            <CliPrompt>{command}</CliPrompt>
          </div>
        </div>
      </div>
    </SlideBase>
  );
};
