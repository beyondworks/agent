import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, radius, grid } from '../tokens';
import { fadeIn, slideUp, slideLeft, slideRight } from '../utils/interpolate';
import { MockupBrowser } from '../animations';

export const ExampleSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);
  const titleOpacity = fadeIn(frame, 8, 15);
  const titleY = slideUp(frame, 8, 18);
  const descOpacity = fadeIn(frame, 18, 15);
  const descY = slideUp(frame, 18, 18);

  const rightOpacity = fadeIn(frame, 12, 18);
  const rightX = slideRight(frame, 12, 22);

  const leftX = slideLeft(frame, 4, 22);
  const leftOpacity = fadeIn(frame, 4, 18);

  // 7-5 split: left ~58.3%, right ~41.7% of content area (1728px)
  const leftWidth = Math.round(grid.contentWidth * (7 / 12));
  const rightWidth = Math.round(grid.contentWidth * (5 / 12)) - sp.lg;

  return (
    <div style={slideBase(theme)}>
      <div style={{ ...safeArea(), flexDirection: 'row', gap: sp['2xl'] }}>
        {/* Left: label + title + description */}
        <div
          style={{
            width: leftWidth,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: leftOpacity,
            transform: `translateX(${leftX}px)`,
          }}
        >
          <div
            style={{
              ...typo.t4,
              color: theme.accent2,
              opacity: labelOpacity,
              marginBottom: sp.md,
              letterSpacing: '0.22em',
            }}
          >
            {content.label ?? 'EXAMPLE'}
          </div>
          <div
            style={{
              ...typo.t1,
              color: theme.text,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              marginBottom: sp.lg,
            }}
          >
            {content.title}
          </div>
          {content.description && (
            <div
              style={{
                ...typo.t3,
                color: theme.muted,
                opacity: descOpacity,
                transform: `translateY(${descY}px)`,
                maxWidth: 640,
              }}
            >
              {content.description}
            </div>
          )}
        </div>

        {/* Right: code or placeholder visual */}
        <div
          style={{
            width: rightWidth,
            display: 'flex',
            alignItems: 'center',
            opacity: rightOpacity,
            transform: `translateX(${rightX}px)`,
          }}
        >
          {content.mockup?.enabled ? (
            <MockupBrowser
              url={content.mockup.url}
              warning={content.mockup.warning}
              highlight={content.mockup.highlight}
              width={rightWidth}
              height={480}
            >
              {content.code ? (
                <pre
                  style={{
                    ...typo.mono,
                    color: theme.text,
                    padding: sp.lg,
                    margin: 0,
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                  }}
                >
                  {content.code}
                </pre>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: sp.md,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: radius.lg,
                      border: `2px dashed ${theme.muted}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: theme.muted, borderRadius: radius.sm, opacity: 0.4 }} />
                  </div>
                  <span style={{ ...typo.t5, color: theme.muted }}>{content.placeholder ?? 'Visual'}</span>
                </div>
              )}
            </MockupBrowser>
          ) : (
            <div
              style={{
                ...glassCard(theme),
                width: '100%',
                flex: 1,
                minHeight: 480,
                borderRadius: radius.lg,
                boxShadow: `0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px ${theme.accent2}22`,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {content.code ? (
                <>
                  {/* Code window chrome */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sp.xs,
                      padding: `${sp.sm}px ${sp.md}px`,
                      borderBottom: `1px solid rgba(255,255,255,0.06)`,
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                      <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                  <pre
                    style={{
                      ...typo.mono,
                      color: theme.text,
                      padding: sp.lg,
                      margin: 0,
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.6,
                    }}
                  >
                    {content.code}
                  </pre>
                </>
              ) : (
                /* Placeholder visual area */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: 480,
                    flexDirection: 'column',
                    gap: sp.md,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: radius.lg,
                      border: `2px dashed ${theme.muted}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: theme.muted, borderRadius: radius.sm, opacity: 0.4 }} />
                  </div>
                  <span style={{ ...typo.t5, color: theme.muted }}>{content.placeholder ?? 'Visual'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
