import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, ANIMATION_PRESETS } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface TextBlinkProps {
  items: string[];
  mode?: 'sequential' | 'highlight';
  interval?: number;
  startFrame?: number;
  fontSize?: number;
  accentColor?: string;
}

export const TextBlink: React.FC<TextBlinkProps> = ({
  items,
  mode = 'sequential',
  interval = ANIMATION_PRESETS.blinkInterval.framesPerItem,
  startFrame = 0,
  fontSize = 56,
  accentColor = VISUAL_THEME.accent,
}) => {
  const frame = useCurrentFrame();
  const relFrame = Math.max(0, frame - startFrame);

  if (mode === 'sequential') {
    // Show one item at a time, cycling through
    const activeIndex = Math.floor(relFrame / interval) % items.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {items.map((item, i) => {
          const isActive = i === activeIndex && frame >= startFrame;
          const itemOpacity = isActive
            ? interpolate(relFrame % interval, [0, 5, interval - 5, interval], [0, 1, 1, 0], {
                extrapolateRight: 'clamp',
              })
            : 0;

          return (
            <span
              key={i}
              style={{
                fontSize,
                fontWeight: 800,
                color: accentColor,
                opacity: itemOpacity,
                position: i === 0 ? 'relative' : 'absolute',
                letterSpacing: '-0.03em',
              }}
            >
              {item}
            </span>
          );
        })}
      </div>
    );
  }

  // highlight mode: all visible, one highlighted at a time
  const allOpacity = fadeIn(frame, startFrame, 15);
  const highlightIndex = Math.floor(relFrame / interval) % items.length;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
        opacity: allOpacity,
      }}
    >
      {items.map((item, i) => {
        const isHighlighted = i === highlightIndex && frame >= startFrame + 15;
        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: isHighlighted ? accentColor : VISUAL_THEME.textMuted,
              textShadow: isHighlighted ? `0 0 30px ${accentColor}66` : 'none',
              transition: 'none',
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
};
