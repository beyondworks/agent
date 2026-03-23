import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, sp, radius } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface GridCard {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: string;
}

interface CardGridProps {
  cards: GridCard[];
  columns?: number;
  startFrame?: number;
  staggerDelay?: number;
  gap?: number;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  columns = 3,
  startFrame = 0,
  staggerDelay = 6,
  gap = sp.lg,
}) => {
  const frame = useCurrentFrame();

  const defaultGradients = [
    VISUAL_THEME.gradientPurple,
    VISUAL_THEME.gradientGreen,
    `linear-gradient(135deg, ${VISUAL_THEME.bgTertiary}, ${VISUAL_THEME.bgSecondary})`,
    `linear-gradient(135deg, #1e3a5f, #0d1b2a)`,
    `linear-gradient(135deg, #4a1942, #1a0a1a)`,
    `linear-gradient(135deg, #1a3c34, #0a1a14)`,
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {cards.map((card, i) => {
        const cardStart = startFrame + i * staggerDelay;

        // Rise from below (stagger)
        const translateY = interpolate(
          frame,
          [cardStart, cardStart + 18],
          [60, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          }
        );
        const opacity = fadeIn(frame, cardStart, 15);

        const gradient = card.gradient ?? defaultGradients[i % defaultGradients.length];

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              background: gradient,
              borderRadius: radius.lg,
              padding: sp.lg,
              border: `1px solid rgba(255,255,255,0.08)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              minHeight: 200,
              gap: sp.xs,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: VISUAL_THEME.textPrimary,
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </div>

            {/* Subtitle */}
            {card.subtitle && (
              <div
                style={{
                  fontSize: 14,
                  color: VISUAL_THEME.textSecondary,
                  lineHeight: 1.5,
                }}
              >
                {card.subtitle}
              </div>
            )}

            {/* Badge */}
            {card.badge && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  marginTop: sp.xs,
                  padding: `4px ${sp.sm}px`,
                  borderRadius: radius.sm,
                  background: 'rgba(255,255,255,0.1)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: VISUAL_THEME.textSecondary,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {card.badge}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
