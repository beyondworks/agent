import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';

interface CountUpProps {
  from: number;
  to: number;
  /** 숫자 뒤에 붙는 접미사 (%, +, 명 등) */
  suffix?: string;
  label?: string;
  theme: { accent: string; bg: string; text: string; textDim: string };
  /** 카운트 완료까지 프레임 수 (기본 40) */
  duration?: number;
  /** 숫자 폰트 크기 px (기본 64) */
  fontSize?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  from,
  to,
  suffix = '',
  label,
  theme,
  duration = 40,
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 현재 숫자값
  const currentValue = interpolate(frame, [0, duration], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const displayValue = Math.round(currentValue);

  // 완료 시 bounce 스케일
  const isComplete = frame >= duration;
  const bounceScale = isComplete
    ? spring({
        frame: frame - duration,
        fps,
        config: { damping: 6, stiffness: 200, mass: 0.5 },
      })
    : 1;

  // 아래→위 롤링 효과 (미세한 Y 오프셋으로 롤링 느낌)
  const rollingY = isComplete
    ? 0
    : interpolate(
        frame % 3,
        [0, 1, 2],
        [0, -1.5, 0],
      );

  // 등장 페이드
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity,
      }}
    >
      {/* 숫자 */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize,
          fontWeight: 700,
          color: theme.accent,
          lineHeight: 1,
          transform: `scale(${bounceScale}) translateY(${rollingY}px)`,
          letterSpacing: '-0.02em',
        }}
      >
        {displayValue.toLocaleString()}
        {suffix && (
          <span
            style={{
              fontSize: fontSize * 0.5,
              fontWeight: 500,
              color: theme.text,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* 라벨 */}
      {label && (
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: theme.textDim,
            opacity: interpolate(frame, [duration * 0.4, duration * 0.7], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
