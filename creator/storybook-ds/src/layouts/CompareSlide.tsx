import React from 'react';
import { SlideBase } from '../components/SlideBase';
import { colors, fontSize, fontWeight, fontFamily, borderRadius } from '../tokens/tokens';
import { grid } from '../tokens/grid';

interface CompareSlideProps {
  beforeTitle: string;
  afterTitle: string;
  beforeItems: string[];
  afterItems: string[];
  /** cue 애니메이션용 style overrides */
  beforeTitleStyle?: React.CSSProperties;
  afterTitleStyle?: React.CSSProperties;
  vsBadgeStyle?: React.CSSProperties;
  beforeItemStyles?: React.CSSProperties[];
  afterItemStyles?: React.CSSProperties[];
}

export const CompareSlide: React.FC<CompareSlideProps> = ({
  beforeTitle,
  afterTitle,
  beforeItems,
  afterItems,
  beforeTitleStyle,
  afterTitleStyle,
  vsBadgeStyle,
  beforeItemStyles,
  afterItemStyles,
}) => {
  const margin = grid.slide.margin.top; // 96px

  return (
    <SlideBase>
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Before half — 6 cols */}
        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: margin,
            paddingRight: grid.vr(6), // 48px
            boxSizing: 'border-box',
            background: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={beforeTitleStyle}>
            <h3
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.h3,
                fontWeight: fontWeight.bold,
                color: colors.text.muted,
                margin: 0,
                marginBottom: grid.vr(4), // 32px
              }}
            >
              {beforeTitle}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(2) }}>
            {beforeItems.map((item, i) => (
              <div
                key={i}
                style={{
                  ...beforeItemStyles?.[i],
                  fontFamily: fontFamily.sans,
                  fontSize: fontSize.body,
                  fontWeight: fontWeight.regular,
                  color: colors.text.muted,
                  lineHeight: 1.6,
                }}
              >
                <span style={{ opacity: 0.4, marginRight: grid.vr(1) }}>{'\u2014'}</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* VS badge — on column 6-7 boundary */}
        <div style={vsBadgeStyle}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: grid.vr(6), // 48px
              height: grid.vr(6),
              borderRadius: borderRadius.full,
              background: colors.accent.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontFamily.mono,
              fontSize: fontSize.label,
              fontWeight: fontWeight.bold,
              color: colors.bg.base,
              zIndex: 2,
            }}
          >
            VS
          </div>
        </div>

        {/* After half — 6 cols */}
        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: margin,
            paddingLeft: grid.vr(6), // 48px
            boxSizing: 'border-box',
          }}
        >
          <div style={afterTitleStyle}>
            <h3
              style={{
                fontFamily: fontFamily.sans,
                fontSize: fontSize.h3,
                fontWeight: fontWeight.bold,
                color: colors.text.primary,
                margin: 0,
                marginBottom: grid.vr(4), // 32px
              }}
            >
              {afterTitle}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(2) }}>
            {afterItems.map((item, i) => (
              <div
                key={i}
                style={{
                  ...afterItemStyles?.[i],
                  fontFamily: fontFamily.sans,
                  fontSize: fontSize.body,
                  fontWeight: fontWeight.regular,
                  color: colors.text.accent,
                  lineHeight: 1.6,
                }}
              >
                <span style={{ opacity: 0.6, marginRight: grid.vr(1) }}>{'\u2192'}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideBase>
  );
};
