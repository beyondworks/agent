/**
 * SceneBase — 모든 씬의 공통 래퍼
 *
 * 제공 기능:
 * - 배경색 (fs.bg)
 * - Grain 텍스처 오버레이
 * - Scene-out fade (마지막 30프레임)
 * - 공통 easing export
 *
 * 사용법:
 * <SceneBase duration={850}>
 *   {(frame) => <YourContent frame={frame} />}
 * </SceneBase>
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from './theme';

/** 시그니처 easing — 모든 전환에 사용 */
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** clamp 기본값 */
export const CLAMP = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

/** fade-in 헬퍼 */
export const fadeIn = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing: ease });

/** slideUpFade 값 헬퍼 */
export const slideUp = (frame: number, start: number, distance = 40, duration = 25) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing: ease }),
  y: interpolate(frame, [start, start + duration], [distance, 0], { ...CLAMP, easing: ease }),
});

/** Grain 텍스처 오버레이 (씬 ID로 filter 충돌 방지) */
const GrainOverlay: React.FC<{ id: string }> = ({ id }) => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.03,
      pointerEvents: 'none',
      zIndex: 100,
    }}
  >
    <filter id={`grain-${id}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
  </svg>
);

interface SceneBaseProps {
  /** 씬 총 프레임 수 */
  duration: number;
  /** 씬 고유 ID (Grain filter 충돌 방지) */
  id?: string;
  /** fade-out 시작 전 프레임 수 (기본 30) */
  fadeOutFrames?: number;
  /** 배경색 오버라이드 */
  background?: string;
  /** children: render prop으로 현재 frame 전달 */
  children: (frame: number) => React.ReactNode;
}

export const SceneBase: React.FC<SceneBaseProps> = ({
  duration,
  id = 'scene',
  fadeOutFrames = 30,
  background = fs.bg,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeStart = duration - fadeOutFrames;

  const sceneOpacity = interpolate(frame, [fadeStart, duration], [1, 0], {
    ...CLAMP,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        opacity: sceneOpacity,
      }}
    >
      {children(frame)}
      <GrainOverlay id={id} />
    </AbsoluteFill>
  );
};

export default SceneBase;
