import React from 'react';
import { fs } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
  glowColor?: 'accent' | 'danger';
  padding?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children, style, glow, glowColor = 'accent', padding = 40,
}) => {
  return (
    <div
      style={{
        background: fs.card.bg,
        backdropFilter: `blur(${fs.card.backdropBlur}px)`,
        WebkitBackdropFilter: `blur(${fs.card.backdropBlur}px)`,
        border: fs.card.border,
        borderRadius: fs.card.borderRadius,
        padding,
        boxShadow: glow
          ? `${fs.glow(glowColor)}, inset 0 1px 0 rgba(255,255,255,0.06)`
          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
