import React from 'react';
import { colors, fontFamily } from '../tokens/tokens';

interface SlideBaseProps {
  variant?: 'default' | 'dark';
  children: React.ReactNode;
}

export const SlideBase: React.FC<SlideBaseProps> = ({ variant = 'default', children }) => {
  const bg = variant === 'dark' ? colors.bg.base : colors.bg.slide;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        background: bg,
        fontFamily: fontFamily.sans,
        overflow: 'hidden',
        color: colors.text.primary,
      }}
    >
      {/* Teal orb top-right */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.orb.teal,
          pointerEvents: 'none',
        }}
      />
      {/* Purple orb bottom-left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: colors.orb.purple,
          pointerEvents: 'none',
        }}
      />
      {/* Grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${colors.border.dim} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border.dim} 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};
