import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

interface DotsLoaderProps {
  color?: string;
  theme: { accent: string; bg: string; text: string };
  /** 점 개수 (기본 3) */
  dotCount?: number;
  /** 점 크기 px (기본 12) */
  dotSize?: number;
  /** 점 간격 px (기본 24) */
  gap?: number;
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({
  color,
  theme,
  dotCount = 3,
  dotSize = 12,
  gap = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotColor = color ?? theme.accent;

  // 1초 = fps 프레임, 한 사이클
  const cycleDuration = fps;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => {
        // 각 점에 위상차 적용
        const phaseOffset = (i / dotCount) * cycleDuration * 0.4;
        const localFrame = (frame + cycleDuration - phaseOffset) % cycleDuration;

        // 0→peak→0 사이클
        const peakFrame = cycleDuration * 0.3;
        const scale = interpolate(
          localFrame,
          [0, peakFrame, peakFrame * 2, cycleDuration],
          [0.5, 1.4, 0.5, 0.5],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.ease),
          },
        );

        const opacity = interpolate(
          localFrame,
          [0, peakFrame, peakFrame * 2, cycleDuration],
          [0.3, 1, 0.3, 0.3],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );

        return (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              background: dotColor,
              transform: `scale(${scale})`,
              opacity,
              boxShadow:
                scale > 1
                  ? `0 0 ${dotSize}px ${dotColor}`
                  : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
