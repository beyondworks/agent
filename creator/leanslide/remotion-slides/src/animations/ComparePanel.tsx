import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, ANIMATION_PRESETS, sp, radius } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface PanelSide {
  label: string;
  content: React.ReactNode;
  color?: 'good' | 'bad';
}

interface ComparePanelProps {
  left: PanelSide;
  right: PanelSide;
  dividerAnimated?: boolean;
  startFrame?: number;
  width?: number;
  height?: number;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({
  left,
  right,
  dividerAnimated = true,
  startFrame = 0,
  width = 1200,
  height = 600,
}) => {
  const frame = useCurrentFrame();

  // Divider draws top → bottom
  const dividerDuration = ANIMATION_PRESETS.dividerDraw.duration;
  const dividerProgress = dividerAnimated
    ? interpolate(
        frame,
        [startFrame, startFrame + dividerDuration],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
      )
    : 1;

  // Left panel slides in from left
  const leftSlide = interpolate(
    frame,
    [startFrame + 5, startFrame + 23],
    [-60, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  const leftOpacity = fadeIn(frame, startFrame + 5, 18);

  // Right panel slides in from right
  const rightSlide = interpolate(
    frame,
    [startFrame + 5, startFrame + 23],
    [60, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );
  const rightOpacity = fadeIn(frame, startFrame + 5, 18);

  const getBorderColor = (color?: 'good' | 'bad') => {
    if (color === 'good') return VISUAL_THEME.success;
    if (color === 'bad') return VISUAL_THEME.danger;
    return VISUAL_THEME.bgTertiary;
  };

  const panelWidth = (width - sp.xl) / 2;

  return (
    <div style={{ width, height, position: 'relative', display: 'flex', gap: sp.xl }}>
      {/* Left panel */}
      <div
        style={{
          width: panelWidth,
          opacity: leftOpacity,
          transform: `translateX(${leftSlide}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: getBorderColor(left.color),
            marginBottom: sp.sm,
          }}
        >
          {left.label}
        </div>
        {/* Content card */}
        <div
          style={{
            flex: 1,
            background: VISUAL_THEME.bgSecondary,
            border: `2px solid ${getBorderColor(left.color)}`,
            borderRadius: radius.lg,
            padding: sp.lg,
            overflow: 'hidden',
          }}
        >
          {left.content}
        </div>
      </div>

      {/* Center divider */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          width: 2,
          height: `${dividerProgress * 100}%`,
          background: `linear-gradient(180deg, ${VISUAL_THEME.accent}88, ${VISUAL_THEME.accent}22)`,
        }}
      />

      {/* Right panel */}
      <div
        style={{
          width: panelWidth,
          opacity: rightOpacity,
          transform: `translateX(${rightSlide}px)`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: getBorderColor(right.color),
            marginBottom: sp.sm,
          }}
        >
          {right.label}
        </div>
        {/* Content card */}
        <div
          style={{
            flex: 1,
            background: VISUAL_THEME.bgSecondary,
            border: `2px solid ${getBorderColor(right.color)}`,
            borderRadius: radius.lg,
            padding: sp.lg,
            overflow: 'hidden',
          }}
        >
          {right.content}
        </div>
      </div>
    </div>
  );
};
