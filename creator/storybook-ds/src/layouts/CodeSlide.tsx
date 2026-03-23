import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { Badge } from '../components/Badge';
import { PromptBlock } from '../components/PromptBlock';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface CodeSlideProps {
  badge: string;
  title: string;
  badLabel: string;
  badCode: string;
  goodLabel: string;
  goodCode: string;
}

export const CodeSlide: React.FC<CodeSlideProps> = ({
  badge,
  title,
  badLabel,
  badCode,
  goodLabel,
  goodCode,
}) => {
  const margin = grid.slide.margin.top; // 96px

  return (
    <SlideBase>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: margin,
          boxSizing: 'border-box',
          gap: grid.vr(4), // 32px
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(1) }}>
          <Badge label={badge} />
          <h2
            style={{
              fontFamily: fontFamily.sans,
              fontSize: fontSize.h2,
              fontWeight: fontWeight.bold,
              color: colors.text.primary,
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
        {/* 6-6 split for code comparison */}
        <div
          style={{
            display: 'flex',
            gap: grid.slide.gutter, // 24px gutter
            flex: 1,
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <PromptBlock label={badLabel} bad>
              {badCode}
            </PromptBlock>
          </div>
          <div style={{ flex: 1 }}>
            <PromptBlock label={goodLabel}>
              {goodCode}
            </PromptBlock>
          </div>
        </div>
      </div>
    </SlideBase>
  );
};
