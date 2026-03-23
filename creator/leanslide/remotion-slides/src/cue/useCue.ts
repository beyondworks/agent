import { useContext } from 'react';
import { interpolate } from 'remotion';
import { CueCtx } from './CueContext';
import type { CueFrame } from './CueContext';

interface AnimationStyle {
  opacity: number;
  transform: string;
}

const DEFAULT_VISIBLE: AnimationStyle = { opacity: 1, transform: 'none' };

/**
 * target에 대한 현재 프레임의 애니메이션 스타일을 반환.
 * cue가 없으면 즉시 표시 (opacity: 1).
 */
export function useCue(target: string): AnimationStyle {
  const { frame, cues } = useContext(CueCtx);

  const cue = cues.find((c) => c.target === target);
  if (!cue) return DEFAULT_VISIBLE;

  return computeStyle(frame, cue);
}

function computeStyle(frame: number, cue: CueFrame): AnimationStyle {
  const elapsed = frame - cue.frame;

  switch (cue.action) {
    case 'fadeIn': {
      const duration = 15;
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: 'none' };
    }

    case 'slideUp': {
      const duration = 18;
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const translateY = interpolate(elapsed, [0, duration], [30, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return { opacity, transform: `translateY(${translateY}px)` };
    }

    case 'staggerReveal': {
      const duration = 18;
      const opacity = interpolate(elapsed, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const translateY = interpolate(elapsed, [0, duration], [20, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const scale = interpolate(elapsed, [0, duration], [0.95, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return {
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      };
    }

    case 'typeIn':
    case 'clickSim':
      // 전용 컴포넌트에서 처리 — useCue는 visibility만 제어
      return frame >= cue.frame
        ? DEFAULT_VISIBLE
        : { opacity: 0, transform: 'none' };

    default:
      return DEFAULT_VISIBLE;
  }
}
