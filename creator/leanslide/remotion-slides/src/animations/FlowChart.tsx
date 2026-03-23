import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { VISUAL_THEME, ANIMATION_PRESETS, sp, radius } from '../tokens';
import { fadeIn, popIn, drawLine } from '../utils/interpolate';

interface FlowChartNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number; // 0~100 (%)
  y: number; // 0~100 (%)
  color?: 'accent' | 'purple' | 'neutral';
}

interface FlowChartEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

interface FlowChartProps {
  nodes: FlowChartNode[];
  edges: FlowChartEdge[];
  width?: number;
  height?: number;
  accentColor?: string;
  lightFlow?: boolean;
}

export const FlowChart: React.FC<FlowChartProps> = ({
  nodes,
  edges,
  width = 600,
  height = 480,
  accentColor = VISUAL_THEME.accent,
  lightFlow = true,
}) => {
  const frame = useCurrentFrame();

  const colorMap: Record<string, string> = {
    accent: accentColor,
    purple: '#a855f7',
    neutral: VISUAL_THEME.textSecondary,
  };

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Each node appears with stagger: 10 frames apart
  const nodeDelay = 10;
  // Edges start drawing after all nodes appear
  const edgeStart = nodes.length * nodeDelay;
  const edgeDrawDuration = ANIMATION_PRESETS.drawLine.duration;
  // Light flow starts after all edges drawn
  const lightFlowStart = edgeStart + edges.length * 12;

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* SVG for edges */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width={width}
        height={height}
      >
        {edges.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const x1 = (fromNode.x / 100) * width;
          const y1 = (fromNode.y / 100) * height;
          const x2 = (toNode.x / 100) * width;
          const y2 = (toNode.y / 100) * height;

          const eStart = edgeStart + i * 12;
          const progress = drawLine(frame, eStart, edgeDrawDuration);
          const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

          // Light flow dot position
          const lightProgress = lightFlow
            ? interpolate(
                frame,
                [lightFlowStart, lightFlowStart + ANIMATION_PRESETS.lightFlow.duration],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) }
              )
            : 0;

          const dotX = x1 + (x2 - x1) * lightProgress;
          const dotY = y1 + (y2 - y1) * lightProgress;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`${accentColor}44`}
                strokeWidth={2}
                strokeDasharray={pathLength}
                strokeDashoffset={progress * pathLength}
              />
              {/* Edge label */}
              {edge.label && progress < 0.5 && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 10}
                  fill={VISUAL_THEME.textSecondary}
                  fontSize={14}
                  textAnchor="middle"
                  opacity={fadeIn(frame, eStart + edgeDrawDuration, 10)}
                >
                  {edge.label}
                </text>
              )}
              {/* Light flow dot */}
              {lightFlow && frame >= lightFlowStart && (
                <circle
                  cx={dotX}
                  cy={dotY}
                  r={4}
                  fill={accentColor}
                  opacity={0.9}
                >
                  <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const nStart = i * nodeDelay;
        const scale = popIn(frame, nStart);
        const opacity = fadeIn(frame, nStart);
        const nodeColor = colorMap[node.color ?? 'accent'] ?? accentColor;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* Node circle */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: VISUAL_THEME.bgSecondary,
                border: `2px solid ${nodeColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${nodeColor}33`,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: nodeColor,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  maxWidth: 44,
                  overflow: 'hidden',
                }}
              >
                {node.label.length > 4 ? node.label.slice(0, 3) : node.label}
              </span>
            </div>
            {/* Label below */}
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: VISUAL_THEME.textPrimary,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </span>
            {node.sublabel && (
              <span
                style={{
                  fontSize: 12,
                  color: VISUAL_THEME.textSecondary,
                  textAlign: 'center',
                }}
              >
                {node.sublabel}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
