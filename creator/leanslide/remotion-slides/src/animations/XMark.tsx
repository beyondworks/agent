import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME } from '../tokens';
import { fadeIn, drawLine, popIn } from '../utils/interpolate';

interface MarkerProps {
  startFrame?: number;
  size?: number;
}

/** X mark: red, scale + rotate -20deg -> 0deg */
export const XMark: React.FC<MarkerProps> = ({ startFrame = 0, size = 48 }) => {
  const frame = useCurrentFrame();

  const scale = popIn(frame, startFrame);
  const rotation = interpolate(
    frame,
    [startFrame, startFrame + 8],
    [-20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const opacity = fadeIn(frame, startFrame, 8);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
      }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke={VISUAL_THEME.danger}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/** Check mark: green, SVG stroke draw */
export const CheckMark: React.FC<MarkerProps> = ({ startFrame = 0, size = 48 }) => {
  const frame = useCurrentFrame();

  const scale = popIn(frame, startFrame);
  const progress = drawLine(frame, startFrame, 18);
  const opacity = fadeIn(frame, startFrame, 8);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke={VISUAL_THEME.success}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={30}
          strokeDashoffset={progress * 30}
        />
      </svg>
    </div>
  );
};
