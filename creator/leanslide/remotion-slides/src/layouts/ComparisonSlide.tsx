import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, popIn, slideLeft, slideRight } from '../utils/interpolate';
import { ComparePanel } from '../animations';

interface ComparisonOption {
  title: string;
  features: string[];
}

interface ComparisonSlideProps {
  theme: SlideTheme;
  label?: string;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  useComparePanel?: boolean;
  leftColor?: 'good' | 'bad';
  rightColor?: 'good' | 'bad';
}

export const ComparisonSlide: React.FC<ComparisonSlideProps> = ({
  theme,
  label = 'COMPARISON',
  optionA,
  optionB,
  useComparePanel,
  leftColor = 'good',
  rightColor = 'bad',
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = fadeIn(frame, 0, 15);
  const leftX = slideLeft(frame, 8, 20, 80);
  const rightX = slideRight(frame, 8, 20, 80);
  const leftOpacity = fadeIn(frame, 8, 20);
  const rightOpacity = fadeIn(frame, 8, 20);
  const vsScale = popIn(frame, 18, 14);
  const vsOpacity = fadeIn(frame, 18, 12);

  const colWidth = (grid.contentWidth - sp.xl * 2 - 80) / 2;

  if (useComparePanel) {
    const leftFeatureList = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
        {optionA.features.map((f, i) => (
          <div key={i} style={{ ...typo.t3, color: '#f1f5f9' }}>{f}</div>
        ))}
      </div>
    );
    const rightFeatureList = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm }}>
        {optionB.features.map((f, i) => (
          <div key={i} style={{ ...typo.t3, color: '#f1f5f9' }}>{f}</div>
        ))}
      </div>
    );
    return (
      <div style={slideBase(theme)}>
        <div style={safeArea()}>
          <div style={{ ...typo.t4, color: theme.accent, opacity: labelOpacity, marginBottom: sp.lg }}>
            {label}
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ComparePanel
              left={{ label: optionA.title, content: leftFeatureList, color: leftColor }}
              right={{ label: optionB.title, content: rightFeatureList, color: rightColor }}
              width={grid.contentWidth}
              height={700}
            />
          </div>
        </div>
      </div>
    );
  }

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

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
          }}
        >
          {/* Option A */}
          <div
            style={{
              flex: 1,
              opacity: leftOpacity,
              transform: `translateX(${leftX}px)`,
            }}
          >
            <div
              style={{
                ...glassCard(theme),
                borderTop: `3px solid ${theme.accent}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: sp.md,
                padding: sp.xl,
                minHeight: 640,
              }}
            >
              <div
                style={{
                  ...typo.t4,
                  color: theme.accent,
                  marginBottom: sp.xs,
                }}
              >
                OPTION A
              </div>
              <div style={{ ...typo.t2, color: theme.text }}>{optionA.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginTop: sp.sm }}>
                {optionA.features.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: sp.sm,
                    }}
                  >
                    <span
                      style={{
                        color: theme.accent,
                        fontSize: 14,
                        fontWeight: 700,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>
                    <span style={{ ...typo.t3, color: theme.muted }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VS badge */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${vsScale})`,
              opacity: vsOpacity,
              zIndex: 10,
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: theme.accent2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.02em',
              boxShadow: `0 0 40px ${theme.accent2}66`,
            }}
          >
            VS
          </div>

          {/* Gap for VS badge */}
          <div style={{ width: sp.xl * 2 + 72 }} />

          {/* Option B */}
          <div
            style={{
              flex: 1,
              opacity: rightOpacity,
              transform: `translateX(${rightX}px)`,
            }}
          >
            <div
              style={{
                ...glassCard(theme),
                borderTop: `3px solid ${theme.accent2}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: sp.md,
                padding: sp.xl,
                minHeight: 640,
              }}
            >
              <div
                style={{
                  ...typo.t4,
                  color: theme.accent2,
                  marginBottom: sp.xs,
                }}
              >
                OPTION B
              </div>
              <div style={{ ...typo.t2, color: theme.text }}>{optionB.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: sp.sm, marginTop: sp.sm }}>
                {optionB.features.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: sp.sm,
                    }}
                  >
                    <span
                      style={{
                        color: theme.accent2,
                        fontSize: 14,
                        fontWeight: 700,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>
                    <span style={{ ...typo.t3, color: theme.muted }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
