import React from 'react';
import { memphisTheme } from '../themes/memphis';

const slugMap: Record<string, string> = {
  openai: 'openai',
  anthropic: 'anthropic',
  perplexity: 'perplexity',
  canva: 'canva',
  google: 'google',
  microsoft: 'microsoft',
  meta: 'meta',
  github: 'github',
};

const sizeMap = {
  sm: '1.2vw',
  md: '2vw',
  lg: '3vw',
} as const;

interface ServiceLogoProps {
  service: 'openai' | 'anthropic' | 'perplexity' | 'canva' | 'google' | 'microsoft' | 'meta' | 'github';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({
  service,
  size = 'md',
  color = '#1a1a1a',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const slug = slugMap[service];
  const dim = sizeMap[size];
  const encodedColor = color.replace('#', '');
  const url = `https://cdn.simpleicons.org/${slug}/${encodedColor}`;

  if (imgError) {
    return (
      <span
        style={{
          fontFamily: memphisTheme.fontHeading,
          fontWeight: 900,
          fontSize: `calc(${dim} * 0.5)`,
          color: '#fff',
          background: color === '#ffffff' ? 'rgba(255,255,255,0.3)' : memphisTheme.border,
          border: `2px solid ${color === '#ffffff' ? 'rgba(255,255,255,0.4)' : memphisTheme.border}`,
          borderRadius: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: dim,
          height: dim,
          textTransform: 'uppercase',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
      >
        {service.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={service}
      style={{
        width: dim,
        height: dim,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      onError={() => setImgError(true)}
    />
  );
};
