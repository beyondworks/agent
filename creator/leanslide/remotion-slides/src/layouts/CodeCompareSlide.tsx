import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, radius } from '../tokens';
import { fadeIn, slideLeft, slideRight } from '../utils/interpolate';

interface CodeCompareSlideProps {
  theme: SlideTheme;
  label?: string;
  before: {
    label?: string;
    code: string;
  };
  after: {
    label?: string;
    code: string;
  };
}

const CodeBlock: React.FC<{
  code: string;
  accentColor: string;
  theme: SlideTheme;
  startFrame: number;
  frame: number;
}> = ({ code, accentColor, theme, startFrame, frame }) => {
  const lines = code.split('\n');
  return (
    <div
      style={{
        background: '#0d1117',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderTop: `2px solid ${accentColor}`,
        borderRadius: radius.lg,
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: sp.md, flex: 1 }}>
        {lines.map((line, i) => {
          const lineOpacity = fadeIn(frame, startFrame + i * 3, 12);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: sp.md,
                opacity: lineOpacity,
                minHeight: 26,
              }}
            >
              <span
                style={{
                  ...typo.mono,
                  fontSize: 13,
                  color: theme.muted,
                  minWidth: 24,
                  textAlign: 'right',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  ...typo.mono,
                  fontSize: 14,
                  color: theme.text,
                  whiteSpace: 'pre',
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CodeCompareSlide: React.FC<CodeCompareSlideProps> = ({
  theme,
  label = 'CODE COMPARISON',
  before,
  after,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const leftOpacity = fadeIn(frame, 5, 18);
  const leftX = slideLeft(frame, 5, 20, 80);
  const rightOpacity = fadeIn(frame, 8, 18);
  const rightX = slideRight(frame, 8, 20, 80);

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div
          style={{
            ...typo.t4,
            color: theme.accent,
            opacity: labelOpacity,
            marginBottom: sp.lg,
          }}
        >
          {label}
        </div>

        {/* Split */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: sp.xl,
          }}
        >
          {/* BEFORE */}
          <div
            style={{
              flex: 1,
              opacity: leftOpacity,
              transform: `translateX(${leftX}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.sm,
            }}
          >
            <div
              style={{
                ...typo.t4,
                color: theme.accent3,
              }}
            >
              {before.label ?? 'BEFORE'}
            </div>
            <CodeBlock
              code={before.code}
              accentColor={theme.accent3}
              theme={theme}
              startFrame={10}
              frame={frame}
            />
          </div>

          {/* AFTER */}
          <div
            style={{
              flex: 1,
              opacity: rightOpacity,
              transform: `translateX(${rightX}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.sm,
            }}
          >
            <div
              style={{
                ...typo.t4,
                color: theme.accent,
              }}
            >
              {after.label ?? 'AFTER'}
            </div>
            <CodeBlock
              code={after.code}
              accentColor={theme.accent}
              theme={theme}
              startFrame={12}
              frame={frame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
