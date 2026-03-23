import type React from 'react';
import { memphisTheme, memphisShadowMap } from '../themes/memphis';

const colorMap = {
  pink: memphisTheme.pink,
  yellow: memphisTheme.yellow,
  teal: memphisTheme.teal,
  purple: memphisTheme.purple,
} as const;

const paddingMap = {
  sm: '1.2vw',
  md: '2vw',
  lg: '2.8vw',
} as const;

interface MemphisCardProps {
  color?: 'pink' | 'yellow' | 'teal' | 'purple';
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
}

export const MemphisCard: React.FC<MemphisCardProps> = ({
  color = 'pink',
  children,
  padding = 'md',
}) => {
  return (
    <div
      style={{
        background: colorMap[color],
        border: `${memphisTheme.borderWidth} solid ${memphisTheme.border}`,
        borderRadius: memphisTheme.radius,
        boxShadow: memphisShadowMap[color],
        padding: paddingMap[padding],
        wordBreak: 'keep-all',
      }}
    >
      {children}
    </div>
  );
};
