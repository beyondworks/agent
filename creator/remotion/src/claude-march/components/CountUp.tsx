import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  startFrame: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  value, suffix = '', prefix = '', startFrame, duration = 45,
  fontSize = 80, color = fs.accent, style,
}) => {
  const frame = useCurrentFrame();
  const current = Math.floor(
    interpolate(frame, [startFrame, startFrame + duration], [0, value], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <span
      style={{
        fontFamily: fs.font,
        fontSize,
        fontWeight: 800,
        color,
        letterSpacing: '-0.03em',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
};
