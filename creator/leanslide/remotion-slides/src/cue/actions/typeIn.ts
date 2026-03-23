import { useContext } from 'react';
import { interpolate } from 'remotion';
import { CueCtx } from '../CueContext';

/**
 * CLI 타이핑 효과: cue 시점부터 텍스트를 한 글자씩 표시.
 * @param target cue target 이름
 * @param fullText 전체 텍스트
 * @param durationFrames 타이핑 완료까지 프레임 수 (기본 60 = 2초 @30fps)
 * @returns 현재 표시할 텍스트 + 커서 깜빡임 여부
 */
export function useTypeIn(
  target: string,
  fullText: string,
  durationFrames = 60,
): { displayText: string; showCursor: boolean } {
  const { frame, cues } = useContext(CueCtx);
  const cue = cues.find((c) => c.target === target && c.action === 'typeIn');

  if (!cue) return { displayText: fullText, showCursor: false };

  const elapsed = frame - cue.frame;
  if (elapsed < 0) return { displayText: '', showCursor: false };

  const progress = interpolate(elapsed, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const charCount = Math.floor(progress * fullText.length);
  const displayText = fullText.slice(0, charCount);
  const showCursor = elapsed % 15 < 10; // 깜빡임: 10프레임 on, 5프레임 off

  return { displayText, showCursor };
}
