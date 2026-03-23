// Algorithm 4 기반 단어 그룹핑 → SubtitleEvent 변환

import type { WordTimestamp } from '@/lib/ai/tts';

export interface SubtitleEvent {
  start: number;
  end: number;
  text: string;
}

// 자연스러운 끊김점 — 문장 부호 뒤
const SENTENCE_BREAK_PATTERN = /[.!?,。！？，、…]+$/;

function isSentenceBreak(word: string): boolean {
  return SENTENCE_BREAK_PATTERN.test(word.trim());
}

/**
 * 단어 타임스탬프 목록을 자막 이벤트로 그룹핑합니다.
 *
 * @param wordTimestamps - TTS에서 반환된 단어별 타임스탬프
 * @param maxWordsPerGroup - 그룹당 최대 단어 수 (기본값: 4)
 */
export function groupWords(
  wordTimestamps: WordTimestamp[],
  maxWordsPerGroup = 4
): SubtitleEvent[] {
  const events: SubtitleEvent[] = [];
  let buffer: WordTimestamp[] = [];

  for (const wt of wordTimestamps) {
    buffer.push(wt);

    const shouldFlush = buffer.length >= maxWordsPerGroup || isSentenceBreak(wt.word);

    if (shouldFlush) {
      events.push(buildEvent(buffer));
      buffer = [];
    }
  }

  // 버퍼에 남은 단어 처리
  if (buffer.length > 0) {
    events.push(buildEvent(buffer));
  }

  return events;
}

function buildEvent(buffer: WordTimestamp[]): SubtitleEvent {
  return {
    start: buffer[0].start,
    end: buffer[buffer.length - 1].end,
    text: buffer.map((w) => w.word).join(' '),
  };
}
