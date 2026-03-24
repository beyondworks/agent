import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { fs } from '../theme';

interface TypingCursorProps {
  text: string;
  startFrame: number;
  /** 글자당 프레임 수 */
  speed?: number;
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}

export const TypingCursor: React.FC<TypingCursorProps> = ({
  text, startFrame, speed = 2, fontSize = 48, color = fs.text,
  cursorColor = fs.accent, mono = false, style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0) return null;

  const charCount = Math.floor(
    interpolate(local, [0, text.length * speed], [0, text.length], {
      extrapolateRight: 'clamp',
    })
  );
  const displayed = text.slice(0, charCount);
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;
  const showCursor = charCount < text.length || local < text.length * speed + 30;

  return (
    <div
      style={{
        fontFamily: mono ? fs.mono : fs.font,
        fontSize,
        fontWeight: mono ? 400 : 700,
        color,
        letterSpacing: mono ? '0' : fs.letterSpacing,
        lineHeight: 1.4,
        wordBreak: 'keep-all',
        ...style,
      }}
    >
      {displayed}
      {showCursor && (
        <span style={{ color: cursorColor, opacity: cursorOpacity, fontWeight: 300 }}>│</span>
      )}
    </div>
  );
};
