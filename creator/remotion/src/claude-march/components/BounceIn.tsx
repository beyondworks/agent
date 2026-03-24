import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface BounceInProps {
  children: React.ReactNode;
  startFrame: number;
  style?: React.CSSProperties;
}

export const BounceIn: React.FC<BounceInProps> = ({ children, startFrame, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;

  const scale = spring({ fps, frame: local, config: { damping: 8, mass: 0.5, stiffness: 200 } });
  const opacity = spring({ fps, frame: local, config: { damping: 15, mass: 0.5 } });

  return (
    <div style={{ transform: `scale(${scale})`, opacity, ...style }}>
      {children}
    </div>
  );
};
