import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, ANIMATION_PRESETS, sp } from '../tokens';
import { fadeIn, staggerIn } from '../utils/interpolate';

interface BarItem {
  label: string;
  value: number; // 0~100
  color?: string;
  sublabel?: string;
}

interface BarChartProps {
  bars: BarItem[];
  accentColor?: string;
  compareMode?: boolean;
  maxWidth?: number;
  barHeight?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  bars,
  accentColor = VISUAL_THEME.accent,
  compareMode = false,
  maxWidth = 700,
  barHeight = 48,
}) => {
  const frame = useCurrentFrame();

  const barDuration = ANIMATION_PRESETS.barFill.duration;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.md, width: maxWidth }}>
      {bars.map((bar, i) => {
        const animStart = 10 + i * 8;
        const { opacity, translateY } = staggerIn(frame, i, 8, 6);

        const fillWidth = interpolate(
          frame,
          [animStart, animStart + barDuration],
          [0, bar.value],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          }
        );

        const labelOpacity = fadeIn(frame, animStart + barDuration - 5, 10);

        const barColor = bar.color ?? (compareMode && i % 2 === 1 ? VISUAL_THEME.danger : accentColor);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {/* Label */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 600, color: VISUAL_THEME.textPrimary }}>
                {bar.label}
              </span>
              {bar.sublabel && (
                <span style={{ fontSize: 14, color: VISUAL_THEME.textSecondary }}>
                  {bar.sublabel}
                </span>
              )}
            </div>

            {/* Bar track */}
            <div
              style={{
                width: '100%',
                height: barHeight,
                background: VISUAL_THEME.bgTertiary,
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Fill */}
              <div
                style={{
                  width: `${fillWidth}%`,
                  height: '100%',
                  background: barColor,
                  borderRadius: 8,
                  boxShadow: `0 0 16px ${barColor}44`,
                  transition: 'none',
                }}
              />
              {/* Value label at bar end */}
              <span
                style={{
                  position: 'absolute',
                  right: `${100 - fillWidth + 1}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: VISUAL_THEME.textPrimary,
                  opacity: labelOpacity,
                  paddingLeft: 8,
                }}
              >
                {Math.round(fillWidth)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
