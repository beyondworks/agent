import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, staggerIn, slideLeft, slideRight } from '../utils/interpolate';

interface CodeSlideProps {
  theme: SlideTheme;
  label?: string;
  code: string;
  language?: string;
  explanation: string;
  explanationPoints?: string[];
}

function tokenizeLine(line: string, accentColor: string, accent2Color: string): React.ReactNode {
  // Simple syntax highlight: keywords in accent2, strings in accent3, comments in muted
  const keywords = /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|typeof|interface|type|extends|implements)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  const comments = /(\/\/.*)/g;

  // We'll do a simple character-by-character pass for demonstration
  // Replace in order: comments first (they win), then strings, then keywords
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Check for comment line
  const commentMatch = remaining.match(/^(\s*)(\/\/.*)$/);
  if (commentMatch) {
    if (commentMatch[1]) parts.push(<span key={key++}>{commentMatch[1]}</span>);
    parts.push(<span key={key++} style={{ color: '#64748b', fontStyle: 'italic' }}>{commentMatch[2]}</span>);
    return <>{parts}</>;
  }

  // Simple split-by-keyword approach (good enough for slides)
  const segments = remaining.split(
    /(\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|typeof|interface|type|extends|implements)\b|["'`][^"'`]*["'`])/g
  );

  for (const seg of segments) {
    if (!seg) continue;
    if (/^(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|typeof|interface|type|extends|implements)$/.test(seg)) {
      parts.push(<span key={key++} style={{ color: accent2Color, fontWeight: 600 }}>{seg}</span>);
    } else if (/^["'`].*["'`]$/.test(seg)) {
      parts.push(<span key={key++} style={{ color: '#86efac' }}>{seg}</span>);
    } else {
      parts.push(<span key={key++}>{seg}</span>);
    }
  }

  return <>{parts}</>;
}

export const CodeSlide: React.FC<CodeSlideProps> = ({
  theme,
  label = 'CODE',
  code,
  language = 'typescript',
  explanation,
  explanationPoints = [],
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const codeBlockOpacity = fadeIn(frame, 5, 18);
  const codeBlockX = slideLeft(frame, 5, 20, 60);
  const rightOpacity = fadeIn(frame, 10, 18);
  const rightX = slideRight(frame, 10, 20, 60);

  const lines = code.split('\n');
  const leftWidth = grid.span(7);
  const rightWidth = grid.span(5);

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

        {/* Split layout */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: sp.xl,
          }}
        >
          {/* Left: code block (7 col) */}
          <div
            style={{
              flex: 7,
              opacity: codeBlockOpacity,
              transform: `translateX(${codeBlockX}px)`,
            }}
          >
            <div
              style={{
                background: '#0d1117',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: radius.lg,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Code top bar */}
              <div
                style={{
                  padding: `${sp.sm}px ${sp.md}px`,
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sp.sm,
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ ...typo.t5, color: theme.muted, marginLeft: sp.sm }}>{language}</span>
              </div>

              {/* Lines */}
              <div style={{ padding: sp.md, flex: 1, overflow: 'hidden' }}>
                {lines.map((line, i) => {
                  const lineOpacity = fadeIn(frame, 12 + i * 3, 12);
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
                        {tokenizeLine(line, theme.accent, theme.accent2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: explanation (5 col) */}
          <div
            style={{
              flex: 5,
              opacity: rightOpacity,
              transform: `translateX(${rightX}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: sp.lg,
              justifyContent: 'center',
            }}
          >
            <div style={{ ...typo.t2, color: theme.text, lineHeight: 1.4 }}>{explanation}</div>
            {explanationPoints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
                {explanationPoints.map((pt, i) => {
                  const { opacity, translateY } = staggerIn(frame, i, 20, 5);
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: sp.sm,
                        opacity,
                        transform: `translateY(${translateY}px)`,
                      }}
                    >
                      <span style={{ color: theme.accent, fontWeight: 700, marginTop: 2, flexShrink: 0 }}>→</span>
                      <span style={{ ...typo.t3, color: theme.muted }}>{pt}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
