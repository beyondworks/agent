import type React from 'react';

interface CenterLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const CenterLayout: React.FC<CenterLayoutProps> = ({
  children,
  maxWidth = '55%',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div style={{ maxWidth, width: '100%' }}>{children}</div>
    </div>
  );
};
