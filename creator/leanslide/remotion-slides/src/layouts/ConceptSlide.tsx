import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid, radius, glassCard } from '../tokens';
import { fadeIn, slideUp, staggerIn, popIn } from '../utils/interpolate';
import { FlowChart } from '../animations';

interface ConceptSlideContent {
  label?: string;
  title: string;
  description: string;
  /** Optional: rendered inside the right panel area */
  radarScanNode?: React.ReactNode;
  /** When diagram.type === 'flow' and nodes+edges are provided, renders FlowChart */
  diagram?: { type: 'orbit' | 'flow' | 'tree'; lightFlow?: boolean };
  nodes?: Array<{ id: string; label: string; sublabel?: string; x: number; y: number; color?: 'accent' | 'purple' | 'neutral' }>;
  edges?: Array<{ from: string; to: string; label?: string; animated?: boolean }>;
}

export const ConceptSlide: React.FC<{ content: ConceptSlideContent; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const labelAnim = staggerIn(frame, 0, 0, 6);
  const titleAnim = staggerIn(frame, 1, 0, 6);
  const descAnim = staggerIn(frame, 2, 0, 6);
  const rightOpacity = fadeIn(frame, 15, 20);

  const LEFT_WIDTH = grid.span(7);
  const RIGHT_WIDTH = grid.span(5);

  return (
    <div style={slideBase(theme)}>
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '45%',
          background: `radial-gradient(ellipse 80% 80% at 80% 50%, ${theme.accent}11 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ ...safeArea(), flexDirection: 'row', gap: sp['2xl'] }}>
        {/* Left: 7-col */}
        <div
          style={{
            width: LEFT_WIDTH,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Label */}
          <div
            style={{
              opacity: labelAnim.opacity,
              transform: `translateY(${labelAnim.translateY}px)`,
              marginBottom: sp.lg,
            }}
          >
            <span style={{ ...typo.t4, color: theme.accent }}>
              {content.label ?? 'CONCEPT'}
            </span>
            <div
              style={{
                width: 32,
                height: 2,
                background: theme.accent,
                marginTop: sp.xs,
              }}
            />
          </div>

          {/* Title */}
          <h1
            style={{
              ...typo.t1,
              color: theme.text,
              margin: 0,
              marginBottom: sp.lg,
              opacity: titleAnim.opacity,
              transform: `translateY(${titleAnim.translateY}px)`,
            }}
          >
            {content.title}
          </h1>

          {/* Description */}
          <p
            style={{
              ...typo.t3,
              color: theme.muted,
              margin: 0,
              maxWidth: grid.span(6),
              opacity: descAnim.opacity,
              transform: `translateY(${descAnim.translateY}px)`,
            }}
          >
            {content.description}
          </p>
        </div>

        {/* Right: 5-col — FlowChart, RadarScan placeholder or injected node */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: rightOpacity,
          }}
        >
          {content.diagram?.type === 'flow' && content.nodes && content.edges ? (
            <FlowChart
              nodes={content.nodes}
              edges={content.edges}
              width={RIGHT_WIDTH}
              height={480}
              accentColor={theme.accent}
              lightFlow={content.diagram.lightFlow ?? true}
            />
          ) : content.radarScanNode ?? (
            <div
              style={{
                width: RIGHT_WIDTH,
                aspectRatio: '1 / 1',
                maxHeight: 480,
                border: `1.5px solid ${theme.accent}44`,
                borderRadius: radius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ ...typo.t4, color: `${theme.accent}66` }}>RADAR SCAN</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
