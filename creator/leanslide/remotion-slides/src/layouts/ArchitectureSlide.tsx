import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SlideTheme, slideBase, safeArea, glassCard, typo, sp, radius, grid } from '../tokens';
import { fadeIn, slideUp, staggerIn, drawLine } from '../utils/interpolate';

interface ServiceBox {
  label: string;
  description?: string;
}

export const ArchitectureSlide: React.FC<{ content: any; theme: SlideTheme }> = ({ content, theme }) => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 0, 15);
  const titleY = slideUp(frame, 0, 18);

  const heroOpacity = fadeIn(frame, 10, 18);
  const heroY = slideUp(frame, 10, 20);

  const services: ServiceBox[] = (content.services ?? content.components ?? []).slice(0, 3);
  const serviceCount = services.length;

  // Layout metrics
  const heroW = 640;
  const heroH = 120;
  const serviceW = Math.floor((grid.contentWidth - sp.lg * (serviceCount - 1)) / serviceCount);
  const serviceH = 140;

  // SVG connection area between hero and services
  const svgH = 120;
  const heroY_svg = 0;
  const serviceY_svg = svgH;

  // hero center x in content coordinates
  const heroCenterX = grid.contentWidth / 2;

  // service centers
  const serviceCenters = services.map((_, i) => {
    const totalW = serviceW * serviceCount + sp.lg * (serviceCount - 1);
    const startX = (grid.contentWidth - totalW) / 2;
    return startX + i * (serviceW + sp.lg) + serviceW / 2;
  });

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

        {/* Hero system box */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
            marginBottom: 0,
          }}
        >
          <div
            style={{
              width: heroW,
              height: heroH,
              ...glassCard(theme),
              border: `2px solid ${theme.accent}`,
              borderRadius: radius.lg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sp.xs,
              boxShadow: `0 0 40px ${theme.accent}33, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            <div style={{ ...typo.t4, color: theme.accent, letterSpacing: '0.18em' }}>
              {content.system?.label ?? 'SYSTEM'}
            </div>
            <div style={{ ...typo.t2, color: theme.text }}>
              {content.system?.title ?? content.main ?? ''}
            </div>
          </div>
        </div>

        {/* SVG connection lines */}
        <svg
          width={grid.contentWidth}
          height={svgH}
          style={{ display: 'block', flexShrink: 0 }}
        >
          {serviceCenters.map((cx, i) => {
            const lineLen = Math.hypot(cx - heroCenterX, svgH);
            const dashProg = drawLine(frame, 28 + i * 4, 20);
            return (
              <line
                key={i}
                x1={heroCenterX}
                y1={heroY_svg}
                x2={cx}
                y2={serviceY_svg}
                stroke={`${theme.muted}66`}
                strokeWidth={2}
                strokeDasharray={lineLen}
                strokeDashoffset={dashProg * lineLen}
              />
            );
          })}
        </svg>

        {/* Service boxes row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: sp.lg,
            justifyContent: 'center',
          }}
        >
          {services.map((svc, i) => {
            const { opacity, translateY } = staggerIn(frame, i, 40, 6);
            return (
              <div
                key={i}
                style={{
                  width: serviceW,
                  height: serviceH,
                  ...glassCard(theme),
                  border: `1px solid ${theme.accent2}44`,
                  borderRadius: radius.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: sp.sm,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  padding: sp.lg,
                }}
              >
                <div style={{ ...typo.t2, color: theme.text, textAlign: 'center' }}>{svc.label}</div>
                {svc.description && (
                  <div style={{ ...typo.t5, color: theme.muted, textAlign: 'center' }}>{svc.description}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
