import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolate, Easing } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, radius } from '../tokens';
import { fadeIn } from '../utils/interpolate';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success';
  text: string;
}

interface TerminalSlideProps {
  theme: SlideTheme;
  label?: string;
  lines: TerminalLine[];
  title?: string;
}

function getLineColor(type: TerminalLine['type'], accentColor: string, theme: SlideTheme): string {
  switch (type) {
    case 'command': return accentColor;
    case 'error': return theme.accent3;
    case 'success': return '#4ade80';
    case 'output':
    default: return theme.text;
  }
}

export const TerminalSlide: React.FC<TerminalSlideProps> = ({
  theme,
  label = 'TERMINAL',
  lines,
  title = 'bash',
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const windowOpacity = fadeIn(frame, 5, 18);

  // Each line appears after a delay; typing effect on command lines
  const framesPerLine = 8;
  const typingDuration = 12;

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

        {/* Terminal window */}
        <div
          style={{
            flex: 1,
            opacity: windowOpacity,
            background: '#0d1117',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: radius.lg,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: `${sp.sm}px ${sp.md}px`,
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: sp.sm,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
            <span
              style={{
                ...typo.t5,
                color: theme.muted,
                marginLeft: sp.md,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {title}
            </span>
          </div>

          {/* Terminal content */}
          <div
            style={{
              padding: sp.xl,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.xs,
            }}
          >
            {lines.map((line, i) => {
              const lineStart = 10 + i * framesPerLine;
              const lineOpacity = fadeIn(frame, lineStart, 8);

              // Typing effect: only for command lines
              let displayText = line.text;
              if (line.type === 'command') {
                const charCount = interpolate(
                  frame,
                  [lineStart, lineStart + typingDuration],
                  [0, line.text.length],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.linear,
                  }
                );
                displayText = line.text.slice(0, Math.floor(charCount));
              }

              const lineColor = getLineColor(line.type, theme.accent, theme);

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: sp.sm,
                    opacity: lineOpacity,
                  }}
                >
                  {line.type === 'command' && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 16,
                        color: theme.accent,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      $
                    </span>
                  )}
                  {line.type !== 'command' && (
                    <span style={{ width: 16, flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 16,
                      color: lineColor,
                      fontWeight: line.type === 'command' ? 600 : 400,
                      whiteSpace: 'pre',
                    }}
                  >
                    {displayText}
                    {/* Cursor blink on last command line being typed */}
                    {line.type === 'command' &&
                      displayText.length < line.text.length && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 16,
                            background: theme.accent,
                            marginLeft: 2,
                            verticalAlign: 'text-bottom',
                          }}
                        />
                      )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
