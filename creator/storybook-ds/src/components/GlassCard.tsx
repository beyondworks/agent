import React from 'react';
import { colors, borderRadius, blur, spacing } from '../tokens/tokens';

interface GlassCardProps {
  glow?: boolean;
  padding?: 'md' | 'lg';
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ glow = false, padding = 'md', children }) => {
  const pad = padding === 'lg' ? spacing.xl : spacing.lg;

  return (
    <div
      style={{
        background: colors.bg.card,
        border: `1px solid ${colors.border.glass}`,
        borderRadius: borderRadius.lg,
        backdropFilter: `blur(${blur.glass}px)`,
        WebkitBackdropFilter: `blur(${blur.glass}px)`,
        padding: pad,
        ...(glow
          ? {
              boxShadow: `0 0 24px ${colors.accent.soft}, 0 0 0 1px ${colors.accent.border}`,
              borderColor: colors.accent.border,
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
};
