import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, staggerIn } from '../utils/interpolate';

interface ProsConsSlideProps {
  theme: SlideTheme;
  label?: string;
  pros: string[];
  cons: string[];
}

export const ProsConsSlide: React.FC<ProsConsSlideProps> = ({
  theme,
  label = 'PROS & CONS',
  pros,
  cons,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const dividerOpacity = fadeIn(frame, 8, 20);

  const colWidth = (grid.contentWidth - 2) / 2 - sp.xl;

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div
          style={{
            ...typo.t4,
            color: theme.accent,
            opacity: labelOpacity,
            marginBottom: sp.lg,
          }}
        >
          {label}
        </div>

        {/* Columns + Divider */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: 0,
            position: 'relative',
          }}
        >
          {/* PROS column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: sp.sm, paddingRight: sp.xl }}>
            <div
              style={{
                ...typo.t4,
                color: '#4ade80',
                marginBottom: sp.sm,
                opacity: fadeIn(frame, 5, 15),
              }}
            >
              PROS
            </div>
            {pros.slice(0, 4).map((item, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 12, 6);
              return (
                <div
                  key={i}
                  style={{
                    ...glassCard(theme),
                    borderLeft: `3px solid #4ade80`,
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: sp.sm,
                  }}
                >
                  <span style={{ color: '#4ade80', fontSize: 16, fontWeight: 700 }}>+</span>
                  <span style={{ ...typo.t3, color: theme.text }}>{item}</span>
                </div>
              );
            })}
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: 1,
              background: `rgba(255,255,255,0.08)`,
              opacity: dividerOpacity,
              alignSelf: 'stretch',
              flexShrink: 0,
            }}
          />

          {/* CONS column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: sp.sm, paddingLeft: sp.xl }}>
            <div
              style={{
                ...typo.t4,
                color: theme.accent3,
                marginBottom: sp.sm,
                opacity: fadeIn(frame, 5, 15),
              }}
            >
              CONS
            </div>
            {cons.slice(0, 4).map((item, i) => {
              const { opacity, translateY } = staggerIn(frame, i, 12, 6);
              return (
                <div
                  key={i}
                  style={{
                    ...glassCard(theme),
                    borderLeft: `3px solid ${theme.accent3}`,
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: sp.sm,
                  }}
                >
                  <span style={{ color: theme.accent3, fontSize: 16, fontWeight: 700 }}>−</span>
                  <span style={{ ...typo.t3, color: theme.text }}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
