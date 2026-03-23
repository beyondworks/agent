import { AbsoluteFill, Audio, Sequence } from 'remotion';
import { Scene } from './Scene';
import type { VideoProps } from './types';

export function VideoComposition({
  scenes,
  audioUrl,
  subtitleSettings,
  fps,
}: VideoProps) {
  // 씬별 프레임 수 계산
  const sceneFrames = scenes.map((s) => Math.round(s.durationSec * fps));
  const transitionFrames = Math.round(fps * 0.3); // 0.3초 전환

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* TTS 오디오 */}
      {audioUrl && (
        <Audio src={audioUrl} volume={1} />
      )}

      {/* 씬 시퀀스 */}
      {scenes.map((scene, i) => {
        const from = currentFrame;
        const duration = sceneFrames[i];

        // 다음 씬 시작은 전환 오버랩만큼 앞당김
        currentFrame += duration - (i < scenes.length - 1 ? transitionFrames : 0);

        return (
          <Sequence
            key={scene.sceneNumber}
            from={from}
            durationInFrames={duration}
            name={`씬 ${scene.sceneNumber}`}
          >
            <Scene
              scene={scene}
              subtitle={scene.narration}
              subtitleFontSize={subtitleSettings.fontSize}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
