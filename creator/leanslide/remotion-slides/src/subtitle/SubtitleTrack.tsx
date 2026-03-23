import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SubtitleSentence } from '../types';

interface SubtitleTrackProps {
  sentences: SubtitleSentence[];
}

const MAX_CHARS = 25;

/** 25자 초과 문장을 자연스러운 끊김으로 분할 */
function splitSentence(sentence: SubtitleSentence): SubtitleSentence[] {
  const { text, startMs, endMs } = sentence;
  if (text.length <= MAX_CHARS) return [sentence];

  const words = text.split(' ');
  const chunks: SubtitleSentence[] = [];
  let current = '';
  const totalDuration = endMs - startMs;
  const msPerChar = totalDuration / text.length;

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS && current) {
      const chunkStart =
        startMs + Math.round((text.indexOf(current) / text.length) * totalDuration);
      const chunkEnd = chunkStart + Math.round(current.length * msPerChar);
      chunks.push({ text: current, startMs: chunkStart, endMs: chunkEnd });
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    const chunkStart =
      chunks.length > 0 ? chunks[chunks.length - 1]!.endMs : startMs;
    chunks.push({ text: current, startMs: chunkStart, endMs });
  }

  return chunks;
}

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({ sentences }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const chunks = sentences.flatMap(splitSentence);

  const active = chunks.find(
    (c) => currentMs >= c.startMs && currentMs <= c.endMs,
  );

  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.75)',
          borderRadius: 8,
          padding: '8px 24px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: "'Pretendard Variable', 'Noto Sans KR', sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1.4,
          }}
        >
          {active.text}
        </span>
      </div>
    </div>
  );
};
