import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneData } from './types';

interface SceneProps {
  scene: SceneData;
  subtitle?: string;
  subtitleFontSize: number;
}

/**
 * 긴 나레이션을 짧은 자막 세그먼트로 분할
 */
function splitSubtitle(text: string, maxChars = 28): string[] {
  if (!text) return [];
  const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const segments: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxChars) { segments.push(sentence); continue; }
    const clauses = sentence.split(/(?<=[,;])\s*/).map(s => s.trim()).filter(Boolean);
    let buffer = '';
    for (const clause of clauses) {
      if (buffer && (buffer + ' ' + clause).length > maxChars) {
        segments.push(buffer); buffer = clause;
      } else {
        buffer = buffer ? buffer + ' ' + clause : clause;
      }
    }
    if (buffer.length > maxChars) {
      const words = buffer.split(/\s+/);
      let line = '';
      for (const word of words) {
        if (line && (line + ' ' + word).length > maxChars) { segments.push(line); line = word; }
        else { line = line ? line + ' ' + word : word; }
      }
      if (line) segments.push(line);
    } else if (buffer) { segments.push(buffer); }
  }
  return segments.length > 0 ? segments : [text.slice(0, maxChars)];
}

/**
 * 나레이션에서 강조 키워드 추출 (숫자, 따옴표, 짧은 핵심어)
 */
function extractKeywords(narration: string): string[] {
  const keywords: string[] = [];
  // 숫자+단위 패턴 (89만원, 24시간, 2만원 등)
  const numPatterns = narration.match(/\d+[\d,.]*\s*[만천백억]?\s*[원시간분초개개월년%]+/g);
  if (numPatterns) keywords.push(...numPatterns.slice(0, 2));
  // 따옴표 안 텍스트
  const quoted = narration.match(/['"「」『』]([^'"「」『』]{2,12})['"「」『』]/g);
  if (quoted) keywords.push(...quoted.slice(0, 1).map(q => q.replace(/['"「」『』]/g, '')));
  // 강조 패턴 (XX은/는 XX다)
  if (keywords.length === 0) {
    const words = narration.split(/\s+/).filter(w => w.length >= 4 && w.length <= 10);
    if (words.length > 0) keywords.push(words[0]);
  }
  return keywords.slice(0, 2);
}

export function Scene({ scene, subtitle, subtitleFontSize }: SceneProps) {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // --- 1. 이미지 진입 애니메이션 (시간차) ---

  // 블러 → 선명 (0~0.5초)
  const blurClear = interpolate(frame, [0, fps * 0.5], [8, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // 스케일: 살짝 큰 상태에서 줄어들며 등장 + 느린 줌
  const entryScale = interpolate(frame, [0, fps * 0.6], [1.15, 1.05], {
    extrapolateRight: 'clamp',
  });
  const slowZoom = interpolate(frame, [fps * 0.6, durationInFrames], [1.05, 1.12], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const imageScale = frame < fps * 0.6 ? entryScale : slowZoom;

  // 패닝 (씬 번호 기반 방향 결정)
  const panDirection = scene.sceneNumber % 3 === 0 ? 1 : scene.sceneNumber % 3 === 1 ? -1 : 0;
  const panX = interpolate(frame, [0, durationInFrames], [0, panDirection * 20], {
    extrapolateRight: 'clamp',
  });

  // 슬라이드 진입 (씬 번호에 따라 방향 교차)
  const slideFrom = scene.sceneNumber % 2 === 0 ? 30 : -30;
  const slideX = interpolate(frame, [0, fps * 0.4], [slideFrom, 0], {
    extrapolateRight: 'clamp',
  });

  // --- 2. 페이드 인/아웃 ---
  const fadeIn = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // --- 3. 키워드 오버레이 (0.8초 후 등장, 2초 유지) ---
  const keywords = extractKeywords(subtitle ?? '');
  const kwStart = Math.round(fps * 0.8);
  const kwDuration = Math.round(fps * 2.5);

  // --- 4. 자막 (오디오 길이 기준 분배) ---
  const segments = splitSubtitle(subtitle ?? '');
  const totalSegments = segments.length;
  const audioDurationFrames = scene.audioDurationSec
    ? Math.round(scene.audioDurationSec * fps) : durationInFrames;
  const subtitleDuration = Math.min(audioDurationFrames, durationInFrames);
  const framesPerSegment = totalSegments > 0
    ? Math.floor(subtitleDuration / totalSegments) : durationInFrames;
  const currentSegmentIndex = frame < subtitleDuration
    ? Math.min(Math.floor(frame / framesPerSegment), totalSegments - 1) : -1;
  const currentSubtitle = currentSegmentIndex >= 0 ? (segments[currentSegmentIndex] ?? '') : '';

  // 자막 페이드
  const segmentStart = currentSegmentIndex >= 0 ? currentSegmentIndex * framesPerSegment : 0;
  const subtitleOpacity = currentSegmentIndex >= 0
    ? interpolate(frame, [segmentStart, segmentStart + Math.min(fps * 0.12, framesPerSegment * 0.08)], [0, 1], {
        extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
      })
    : 0;

  // --- 5. 오버레이 효과: 그라디언트 스윕 ---
  const gradientPos = interpolate(frame, [0, durationInFrames], [-100, 200], {
    extrapolateRight: 'clamp',
  });

  // --- 6. 비네트 펄스 ---
  const vignetteIntensity = interpolate(
    frame,
    [0, durationInFrames * 0.3, durationInFrames * 0.7, durationInFrames],
    [0.6, 0.3, 0.3, 0.6],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#000' }}>
      {/* 씬별 오디오 */}
      {scene.audioDataUrl && (
        <Audio src={scene.audioDataUrl} volume={1} />
      )}

      {/* 배경 이미지 + 진입 애니메이션 */}
      <AbsoluteFill>
        {scene.imageUrl ? (
          <Img
            src={scene.imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${imageScale}) translateX(${panX + slideX}px)`,
              filter: `blur(${blurClear}px)`,
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#111' }} />
        )}
      </AbsoluteFill>

      {/* 비네트 오버레이 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 그라디언트 스윕 (미묘한 빛 효과) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${105 + scene.sceneNumber * 15}deg, transparent ${gradientPos - 20}%, rgba(255,255,255,0.04) ${gradientPos}%, transparent ${gradientPos + 20}%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 키워드 오버레이 (시간차 등장) */}
      {keywords.map((kw, i) => {
        const kwOffset = kwStart + i * Math.round(fps * 0.6);
        const kwSpring = spring({ frame: frame - kwOffset, fps, config: { damping: 12, stiffness: 100 } });
        const kwFadeOut = interpolate(
          frame,
          [kwOffset + kwDuration, kwOffset + kwDuration + Math.round(fps * 0.3)],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const kwVisible = frame >= kwOffset && frame < kwOffset + kwDuration + Math.round(fps * 0.3);
        if (!kwVisible) return null;

        const kwScale = interpolate(kwSpring, [0, 1], [0.5, 1]);
        const kwOpacity = Math.min(kwSpring, kwFadeOut);

        // 위치: 키워드별 교차 배치
        const positions = [
          { top: '15%', left: '50%', transform: `translate(-50%, 0) scale(${kwScale})` },
          { top: '22%', left: '50%', transform: `translate(-50%, 0) scale(${kwScale})` },
        ];
        const pos = positions[i % positions.length];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              opacity: kwOpacity,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'Pretendard, sans-serif',
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                letterSpacing: '-0.02em',
              }}
            >
              {kw}
            </span>
          </div>
        );
      })}

      {/* 자막 — 1줄씩 순차 표시 */}
      {currentSubtitle && (
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 60,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              borderRadius: 8,
              paddingLeft: 28,
              paddingRight: 28,
              paddingTop: 10,
              paddingBottom: 10,
              maxWidth: '85%',
              opacity: subtitleOpacity,
              transform: `translateY(${interpolate(subtitleOpacity, [0, 1], [8, 0])}px)`,
            }}
          >
            <p
              style={{
                color: '#ffffff',
                fontSize: subtitleFontSize,
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.4,
                margin: 0,
                fontFamily: 'Pretendard, sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              {currentSubtitle}
            </p>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
