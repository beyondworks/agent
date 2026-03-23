import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, typo, sp, grid } from '../tokens';
import { fadeIn, slideUp, popIn, drawLine } from '../utils/interpolate';

interface DiagramNode {
  id: string;
  label: string;
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

interface DiagramEdge {
  from: string;
  to: string;
}

export const DiagramSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleY = slideUp(frame, 0, 18);

  const nodes: DiagramNode[] = content.nodes ?? [];
  const edges: DiagramEdge[] = content.edges ?? [];

  // Diagram canvas area (below title)
  const titleH = 130;
  const canvasW = grid.contentWidth;
  const canvasH = grid.height - 96 * 2 - titleH;

  const nodeR = 48; // node circle radius

  // Map node id → canvas px position
  const nodePos: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n) => {
    nodePos[n.id] = {
      x: n.x * canvasW,
      y: n.y * canvasH,
    };
  });

  // Nodes pop in sequentially, then edges draw
  const nodeStartFrame = 12;
  const nodesEndFrame = nodeStartFrame + nodes.length * 6 + 12;

  return (
    <div style={slideBase(theme)}>
      <div style={safeArea()}>
        {/* Title */}
        <div
          style={{
            ...typo.t1,
            color: theme.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: sp.xl,
          }}
        >
          {content.title}
        </div>

        {/* Diagram canvas */}
        <div
          style={{
            position: 'relative',
            width: canvasW,
            height: canvasH,
            flex: 1,
          }}
        >
          {/* SVG edges */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            width={canvasW}
            height={canvasH}
          >
            {edges.map((edge, i) => {
              const from = nodePos[edge.from];
              const to = nodePos[edge.to];
              if (!from || !to) return null;

              const lineLen = Math.hypot(to.x - from.x, to.y - from.y);
              const dashProg = drawLine(frame, nodesEndFrame + i * 5, 20);

              // direction vector for arrowhead
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const ux = dx / dist;
              const uy = dy / dist;

              // start/end offset by node radius
              const x1 = from.x + ux * nodeR;
              const y1 = from.y + uy * nodeR;
              const x2 = to.x - ux * (nodeR + 12);
              const y2 = to.y - uy * (nodeR + 12);

              // arrowhead points
              const perpX = -uy * 8;
              const perpY = ux * 8;
              const arrowOpacity = fadeIn(frame, nodesEndFrame + i * 5 + 18, 8);

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={`${theme.muted}88`}
                    strokeWidth={2}
                    strokeDasharray={lineLen}
                    strokeDashoffset={dashProg * lineLen}
                  />
                  <polygon
                    points={`${x2 + ux * 12},${y2 + uy * 12} ${x2 + perpX},${y2 + perpY} ${x2 - perpX},${y2 - perpY}`}
                    fill={theme.muted}
                    opacity={arrowOpacity * 0.7}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const pos = nodePos[node.id];
            const scale = popIn(frame, nodeStartFrame + i * 6, 12);
            const opacity = fadeIn(frame, nodeStartFrame + i * 6, 10);

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: pos.x - nodeR,
                  top: pos.y - nodeR,
                  width: nodeR * 2,
                  height: nodeR * 2,
                  borderRadius: '50%',
                  background: theme.surface,
                  border: `2px solid ${theme.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity,
                  transform: `scale(${scale})`,
                  boxShadow: `0 0 20px ${theme.accent}33`,
                }}
              >
                <span
                  style={{
                    ...typo.t5,
                    color: theme.text,
                    textAlign: 'center',
                    padding: `0 ${sp.xs}px`,
                    wordBreak: 'break-word',
                  }}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
