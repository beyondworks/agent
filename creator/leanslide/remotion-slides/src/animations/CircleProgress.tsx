import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';

interface CircleProgressProps {
  /** 중앙에 표시할 아이콘 (React 엘리먼트 또는 이모지 텍스트) */
  icon: React.ReactNode;
  label: string;
  theme: { accent: string; bg: string; text: string; textDim: string };
  /** 진행 완료까지 프레임 수 (기본 45) */
  fillDuration?: number;
  /** 원 반지름 px (기본 80) */
  radius?: number;
  /** 선 두께 (기본 6) */
  strokeWidth?: number;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  icon,
  label,
  theme,
  fillDuration = 45,
  radius = 80,
  strokeWidth = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circumference = 2 * Math.PI * radius;

  // 진행률 0→1
  const progress = interpolate(frame, [0, fillDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const dashOffset = circumference * (1 - progress);

  // 완료 시 아이콘 pop
  const isComplete = frame >= fillDuration;
  const iconScale = isComplete
    ? spring({
        frame: frame - fillDuration,
        fps,
        config: { damping: 8, stiffness: 200, mass: 0.6 },
      })
    : interpolate(frame, [0, fillDuration * 0.3], [0.6, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  // 완료 glow
  const glowOpacity = isComplete
    ? interpolate(frame, [fillDuration, fillDuration + 20], [0, 0.4], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const size = (radius + strokeWidth) * 2 + 20;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* 배경 트랙 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.textDim}
            strokeWidth={strokeWidth}
            opacity={0.2}
          />
          {/* 진행 stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.accent}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* 완료 glow */}
          {isComplete && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 8}
              fill="none"
              stroke={theme.accent}
              strokeWidth={2}
              opacity={glowOpacity}
            />
          )}
        </svg>

        {/* 중앙 아이콘 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${iconScale})`,
            fontSize: radius * 0.5,
          }}
        >
          {icon}
        </div>
      </div>

      {/* 라벨 */}
      <div
        style={{
          color: theme.text,
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          opacity: interpolate(frame, [fillDuration * 0.5, fillDuration * 0.7], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {label}
      </div>
    </div>
  );
};
