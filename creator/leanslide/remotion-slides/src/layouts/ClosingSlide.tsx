import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, radius, glassCard } from '../tokens';
import { fadeIn, staggerIn, popIn, slideUp } from '../utils/interpolate';

interface ClosingSlideProps {
  theme: SlideTheme;
  label?: string;
  takeaways: string[];
  cta?: string;
}

export const ClosingSlide: React.FC<ClosingSlideProps> = ({
  theme,
  label = 'KEY TAKEAWAYS',
  takeaways,
  cta,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const ctaScale = popIn(frame, 20 + takeaways.length * 6, 14);
  const ctaOpacity = fadeIn(frame, 20 + takeaways.length * 6, 14);

  return (
    <div style={slideBase(theme)}>
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
            width: '100%',
            maxWidth: 1100,
          }}
        >
          {/* Label */}
          <div
            style={{
              ...typo.t4,
              color: theme.accent,
              opacity: labelOpacity,
              textAlign: 'center',
            }}
          >
            {label}
          </div>

          {/* Takeaways */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: sp.md,
              width: '100%',
            }}
          >
            {takeaways.slice(0, 5).map((point, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 8, 6);
              return (
                <div
                  key={i}
                  style={{
                    ...glassCard(theme),
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: sp.lg,
                    padding: `${sp.md}px ${sp.xl}px`,
                  }}
                >
                  {/* Number badge */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: theme.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 900,
                      color: theme.bg,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ ...typo.t3, color: theme.text, fontWeight: 500 }}>{point}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {cta && (
            <div
              style={{
                opacity: ctaOpacity,
                transform: `scale(${ctaScale})`,
                background: theme.accent,
                borderRadius: radius.lg,
                padding: `${sp.md}px ${sp.xl}px`,
                display: 'flex',
                alignItems: 'center',
                gap: sp.sm,
                cursor: 'default',
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: theme.bg,
                  letterSpacing: '-0.01em',
                }}
              >
                {cta}
              </span>
              <span style={{ fontSize: 20, color: theme.bg, fontWeight: 700 }}>→</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
