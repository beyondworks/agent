import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, staggerIn } from '../utils/interpolate';
import { BarChart } from '../animations';

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface StatsGridSlideProps {
  theme: SlideTheme;
  label?: string;
  stats: StatItem[];
  statsStyle?: 'number' | 'bar' | 'bar+number';
}

export const StatsGridSlide: React.FC<StatsGridSlideProps> = ({
  theme,
  label = 'KEY METRICS',
  stats,
  statsStyle,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const cols = stats.length <= 4 ? 2 : 3;

  // BarChart mode
  if (statsStyle === 'bar' || statsStyle === 'bar+number') {
    const barBars = stats.slice(0, 6).map((stat) => ({
      label: stat.label,
      value: stat.value,
      sublabel: stat.suffix,
    }));

    return (
      <div style={slideBase(theme)}>
        <div style={safeArea()}>
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
          {statsStyle === 'bar+number' ? (
            <div style={{ display: 'flex', gap: sp['2xl'], flex: 1, alignItems: 'flex-start' }}>
              {/* Left: CountUp numbers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md, minWidth: 180 }}>
                {stats.slice(0, 6).map((stat, i) => {
                  const animStart = 12 + i * 6;
                  const animDuration = 25;
                  const countUpValue = interpolate(
                    frame,
                    [animStart, animStart + animDuration],
                    [0, stat.value],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
                  );
                  const displayValue =
                    stat.value % 1 === 0
                      ? Math.round(countUpValue).toLocaleString()
                      : countUpValue.toFixed(1);
                  const { opacity, translateY } = staggerIn(frame, i, 10, 6);
                  return (
                    <div
                      key={i}
                      style={{
                        opacity,
                        transform: `translateY(${translateY}px)`,
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: sp.xs / 2,
                      }}
                    >
                      {stat.prefix && (
                        <span style={{ fontSize: 20, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                          {stat.prefix}
                        </span>
                      )}
                      <span style={{ fontSize: 32, fontWeight: 900, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {displayValue}
                      </span>
                      {stat.suffix && (
                        <span style={{ fontSize: 20, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Right: BarChart */}
              <div style={{ flex: 1 }}>
                <BarChart bars={barBars} accentColor={theme.accent} />
              </div>
            </div>
          ) : (
            <BarChart bars={barBars} accentColor={theme.accent} />
          )}
        </div>
      </div>
    );
  }

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

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: sp.lg,
            flex: 1,
          }}
        >
          {stats.slice(0, 6).map((stat, i) => {
            const { opacity, translateY } = staggerIn(frame, i, 10, 6);

            // CountUp interpolation: starts at count-up animation around frame 10+i*6
            const animStart = 12 + i * 6;
            const animDuration = 25;
            const countUpValue = interpolate(
              frame,
              [animStart, animStart + animDuration],
              [0, stat.value],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              }
            );

            const displayValue =
              stat.value % 1 === 0
                ? Math.round(countUpValue).toLocaleString()
                : countUpValue.toFixed(1);

            return (
              <div
                key={i}
                style={{
                  ...glassCard(theme),
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: sp.sm,
                  padding: sp.xl,
                }}
              >
                {/* Number */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: sp.xs / 2,
                  }}
                >
                  {stat.prefix && (
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: theme.accent,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {stat.prefix}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      color: theme.accent,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    {displayValue}
                  </span>
                  {stat.suffix && (
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: theme.accent,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  style={{
                    ...typo.t5,
                    color: theme.muted,
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
