import React, { createContext, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Cue } from '../types';

export interface CueFrame extends Cue {
  /** cue 시점을 슬라이드 내 상대 프레임으로 변환한 값 */
  frame: number;
}

interface CueContextValue {
  /** 슬라이드 내 현재 프레임 (0부터 시작) */
  frame: number;
  fps: number;
  cues: CueFrame[];
}

export const CueCtx = createContext<CueContextValue>({
  frame: 0,
  fps: 30,
  cues: [],
});

interface CueProviderProps {
  slideStartMs: number;
  cues: Cue[];
  children: React.ReactNode;
}

export const CueProvider: React.FC<CueProviderProps> = ({
  slideStartMs,
  cues,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueFrames = useMemo(
    () =>
      cues.map((cue) => ({
        ...cue,
        frame: Math.round(((cue.ms - slideStartMs) / 1000) * fps),
      })),
    [cues, slideStartMs, fps],
  );

  return (
    <CueCtx.Provider value={{ frame, fps, cues: cueFrames }}>
      {children}
    </CueCtx.Provider>
  );
};
