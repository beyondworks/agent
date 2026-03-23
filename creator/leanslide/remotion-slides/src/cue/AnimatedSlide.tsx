import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { getLayout } from '../bridge/importMap';
import type { SlideData, Cue } from '../types';

interface AnimatedSlideProps {
  slide: SlideData;
}

/** cue를 프레임 기반 스타일로 변환 */
function computeCueStyle(
  frame: number,
  slideStartMs: number,
  fps: number,
  cue: Cue,
): React.CSSProperties {
  const cueFrame = Math.round(((cue.ms - slideStartMs) / 1000) * fps);
  const elapsed = frame - cueFrame;

  switch (cue.action) {
    case 'fadeIn': {
      const d = 15;
      const opacity = interpolate(elapsed, [0, d], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity };
    }
    case 'slideUp': {
      const d = 18;
      const opacity = interpolate(elapsed, [0, d], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const ty = interpolate(elapsed, [0, d], [30, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: `translateY(${ty}px)` };
    }
    case 'staggerReveal': {
      const d = 18;
      const opacity = interpolate(elapsed, [0, d], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const ty = interpolate(elapsed, [0, d], [20, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const scale = interpolate(elapsed, [0, d], [0.95, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: `translateY(${ty}px) scale(${scale})` };
    }
    case 'typeIn':
    case 'clickSim':
      return elapsed >= 0 ? { opacity: 1 } : { opacity: 0 };
    default:
      return { opacity: 1 };
  }
}

export const AnimatedSlide: React.FC<AnimatedSlideProps> = ({ slide }) => {
  const Layout = getLayout(slide.layout);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!Layout) {
    console.warn(`Unknown layout: ${slide.layout}`);
    return null;
  }

  const { startMs, cues } = slide.timing;

  // cue target별 스타일 맵 생성
  const styleMap: Record<string, React.CSSProperties> = {};
  for (const cue of cues) {
    styleMap[cue.target] = computeCueStyle(frame, startMs, fps, cue);
  }

  // 레이아웃별 style props 매핑
  const animProps: Record<string, any> = {};

  if (slide.layout === 'title') {
    animProps.badgeStyle = styleMap['badge'] ?? { opacity: 1 };
    animProps.headlineStyle = styleMap['headline'] ?? { opacity: 1 };
    animProps.subtitleStyle = styleMap['subtitle'] ?? { opacity: 1 };
    animProps.cliStyle = styleMap['cli'] ?? { opacity: 1 };
  }

  if (slide.layout === 'split-7-5' || slide.layout === 'split-5-7') {
    animProps.headlineStyle = styleMap['headline'] ?? { opacity: 1 };
    const items = slide.content.items ?? [];
    animProps.itemStyles = items.map((_: any, i: number) => {
      return styleMap[`item-${i}`] ?? { opacity: 1 };
    });
  }

  if (slide.layout === 'compare') {
    animProps.beforeTitleStyle = styleMap['beforeTitle'] ?? { opacity: 1 };
    animProps.afterTitleStyle = styleMap['afterTitle'] ?? { opacity: 1 };
    animProps.vsBadgeStyle = styleMap['vsBadge'] ?? { opacity: 1 };
    const beforeItems = slide.content.beforeItems ?? [];
    animProps.beforeItemStyles = beforeItems.map((_: any, i: number) => {
      return styleMap[`before-${i}`] ?? { opacity: 1 };
    });
    const afterItems = slide.content.afterItems ?? [];
    animProps.afterItemStyles = afterItems.map((_: any, i: number) => {
      return styleMap[`after-${i}`] ?? { opacity: 1 };
    });
  }

  if (slide.layout === 'list') {
    animProps.headlineStyle = styleMap['headline'] ?? { opacity: 1 };
    const items = slide.content.items ?? [];
    animProps.itemStyles = items.map((_: any, i: number) => {
      return styleMap[`item-${i}`] ?? { opacity: 1 };
    });
  }

  if (slide.layout === 'quote') {
    animProps.quoteStyle = styleMap['quote'] ?? { opacity: 1 };
    animProps.sourceStyle = styleMap['source'] ?? { opacity: 1 };
  }

  if (slide.layout === 'cta') {
    animProps.headlineStyle = styleMap['headline'] ?? { opacity: 1 };
    animProps.subtitleStyle = styleMap['subtitle'] ?? { opacity: 1 };
  }

  return <Layout {...slide.content} {...animProps} />;
};
