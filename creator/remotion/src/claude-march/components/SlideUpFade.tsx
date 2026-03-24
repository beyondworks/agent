import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

interface SlideUpFadeProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
}

export const SlideUpFade: React.FC<SlideUpFadeProps> = ({
  children, startFrame, duration = 20, distance = 40, style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [startFrame, startFrame + duration], [distance, 0], {
    easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, ...style }}>
      {children}
    </div>
  );
};
