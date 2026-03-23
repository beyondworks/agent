import React from 'react';
import { colors, fontFamily } from '../tokens/tokens';

interface BadgeProps {
  label: string;
}

export const Badge: React.FC<BadgeProps & { style?: React.CSSProperties }> = ({ label, style }) => {
  return (
    <div style={{ display: 'flex' }}>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 15,
          fontWeight: 700,
          textTransform: 'uppercase' as const,
          letterSpacing: 2.5,
          color: colors.accent.primary,
          background: colors.accent.soft,
          border: `1px solid ${colors.accent.border}`,
          borderRadius: 20,
          padding: '8px 20px',
          ...style,
        }}
      >
        {label}
      </span>
    </div>
  );
};
