import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

interface RadarNode {
  label: string;
  color: string;
  /** 0~360 각도 (스캔라인이 지나가면 등장) */
  angle: number;
}

interface RadarScanProps {
  nodes: RadarNode[];
  theme: { accent: string; bg: string; text: string; textDim: string };
  /** 스캔 1회전 프레임 수 (기본 60) */
  scanDuration?: number;
  /** 레이더 반지름 px (기본 180) */
  radius?: number;
}

export const RadarScan: React.FC<RadarScanProps> = ({
  nodes,
  theme,
  scanDuration = 60,
  radius = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 0;
  const cy = 0;

  // 스캔라인 각도 (0→360)
  const scanAngle = interpolate(frame, [0, scanDuration], [0, 360], {
    extrapolateRight: 'clamp',
  });

  // 스캔라인 좌표
  const scanRad = (scanAngle * Math.PI) / 180;
  const lineX = cx + Math.cos(scanRad) * radius;
  const lineY = cy + Math.sin(scanRad) * radius;

  // 스캔 sweep 불투명도 (부채꼴 잔상)
  const sweepEndAngle = scanAngle;
  const sweepStartAngle = Math.max(0, sweepEndAngle - 40);

  return (
    <div
      style={{
        position: 'relative',
        width: radius * 2 + 80,
        height: radius * 2 + 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={radius * 2 + 80}
        height={radius * 2 + 80}
        viewBox={`${-radius - 40} ${-radius - 40} ${radius * 2 + 80} ${radius * 2 + 80}`}
      >
        {/* 동심원 가이드 */}
        {[0.33, 0.66, 1].map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius * r}
            fill="none"
            stroke={theme.textDim}
            strokeWidth={0.5}
            opacity={0.3}
          />
        ))}

        {/* 십자선 */}
        <line x1={-radius} y1={0} x2={radius} y2={0} stroke={theme.textDim} strokeWidth={0.5} opacity={0.2} />
        <line x1={0} y1={-radius} x2={0} y2={radius} stroke={theme.textDim} strokeWidth={0.5} opacity={0.2} />

        {/* 스캔 sweep 잔상 (부채꼴) */}
        <defs>
          <radialGradient id="radar-glow">
            <stop offset="0%" stopColor={theme.accent} stopOpacity={0.15} />
            <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
          </radialGradient>
        </defs>
        {sweepEndAngle > 0 && (
          <path
            d={describeArc(cx, cy, radius, sweepStartAngle, sweepEndAngle)}
            fill="url(#radar-glow)"
          />
        )}

        {/* 스캔라인 */}
        <line
          x1={cx}
          y1={cy}
          x2={lineX}
          y2={lineY}
          stroke={theme.accent}
          strokeWidth={2}
          opacity={0.9}
        />

        {/* 스캔라인 끝점 glow */}
        <circle cx={lineX} cy={lineY} r={4} fill={theme.accent} opacity={0.6} />

        {/* 노드 포인트 */}
        {nodes.map((node, i) => {
          const nodeRad = (node.angle * Math.PI) / 180;
          const dist = radius * 0.55 + (i % 3) * radius * 0.15;
          const nx = cx + Math.cos(nodeRad) * dist;
          const ny = cy + Math.sin(nodeRad) * dist;

          // 스캔라인이 지나간 후에 등장
          const appeared = scanAngle >= node.angle;
          const fadeIn = appeared
            ? interpolate(
                frame,
                [
                  (node.angle / 360) * scanDuration,
                  (node.angle / 360) * scanDuration + fps * 0.3,
                ],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              )
            : 0;

          const scale = appeared
            ? interpolate(
                frame,
                [
                  (node.angle / 360) * scanDuration,
                  (node.angle / 360) * scanDuration + fps * 0.25,
                ],
                [0.3, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.back(1.4)),
                },
              )
            : 0;

          return (
            <g key={i} opacity={fadeIn} transform={`translate(${nx}, ${ny}) scale(${scale})`}>
              {/* 노드 glow */}
              <circle r={16} fill={node.color} opacity={0.15} />
              {/* 노드 점 */}
              <circle r={6} fill={node.color} />
              <circle r={3} fill={theme.bg} />
              {/* 라벨 */}
              <text
                y={24}
                textAnchor="middle"
                fill={theme.text}
                fontSize={11}
                fontFamily="'Inter', sans-serif"
                fontWeight={500}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/** SVG 부채꼴 경로 생성 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + Math.cos(startRad) * r;
  const y1 = cy + Math.sin(startRad) * r;
  const x2 = cx + Math.cos(endRad) * r;
  const y2 = cy + Math.sin(endRad) * r;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
