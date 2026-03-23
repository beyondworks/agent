import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { SectionTag } from '../components/SectionTag';
import { GlassCard } from '../components/GlassCard';
import { NumberBadge } from '../components/NumberBadge';
import { colors, fontSize, fontWeight, fontFamily } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface ListSlideItem {
  title: string;
  description: string;
}

interface ListSlideProps {
  tag: string;
  title: string;
  items: ListSlideItem[];
  /** cue 애니메이션용 style overrides */
  headlineStyle?: React.CSSProperties;
  itemStyles?: React.CSSProperties[];
}

export const ListSlide: React.FC<ListSlideProps> = ({ tag, title, items, headlineStyle, itemStyles }) => {
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
        {/* F-pattern: full-width header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(1), ...headlineStyle }}>
          <SectionTag label={tag} />
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
        {/* List rows — 10-col span centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: grid.vr(2), // 16px
            flex: 1,
            justifyContent: 'center',
            width: grid.span(10),
            maxWidth: '100%',
            alignSelf: 'center',
          }}
        >
          {items.map((item, i) => (
            <div key={i} style={itemStyles?.[i]}>
            <GlassCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: grid.vr(3) }}>
                <NumberBadge n={i + 1} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(1) }}>
                  <span
                    style={{
                      fontFamily: fontFamily.sans,
                      fontSize: fontSize.body,
                      fontWeight: fontWeight.medium,
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
