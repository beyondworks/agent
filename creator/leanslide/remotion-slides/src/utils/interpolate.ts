/**
 * useCurrentFrame 기반 애니메이션 헬퍼
 * GSAP → Remotion 변환 규칙:
 *   0.5s = 15 frames, 0.6s = 18 frames, 0.13s stagger = 4 frames
 *   power3.out = Easing.out(Easing.cubic)
 *   back.out(1.7) = Easing.out(Easing.back(1.7))
 */
import { interpolate, Easing } from 'remotion';

/** 페이드인 (0→1) */
export function fadeIn(frame: number, start: number, duration = 15): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

/** 아래→위 슬라이드 (px→0) */
export function slideUp(frame: number, start: number, duration = 18, distance = 40): number {
  return interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

/** stagger 인덱스별 등장 */
export function staggerIn(
  frame: number,
  index: number,
  start: number,
  stagger = 5,
): { opacity: number; translateY: number } {
  const s = start + index * stagger;
  return {
    opacity: fadeIn(frame, s),
    translateY: slideUp(frame, s),
  };
}

/** SVG 선 그리기 (stroke-dashoffset) */
export function drawLine(frame: number, start: number, duration = 20): number {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

/** 팝 등장 (0→1 with overshoot) */
export function popIn(frame: number, start: number, duration = 12): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.7)),
  });
}

/** 왼쪽에서 슬라이드 */
export function slideLeft(frame: number, start: number, duration = 18, distance = 60): number {
  return interpolate(frame, [start, start + duration], [-distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

/** 오른쪽에서 슬라이드 */
export function slideRight(frame: number, start: number, duration = 18, distance = 60): number {
  return interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}
