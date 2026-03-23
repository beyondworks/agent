import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface StrokeProgressProps {
  /** 채우기 완료까지 프레임 수 */
  duration: number;
  color?: string;
  theme: { accent: string; bg: string; bgLight: string; text: string; textDim: string };
  /** 바 너비 px (기본 400) */
  width?: number;
  /** 바 높이 px (기본 8) */
  height?: number;
  /** 라벨 텍스트 (좌측 표시) */
  label?: string;
  /** 퍼센트 표시 여부 (기본 false) */
  showPercent?: boolean;
}

export const StrokeProgress: React.FC<StrokeProgressProps> = ({
  duration,
  color,
  theme,
  width = 400,
  height = 8,
  label,
  showPercent = false,
}) => {
  const frame = useCurrentFrame();

  const barColor = color ?? theme.accent;

  // 진행률 0→1
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const fillWidth = progress * width;

  // 완료 시 glow
  const isComplete = progress >= 0.99;
  const glowOpacity = isComplete
    ? interpolate(frame, [duration, duration + 15], [0, 0.8], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const glowSpread = isComplete
    ? interpolate(frame, [duration, duration + 15], [0, 12], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // 등장 페이드
  const containerOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        opacity: containerOpacity,
      }}
    >
      {/* 상단: 라벨 + 퍼센트 */}
      {(label || showPercent) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width,
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {label && <span style={{ color: theme.text }}>{label}</span>}
          {showPercent && (
            <span style={{ color: theme.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
              {Math.round(progress * 100)}%
            </span>
          )}
        </div>
      )}

      {/* 프로그레스바 */}
      <div
        style={{
          width,
          height,
          borderRadius: height / 2,
          background: theme.bgLight,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 채워지는 바 */}
        <div
          style={{
            width: fillWidth,
            height: '100%',
            borderRadius: height / 2,
            background: barColor,
            position: 'relative',
            boxShadow: isComplete
              ? `0 0 ${glowSpread}px ${barColor}`
              : 'none',
          }}
        >
          {/* 끝단 하이라이트 점 */}
          {fillWidth > height && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translate(50%, -50%)',
                width: height + 4,
                height: height + 4,
                borderRadius: '50%',
                background: barColor,
                opacity: glowOpacity > 0 ? glowOpacity : 0.6,
                boxShadow: `0 0 ${8 + glowSpread}px ${barColor}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
