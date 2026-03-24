import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { fs } from '../theme';

interface BlurRevealProps {
  text: string;
  startFrame: number;
  stagger?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
  /** true면 글자 단위, false면 단어 단위 (한글은 글자 단위 추천) */
  charMode?: boolean;
}

export const BlurReveal: React.FC<BlurRevealProps> = ({
  text,
  startFrame,
  stagger = 4,
  fontSize = 64,
  color = fs.text,
  fontWeight = 700,
  style,
  charMode = false,
}) => {
  const frame = useCurrentFrame();
  const units = charMode ? text.split('') : text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: charMode ? 0 : '0 0.3em',
        fontFamily: fs.font,
        fontSize,
        fontWeight,
        color,
        letterSpacing: fs.letterSpacing,
        lineHeight: 1.3,
        wordBreak: 'keep-all',
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const unitStart = startFrame + i * stagger;
        const blur = interpolate(frame, [unitStart, unitStart + 12], [16, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(frame, [unitStart, unitStart + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span key={i} style={{ filter: `blur(${blur}px)`, opacity }}>
            {unit}
          </span>
        );
      })}
    </div>
  );
};
