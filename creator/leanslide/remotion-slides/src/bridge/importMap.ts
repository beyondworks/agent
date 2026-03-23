import React from 'react';

// storybook-ds 레이아웃 컴포넌트 (props 기반)
import { TitleSlide } from '@ds/layouts/TitleSlide';
import { SplitSlide } from '@ds/layouts/SplitSlide';
import { CompareSlide } from '@ds/layouts/CompareSlide';
import { ListSlide } from '@ds/layouts/ListSlide';
import { QuoteSlide } from '@ds/layouts/QuoteSlide';
import { CodeSlide } from '@ds/layouts/CodeSlide';
import { CtaSlide } from '@ds/layouts/CtaSlide';

// storybook-ds 슬라이드 레이아웃 (children 기반)
import { BentoLayout } from '@ds/slides/layouts/BentoLayout';
import { CenterLayout } from '@ds/slides/layouts/CenterLayout';
import { FeatureCalloutLayout } from '@ds/slides/layouts/FeatureCalloutLayout';
import { StaggeredLayout } from '@ds/slides/layouts/StaggeredLayout';
import { ZigzagLayout } from '@ds/slides/layouts/ZigzagLayout';
import { SplitLayout } from '@ds/slides/layouts/SplitLayout';
import { SlideLayout } from '@ds/slides/layouts/SlideLayout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const layoutMap: Record<string, React.FC<any>> = {
  // 레이아웃 컴포넌트 (props 기반)
  'title': TitleSlide,
  'split-7-5': SplitSlide,
  'split-5-7': SplitSlide,
  'compare': CompareSlide,
  'list': ListSlide,
  'quote': QuoteSlide,
  'code': CodeSlide,
  'cta': CtaSlide,

  // 슬라이드 레이아웃 (children 기반)
  'bento-grid': BentoLayout,
  'center-stage': CenterLayout,
  'feature-callout': FeatureCalloutLayout,
  'staggered-rows': StaggeredLayout,
  'zigzag': ZigzagLayout,
  'split-layout': SplitLayout,
  'slide-layout': SlideLayout,
};

/** importMap에 등록된 레이아웃 목록 (md-to-slides에서 필터용) */
export const supportedLayouts = Object.keys(layoutMap);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLayout(name: string): React.FC<any> | null {
  return layoutMap[name] ?? null;
}
