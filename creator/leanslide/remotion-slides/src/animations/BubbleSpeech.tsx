import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, ANIMATION_PRESETS, sp, radius } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface BubbleSpeechProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  bgColor?: string;
  textColor?: string;
  startFrame?: number;
  maxWidth?: number;
}

export const BubbleSpeech: React.FC<BubbleSpeechProps> = ({
  text,
  position = 'top',
  bgColor = VISUAL_THEME.accent,
  textColor = VISUAL_THEME.bg,
  startFrame = 0,
  maxWidth = 400,
}) => {
  const frame = useCurrentFrame();

  // Bounce pop: 0 → 1.1 → 1.0
  const scale = interpolate(
    frame,
    [startFrame, startFrame + 8, startFrame + ANIMATION_PRESETS.bouncePop.duration],
    [0, ANIMATION_PRESETS.bouncePop.overshoot, 1.0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(2)),
    }
  );

  const opacity = fadeIn(frame, startFrame, 6);

  // Tail based on position
  const tailSize = 12;
  const tailStyle: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
  };

  const getTail = () => {
    switch (position) {
      case 'bottom':
        return (
          <div
            style={{
              ...tailStyle,
              top: -tailSize,
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${tailSize}px solid transparent`,
              borderRight: `${tailSize}px solid transparent`,
              borderBottom: `${tailSize}px solid ${bgColor}`,
            }}
          />
        );
      case 'top':
        return (
          <div
            style={{
              ...tailStyle,
              bottom: -tailSize,
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${tailSize}px solid transparent`,
              borderRight: `${tailSize}px solid transparent`,
              borderTop: `${tailSize}px solid ${bgColor}`,
            }}
          />
        );
      case 'left':
        return (
          <div
            style={{
              ...tailStyle,
              right: -tailSize,
              top: '50%',
              transform: 'translateY(-50%)',
              borderTop: `${tailSize}px solid transparent`,
              borderBottom: `${tailSize}px solid transparent`,
              borderLeft: `${tailSize}px solid ${bgColor}`,
            }}
          />
        );
      case 'right':
        return (
          <div
            style={{
              ...tailStyle,
              left: -tailSize,
              top: '50%',
              transform: 'translateY(-50%)',
              borderTop: `${tailSize}px solid transparent`,
              borderBottom: `${tailSize}px solid transparent`,
              borderRight: `${tailSize}px solid ${bgColor}`,
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'center center',
        position: 'relative',
        display: 'inline-block',
        maxWidth,
      }}
    >
      {/* Bubble body */}
      <div
        style={{
          background: bgColor,
          borderRadius: radius.lg,
          padding: `${sp.sm}px ${sp.md}px`,
          boxShadow: `0 4px 24px ${bgColor}33`,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: textColor,
            lineHeight: 1.4,
          }}
        >
          {text}
        </span>
      </div>
      {/* Tail */}
      {getTail()}
    </div>
  );
};
