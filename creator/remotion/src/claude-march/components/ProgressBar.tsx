import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fs } from '../theme';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: fs.accent,
        }}
      />
    </div>
  );
};
