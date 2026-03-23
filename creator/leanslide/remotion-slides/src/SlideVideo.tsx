import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { AnimatedSlide } from './cue/AnimatedSlide';
import { SubtitleTrack } from './subtitle/SubtitleTrack';
import type { SlidesJson } from './types';

const FPS = 30;

/** ms → 프레임 변환 */
const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);

export const SlideVideo: React.FC<SlidesJson> = ({ meta, slides, subtitles }) => {
  return (
    <>
      {/* 나레이션 오디오 */}
      {meta.narrationFile && (
        <Audio src={staticFile(meta.narrationFile)} />
      )}

      {slides.map((slide) => {
        const from = msToFrame(slide.timing.startMs);
        const durationInFrames = msToFrame(
          slide.timing.endMs - slide.timing.startMs,
        );

        return (
          <Sequence key={slide.id} from={from} durationInFrames={durationInFrames}>
            <AnimatedSlide slide={slide} />
          </Sequence>
        );
      })}

      {/* 자막 — 전체 영상 위에 오버레이 */}
      {subtitles?.sentences && subtitles.sentences.length > 0 && (
        <Sequence from={0} durationInFrames={Infinity}>
          <SubtitleTrack sentences={subtitles.sentences} />
        </Sequence>
      )}
    </>
  );
};
