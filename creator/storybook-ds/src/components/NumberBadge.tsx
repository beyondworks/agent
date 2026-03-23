import React from 'react';
import { colors, fontFamily, fontSize, fontWeight, spacing } from '../tokens/tokens';

interface NumberBadgeProps {
  n: number | string;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({ n }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: spacing.xl,
        height: spacing.xl,
        borderRadius: '50%',
        border: `1px solid ${colors.accent.primary}`,
        background: 'transparent',
        fontFamily: fontFamily.mono,
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.accent.primary,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
};
