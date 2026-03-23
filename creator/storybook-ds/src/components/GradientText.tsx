import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  as?: 'span' | 'h1' | 'h2' | 'h3';
}

export const GradientText: React.FC<GradientTextProps> = ({ children, as: Tag = 'span' }) => {
  return (
    <Tag
      style={{
        background: 'linear-gradient(135deg, #00BCD4, #80DEEA)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline',
        margin: 0,
        padding: 0,
        font: 'inherit',
      }}
    >
      {children}
    </Tag>
  );
};
