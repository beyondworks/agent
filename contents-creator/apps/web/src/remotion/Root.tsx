import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { DemoVideo } from './DemoVideo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Comp = VideoComposition as any;

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="VideoForge"
        component={Comp}
        durationInFrames={30 * 60}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [],
          subtitleSettings: { fontSize: 42, color: '#ffffff', position: 'bottom' as const },
          fps: 30,
          width: 1920,
          height: 1080,
        }}
      />

      <Composition
        id="VideoForge-Short"
        component={Comp}
        durationInFrames={30 * 60}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [],
          subtitleSettings: { fontSize: 42, color: '#ffffff', position: 'bottom' as const },
          fps: 30,
          width: 1080,
          height: 1920,
        }}
      />

      <Composition
        id="ComponentDemo"
        component={DemoVideo as any}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [],
          fps: 30,
        }}
      />
    </>
  );
}
