import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';

interface AnalogySlideContent {
  label?: string;
  sourceIcon?: string;
  sourceConcept: string;
  sourceDescription?: string;
  targetIcon?: string;
  targetConcept: string;
  targetDescription?: string;
}

export const AnalogySlide: React.FC<{ content: AnalogySlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 12);

  // Left icon pop
  const leftIconScale = popIn(frame, 8, 14);
  const leftTextAnim = staggerIn(frame, 0, 20, 6);

  // Right icon pop (delayed)
  const rightIconScale = popIn(frame, 22, 14);
  const rightTextAnim = staggerIn(frame, 0, 35, 6);

  // Connector fade
  const connectorOpacity = fadeIn(frame, 28, 12);

  const CARD_WIDTH = grid.span(5);

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Label */}
        <div style={{ opacity: labelOpacity, marginBottom: sp.xl }}>
          <span style={{ ...typo.t4, color: theme.accent }}>
            {content.label ?? 'ANALOGY'}
          </span>
          <div style={{ width: 32, height: 2, background: theme.accent, marginTop: sp.xs }} />
        </div>

        {/* Two columns with connector */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Left concept */}
          <div
            style={{
              width: CARD_WIDTH,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: sp.lg,
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: `${theme.accent}22`,
                border: `2px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${leftIconScale})`,
                fontSize: 40,
              }}
            >
              <span>{content.sourceIcon ?? '🔧'}</span>
            </div>

            <div
              style={{
                textAlign: 'center',
                opacity: leftTextAnim.opacity,
                transform: `translateY(${leftTextAnim.translateY}px)`,
              }}
            >
              <div style={{ ...typo.t2, color: theme.text, marginBottom: sp.xs }}>
                {content.sourceConcept}
              </div>
              {content.sourceDescription && (
                <div style={{ ...typo.t3, color: theme.muted }}>{content.sourceDescription}</div>
              )}
            </div>
          </div>

          {/* Connector: dashed line + equals sign */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sp.md,
              opacity: connectorOpacity,
              paddingBottom: 40,
            }}
          >
            <div
              style={{
                height: 2,
                flex: 1,
                borderTop: `2px dashed ${theme.accent}44`,
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `${theme.accent2}22`,
                border: `1.5px solid ${theme.accent2}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ ...typo.t2, color: theme.accent2, lineHeight: 1 }}>=</span>
            </div>
            <div
              style={{
                height: 2,
                flex: 1,
                borderTop: `2px dashed ${theme.accent}44`,
              }}
            />
          </div>

          {/* Right concept */}
          <div
            style={{
              width: CARD_WIDTH,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: sp.lg,
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: `${theme.accent2}22`,
                border: `2px solid ${theme.accent2}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${rightIconScale})`,
                fontSize: 40,
              }}
            >
              <span>{content.targetIcon ?? '💡'}</span>
            </div>

            <div
              style={{
                textAlign: 'center',
                opacity: rightTextAnim.opacity,
                transform: `translateY(${rightTextAnim.translateY}px)`,
              }}
            >
              <div style={{ ...typo.t2, color: theme.text, marginBottom: sp.xs }}>
                {content.targetConcept}
              </div>
              {content.targetDescription && (
                <div style={{ ...typo.t3, color: theme.muted }}>{content.targetDescription}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
