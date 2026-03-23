import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, sp, radius } from '../tokens';
import { fadeIn, slideUp, popIn } from '../utils/interpolate';

interface HighlightArea {
  x: number;     // % from left
  y: number;     // % from top
  width: number;  // % width
  height: number; // % height
  color?: 'danger' | 'success';
}

interface MockupBrowserProps {
  url?: string;
  children: React.ReactNode;
  highlight?: HighlightArea;
  warning?: string;
  entrance?: 'slideUp' | 'fadeIn' | 'popIn';
  startFrame?: number;
  width?: number;
  height?: number;
}

export const MockupBrowser: React.FC<MockupBrowserProps> = ({
  url = 'example.com',
  children,
  highlight,
  warning,
  entrance = 'slideUp',
  startFrame = 0,
  width = 640,
  height = 480,
}) => {
  const frame = useCurrentFrame();

  // Entrance animation
  let mainOpacity = 1;
  let mainTransform = '';
  switch (entrance) {
    case 'slideUp':
      mainOpacity = fadeIn(frame, startFrame, 18);
      mainTransform = `translateY(${slideUp(frame, startFrame, 18)}px)`;
      break;
    case 'fadeIn':
      mainOpacity = fadeIn(frame, startFrame, 20);
      break;
    case 'popIn':
      mainOpacity = fadeIn(frame, startFrame, 10);
      mainTransform = `scale(${popIn(frame, startFrame)})`;
      break;
  }

  // Warning popup
  const warningOpacity = warning ? fadeIn(frame, startFrame + 30, 12) : 0;
  const warningScale = warning ? popIn(frame, startFrame + 30) : 0;

  // Highlight overlay
  const highlightOpacity = highlight ? fadeIn(frame, startFrame + 20, 15) : 0;

  const headerHeight = 40;
  const dotColors = ['#666', '#666', '#666'];

  return (
    <div
      style={{
        width,
        opacity: mainOpacity,
        transform: mainTransform,
        borderRadius: radius.lg,
        overflow: 'hidden',
        background: VISUAL_THEME.bgSecondary,
        border: `1px solid ${VISUAL_THEME.bgTertiary}`,
        boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
      }}
    >
      {/* Browser header */}
      <div
        style={{
          height: headerHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: `0 ${sp.sm}px`,
          background: VISUAL_THEME.bgTertiary,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {/* 3 dots */}
        {dotColors.map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 24,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            marginLeft: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              color: VISUAL_THEME.textMuted,
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ position: 'relative', height: height - headerHeight, overflow: 'hidden' }}>
        {children}

        {/* Highlight overlay */}
        {highlight && (
          <div
            style={{
              position: 'absolute',
              left: `${highlight.x}%`,
              top: `${highlight.y}%`,
              width: `${highlight.width}%`,
              height: `${highlight.height}%`,
              border: `2px solid ${highlight.color === 'success' ? VISUAL_THEME.success : VISUAL_THEME.danger}`,
              borderRadius: 8,
              background: `${highlight.color === 'success' ? VISUAL_THEME.success : VISUAL_THEME.danger}11`,
              opacity: highlightOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Warning popup */}
        {warning && (
          <div
            style={{
              position: 'absolute',
              bottom: sp.md,
              left: '50%',
              transform: `translateX(-50%) scale(${warningScale})`,
              opacity: warningOpacity,
              background: VISUAL_THEME.danger,
              color: VISUAL_THEME.textPrimary,
              padding: `${sp.xs}px ${sp.md}px`,
              borderRadius: radius.sm,
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: `0 4px 16px ${VISUAL_THEME.danger}44`,
            }}
          >
            {warning}
          </div>
        )}
      </div>
    </div>
  );
};
