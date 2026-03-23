import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { SectionTag } from '../components/SectionTag';
import { GlassCard } from '../components/GlassCard';
import { NumberBadge } from '../components/NumberBadge';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface SplitSlideItem {
  title: string;
  description: string;
}

interface SplitSlideProps {
  tag: string;
  title: string;
  description: string;
  items: SplitSlideItem[];
  /** cue 애니메이션용 style overrides */
  headlineStyle?: React.CSSProperties;
  itemStyles?: React.CSSProperties[];
}

export const SplitSlide: React.FC<SplitSlideProps> = ({
  tag,
  title,
  description,
  items,
  headlineStyle,
  itemStyles,
}) => {
  const margin = grid.slide.margin.top; // 96px

  return (
    <SlideBase>
      <div
        style={{
          display: 'flex',
          height: '100%',
          padding: `${margin}px ${margin * 0.7}px`,
          paddingLeft: margin * 1.5,  // 좌측 여백 증가 → 텍스트를 카드 쪽으로 이동
          boxSizing: 'border-box',
          gap: grid.vr(3), // 24px
        }}
      >
        {/* Left column — 5 cols (카드 쪽으로 이동) */}
        <div
          style={{
            flex: `0 0 ${grid.span(5)}px`,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <SectionTag label={tag} />
          <div style={{ height: grid.vr(2.5) }} />
          <div style={headlineStyle}>
            <h2
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.h2,
                fontWeight: fontWeight.bold,
                color: colors.text.primary,
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: -0.5,
              }}
            >
              {title}
            </h2>
            <div style={{ height: grid.vr(2.5) }} />
            <p
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.body,
                fontWeight: fontWeight.regular,
                color: colors.text.secondary,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              {description}
            </p>
          </div>
        </div>
        {/* Right column */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: grid.vr(2),
          }}
        >
          {items.map((item, i) => (
            <div key={i} style={itemStyles?.[i]}>
              <GlassCard padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', gap: grid.vr(2.5) }}>
                  <NumberBadge n={i + 1} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span
                      style={{
                        fontFamily: fontFamily.sans,
                        fontSize: 22,
                        fontWeight: fontWeight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontFamily: fontFamily.sans,
                        fontSize: fontSize.caption,
                        fontWeight: fontWeight.regular,
                        color: colors.text.secondary,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </SlideBase>
  );
};
