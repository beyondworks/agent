import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { Scene01Hook } from './scenes/Scene01Hook';
import { Scene02Voice } from './scenes/Scene02Voice';
import { Scene03Channels } from './scenes/Scene03Channels';
import { Scene04Context } from './scenes/Scene04Context';
import { Scene05Summary } from './scenes/Scene05Summary';
import { Scene06Precision } from './scenes/Scene06Precision';
import { Scene07Market } from './scenes/Scene07Market';
import { Scene08Closing } from './scenes/Scene08Closing';
import { ProgressBar } from './components';
import { fs } from './theme';

const FPS = 30;
const CROSSFADE = 0; // 누적 드리프트 방지 — 절대 변경 금지

// Voicebox 실측 + 블록 내 300ms 패딩 + 블록 간 0.4s/씬 간 0.8s 갭 (voice/timing_v2.json)
const SCENES = [
  { Component: Scene01Hook,      durationInFrames: 850 },   // 28.3초
  { Component: Scene02Voice,     durationInFrames: 2173 },  // 72.4초
  { Component: Scene03Channels,  durationInFrames: 1742 },  // 58.1초
  { Component: Scene04Context,   durationInFrames: 1807 },  // 60.2초
  { Component: Scene05Summary,   durationInFrames: 684 },   // 22.8초
  { Component: Scene06Precision, durationInFrames: 2373 },  // 79.1초
  { Component: Scene07Market,    durationInFrames: 1030 },  // 34.3초
  { Component: Scene08Closing,   durationInFrames: 955 },   // 31.8초 (엔딩 3초 여유 포함)
];

export const FULL_TOTAL = SCENES.reduce((s, sc) => s + sc.durationInFrames, 0)
  - CROSSFADE * (SCENES.length - 1);

export const ClaudeMarchFullVideo: React.FC = () => {
  const frame = useCurrentFrame();
  let offset = 0;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: fs.bg, opacity: fadeIn }}>
      {SCENES.map((scene, i) => {
        const from = offset;
        offset += scene.durationInFrames - (i < SCENES.length - 1 ? CROSSFADE : 0);
        const { Component } = scene;

        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={scene.durationInFrames}
            name={`Scene${String(i + 1).padStart(2, '0')}`}
          >
            <Component />
          </Sequence>
        );
      })}

      <Audio src={staticFile('claude-march/narration_v2.wav')} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
