import type React from 'react';
import { memphisTheme } from '../themes/memphis';

interface MemphisSlideProps {
  children: React.ReactNode;
  bg?: string;
}

export const MemphisSlide: React.FC<MemphisSlideProps> = ({ children, bg }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        background: bg ?? memphisTheme.bgSlide,
        fontFamily: memphisTheme.fontBody,
        overflow: 'hidden',
        color: memphisTheme.textPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '2%',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};
