import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, sp, radius } from '../tokens';
import { fadeIn, drawLine } from '../utils/interpolate';

interface CheckItem {
  text: string;
  checked: boolean;
}

interface CheckListProps {
  items: CheckItem[];
  startFrame?: number;
  staggerDelay?: number;
  accentColor?: string;
}

export const CheckList: React.FC<CheckListProps> = ({
  items,
  startFrame = 0,
  staggerDelay = 8,
  accentColor = VISUAL_THEME.accent,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
      {items.map((item, i) => {
        const itemStart = startFrame + i * staggerDelay;

        // Slide in from left
        const slideX = interpolate(
          frame,
          [itemStart, itemStart + 15],
          [-40, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
        );
        const opacity = fadeIn(frame, itemStart, 12);

        // Check/X animation starts after slide-in
        const markStart = itemStart + 10;
        const markProgress = drawLine(frame, markStart, 15);

        // Check: SVG stroke draw. X: scale+rotate
        const markScale = interpolate(
          frame,
          [markStart, markStart + 8, markStart + 12],
          [0, 1.15, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const markRotation = item.checked
          ? 0
          : interpolate(frame, [markStart, markStart + 8], [-20, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

        const markColor = item.checked ? accentColor : VISUAL_THEME.danger;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: sp.sm,
              opacity,
              transform: `translateX(${slideX}px)`,
              padding: `${sp.sm}px ${sp.md}px`,
              background: VISUAL_THEME.bgSecondary,
              border: `1px solid ${VISUAL_THEME.bgTertiary}`,
              borderRadius: radius.md,
            }}
          >
            {/* Mark icon */}
            <div
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${markScale}) rotate(${markRotation}deg)`,
              }}
            >
              {item.checked ? (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke={markColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={30}
                    strokeDashoffset={markProgress * 30}
                  />
                </svg>
              ) : (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke={markColor} strokeWidth={3} strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Text */}
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: item.checked ? VISUAL_THEME.textPrimary : VISUAL_THEME.textSecondary,
                textDecoration: !item.checked ? 'line-through' : 'none',
                textDecorationColor: VISUAL_THEME.danger,
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
