import type React from 'react';
import { memphisTheme } from '../themes/memphis';

interface MemphisBadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const MemphisBadge: React.FC<MemphisBadgeProps> = ({
  children,
  color = memphisTheme.purple,
}) => {
  return (
    <span
      style={{
        display: 'inline-block',
        background: color,
        border: `2px solid ${memphisTheme.border}`,
        borderRadius: memphisTheme.radius,
        padding: '5px 14px',
        fontFamily: memphisTheme.fontBody,
        fontSize: 12,
        fontWeight: 900,
        color: color === memphisTheme.yellow || color === memphisTheme.teal
          ? memphisTheme.textPrimary
          : '#FFFFFF',
        wordBreak: 'keep-all',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
};
