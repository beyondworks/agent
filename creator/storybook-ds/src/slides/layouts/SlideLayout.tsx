import type React from 'react';
import { memphisTheme } from '../../themes/memphis';

interface SlideLayoutProps {
  children: React.ReactNode;
  bg?: string;
  padding?: string;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({
  children,
  bg,
  padding = '5% 5%',
}) => {
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding,
        }}
      >
        {children}
      </div>
    </div>
  );
};
