import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface ChapterSlideContent {
  chapterNumber: number;
  title: string;
  label?: string;
}

export const ChapterSlide: React.FC<{ content: ChapterSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const bgNumOpacity = fadeIn(frame, 0, 20);
  const labelAnim = staggerIn(frame, 0, 5, 8);
  const titleAnim = staggerIn(frame, 1, 5, 8);
  const lineScale = fadeIn(frame, 20, 18);

  const numStr = String(content.chapterNumber).padStart(2, '0');

  return (
    <div style={slideBase(theme)}>
      {/* Large ghost chapter number as background */}
      <div
        style={{
          position: 'absolute',
          right: grid.margin - 20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 480,
          fontWeight: 900,
          lineHeight: 1,
          color: theme.accent,
          opacity: bgNumOpacity * 0.15,
          letterSpacing: '-0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontFamily: `'${theme.font}', 'Noto Sans KR', sans-serif`,
        }}
      >
        {numStr}
      </div>

      <div style={safeArea()}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: grid.span(8),
          }}
        >
          {/* Label */}
          <div
            style={{
              opacity: labelAnim.opacity,
              transform: `translateY(${labelAnim.translateY}px)`,
              marginBottom: sp.lg,
            }}
          >
            <span style={{ ...typo.t4, color: theme.accent }}>
              {content.label ?? `CHAPTER ${numStr}`}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              ...typo.t1,
              color: theme.text,
              margin: 0,
              opacity: titleAnim.opacity,
              transform: `translateY(${titleAnim.translateY}px)`,
            }}
          >
            {content.title}
          </h1>

          {/* Accent line */}
          <div
            style={{
              height: 3,
              width: 120,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
              borderRadius: 2,
              marginTop: sp.xl,
              transformOrigin: 'left center',
              transform: `scaleX(${lineScale})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
