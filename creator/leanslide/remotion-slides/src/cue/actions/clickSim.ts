import { useContext } from 'react';
import { interpolate, spring } from 'remotion';
import { CueCtx } from '../CueContext';

export interface ClickSimState {
  cursorProgress: number;
  rippleScale: number;
  resultOpacity: number;
  phase: 'idle' | 'moving' | 'clicking' | 'result';
}

/**
 * 클릭 시뮬레이션: 커서 이동 → 클릭 ripple → 결과 등장
 */
export function useClickSim(target: string): ClickSimState {
  const { frame, fps, cues } = useContext(CueCtx);
  const cue = cues.find((c) => c.target === target && c.action === 'clickSim');

  const idle: ClickSimState = {
    cursorProgress: 0,
    rippleScale: 0,
    resultOpacity: 0,
    phase: 'idle',
  };

  if (!cue)
    return { cursorProgress: 1, rippleScale: 0, resultOpacity: 1, phase: 'result' };

  const elapsed = frame - cue.frame;
  if (elapsed < 0) return idle;

  const moveEnd = 20;
  const clickEnd = 30;
  const resultEnd = 45;

  if (elapsed < moveEnd) {
    return {
      cursorProgress: interpolate(elapsed, [0, moveEnd], [0, 1], {
        extrapolateRight: 'clamp',
      }),
      rippleScale: 0,
      resultOpacity: 0,
      phase: 'moving',
    };
  }

  if (elapsed < clickEnd) {
    const ripple = spring({
      frame: elapsed - moveEnd,
      fps,
      durationInFrames: 10,
    });
    return {
      cursorProgress: 1,
      rippleScale: ripple,
      resultOpacity: 0,
      phase: 'clicking',
    };
  }

  return {
    cursorProgress: 1,
    rippleScale: 0,
    resultOpacity: interpolate(elapsed, [clickEnd, resultEnd], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    phase: 'result',
  };
}
