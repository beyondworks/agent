import React from 'react';
import { colors, fontFamily, fontSize, spacing } from '../tokens/tokens';

interface CliPromptProps {
  children: React.ReactNode;
}

export const CliPrompt: React.FC<CliPromptProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.sm,
        fontFamily: fontFamily.mono,
        fontSize: fontSize.mono,
        color: colors.accent.primary,
      }}
    >
      <span style={{ opacity: 0.5 }}>$</span>
      <span>{children}</span>
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: fontSize.mono,
          background: colors.accent.primary,
          animation: 'blink 1s step-end infinite',
        }}
      />
    </div>
  );
};
