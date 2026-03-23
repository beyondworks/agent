import React from 'react';
import { colors } from '../tokens/tokens';

interface GradientDividerProps {
  width?: number;
}

export const GradientDivider: React.FC<GradientDividerProps> = ({ width = 32 }) => {
  return (
    <div
      style={{
        width,
        height: 1,
        background: `linear-gradient(90deg, ${colors.accent.primary}, transparent)`,
        opacity: 0.3,
      }}
    />
  );
};
