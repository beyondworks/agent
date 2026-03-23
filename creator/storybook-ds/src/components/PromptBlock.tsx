import React from 'react';
import { colors, fontFamily, fontSize, spacing, borderRadius } from '../tokens/tokens';

interface PromptBlockProps {
  label?: string;
  bad?: boolean;
  children: React.ReactNode;
}

export const PromptBlock: React.FC<PromptBlockProps> = ({ label, bad = false, children }) => {
  const tintColor = bad ? 'rgba(255, 82, 82, 0.06)' : colors.bg.card;
  const borderColor = bad ? 'rgba(255, 82, 82, 0.15)' : colors.border.glass;
  const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];

  return (
    <div
      style={{
        background: tintColor,
        border: `1px solid ${borderColor}`,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
      }}
    >
      {/* macOS header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          padding: `${spacing.sm}px ${spacing.md}px`,
          borderBottom: `1px solid ${colors.border.dim}`,
        }}
      >
        {dotColors.map((color, i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              opacity: 0.7,
            }}
          />
        ))}
        {label && (
          <span
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.label - 3,
              color: colors.text.muted,
              marginLeft: spacing.sm,
            }}
          >
            {label}
          </span>
        )}
      </div>
      {/* Content */}
      <div
        style={{
          padding: spacing.md,
          fontFamily: fontFamily.mono,
          fontSize: fontSize.mono,
          lineHeight: 1.7,
          color: bad ? 'rgba(255, 82, 82, 0.7)' : colors.text.secondary,
          whiteSpace: 'pre-wrap',
        }}
      >
        {children}
      </div>
    </div>
  );
};
