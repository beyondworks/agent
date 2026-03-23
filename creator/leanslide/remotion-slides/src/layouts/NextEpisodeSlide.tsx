import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, radius } from '../tokens';
import { fadeIn, slideUp, popIn } from '../utils/interpolate';

interface NextEpisodeSlideProps {
  theme: SlideTheme;
  episodeNumber?: number | string;
  teaserTitle: string;
  subtitle?: string;
}

export const NextEpisodeSlide: React.FC<NextEpisodeSlideProps> = ({
  theme,
  episodeNumber,
  teaserTitle,
  subtitle = 'Coming Soon',
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const badgeScale = popIn(frame, 5, 14);
  const badgeOpacity = fadeIn(frame, 5, 12);
  const titleOpacity = fadeIn(frame, 12, 18);
  const titleY = slideUp(frame, 12, 20, 50);
  const subtitleOpacity = fadeIn(frame, 20, 15);
  const glowOpacity = fadeIn(frame, 5, 25);

  return (
    <div style={slideBase(theme)}>
      {/* Accent glow at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: 300,
          background: `radial-gradient(ellipse at 50% 100%, ${theme.accent}33 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          ...safeArea(),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: sp.xl,
            textAlign: 'center',
          }}
        >
          {/* NEXT EPISODE label */}
          <div
            style={{
              ...typo.t4,
              color: theme.muted,
              opacity: labelOpacity,
              letterSpacing: '0.24em',
            }}
          >
            NEXT EPISODE
          </div>

          {/* Episode badge */}
          {episodeNumber !== undefined && (
            <div
              style={{
                opacity: badgeOpacity,
                transform: `scale(${badgeScale})`,
                background: `${theme.accent}22`,
                border: `1px solid ${theme.accent}66`,
                borderRadius: radius.lg,
                padding: `${sp.xs}px ${sp.lg}px`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: sp.xs,
              }}
            >
              <span
                style={{
                  ...typo.t5,
                  color: theme.accent,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                EP.
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: theme.accent,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '-0.02em',
                }}
              >
                {episodeNumber}
              </span>
            </div>
          )}

          {/* Teaser title */}
          <div
            style={{
              ...typo.t1,
              color: theme.text,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              maxWidth: 1200,
              textAlign: 'center',
            }}
          >
            {teaserTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              ...typo.t3,
              color: theme.muted,
              opacity: subtitleOpacity,
              letterSpacing: '0.06em',
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
