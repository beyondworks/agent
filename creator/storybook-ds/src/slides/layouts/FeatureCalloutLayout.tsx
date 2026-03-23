import type React from 'react';

interface FeatureCalloutLayoutProps {
  main: React.ReactNode;
  supporting: React.ReactNode;
  gap?: string;
}

export const FeatureCalloutLayout: React.FC<FeatureCalloutLayoutProps> = ({
  main,
  supporting,
  gap = '1.25vw',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        width: '100%',
      }}
    >
      <div style={{ width: '60%', flexShrink: 0 }}>{main}</div>
      <div
        style={{
          width: '35%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap,
        }}
      >
        {supporting}
      </div>
    </div>
  );
};
