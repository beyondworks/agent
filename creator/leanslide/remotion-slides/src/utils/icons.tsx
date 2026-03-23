/**
 * lucide 스타일 SVG 아이콘 (이모지 금지)
 * CLAUDE.md: 아이콘은 명사가 아닌 동사로 고른다
 * stroke 기반, currentColor 사용
 */
import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const base = (size: number, color: string, sw: number): React.SVGAttributes<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Icons = {
  zap: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  star: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  alertTriangle: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  check: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  checkCircle: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  arrowRight: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
  layers: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ),
  gitBranch: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
  ),
  rocket: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
  ),
  shield: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  trendingUp: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  ),
  search: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  eye: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  play: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polygon points="5 3 19 12 5 21 5 3" /></svg>
  ),
  code: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  terminal: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
  ),
  split: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 7l5 5-5 5" /><path d="M7 7l-5 5 5 5" /></svg>
  ),
  barChart: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
  ),
  refreshCw: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
  ),
  link: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
  ),
  save: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
  ),
  hash: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
  ),
  quote: ({ size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) => (
    <svg {...base(size, color, strokeWidth)}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" /></svg>
  ),
} as const;

export type IconName = keyof typeof Icons;
