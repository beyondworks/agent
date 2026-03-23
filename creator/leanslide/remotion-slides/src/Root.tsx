import React from 'react';
import { Composition } from 'remotion';
import { SlideVideo } from './SlideVideo';
import type { SlidesJson } from './types';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SlideVideo"
        component={SlideVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={FPS * 60 * 15}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          meta: { title: 'Untitled' },
          slides: [],
        } as Record<string, unknown>}
        calculateMetadata={async ({ props }) => {
          const { slides } = props as unknown as SlidesJson;
          if (!slides?.length) return { durationInFrames: FPS };

          const lastSlide = slides[slides.length - 1]!;
          const totalMs = lastSlide.timing.endMs;
          const totalFrames = Math.round((totalMs / 1000) * FPS);

          return {
            durationInFrames: Math.max(totalFrames, FPS),
          };
        }}
      />
    </>
  );
};
