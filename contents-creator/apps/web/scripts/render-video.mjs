#!/usr/bin/env node
/**
 * Remotion 비디오 렌더 스크립트
 * 사용법: node scripts/render-video.mjs <propsJsonPath> <outputPath>
 *
 * 1단계: TTS 음성 합성 (Google Cloud TTS)
 * 2단계: Remotion 번들링 + 렌더링
 *
 * stdout으로 [PROGRESS] JSON 메시지를 출력하여 부모 프로세스가 진행률을 추적할 수 있음
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [,, propsPath, outputPath] = process.argv;

if (!propsPath || !outputPath) {
  console.error('Usage: node scripts/render-video.mjs <propsJsonPath> <outputPath>');
  process.exit(1);
}

if (!existsSync(propsPath)) {
  console.error(`Props file not found: ${propsPath}`);
  process.exit(1);
}

const props = JSON.parse(readFileSync(propsPath, 'utf-8'));
const compositionId = props.width > props.height ? 'VideoForge' : 'VideoForge-Short';

const totalDurationSec = props.scenes.reduce((sum, s) => sum + s.durationSec, 0);
const totalFrames = Math.round(totalDurationSec * props.fps);
const totalScenes = props.scenes.length;

/** stdout으로 구조화된 진행 메시지 출력 */
function emitProgress(message, progress) {
  console.log(`[PROGRESS] ${JSON.stringify({ message, progress })}`);
}

// --- TTS 합성 ---

async function synthesizeTTS(text, voiceConfig) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error('[TTS] GOOGLE_GENERATIVE_AI_API_KEY가 없습니다. TTS 건너뜀.');
    return null;
  }

  if (!text?.trim()) return null;

  // 로컬 백엔드 (클론 보이스)
  if (voiceConfig.backend === 'local') {
    try {
      const localUrl = process.env.TTS_SERVER_URL ?? 'http://127.0.0.1:8000';
      const res = await fetch(`${localUrl}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice_id: voiceConfig.localVoiceId,
          language: voiceConfig.languageCode?.split('-')[0] ?? 'ko',
          temperature: 0.5,
          top_p: 0.85,
          instruction: voiceConfig.instruction,
        }),
      });
      if (!res.ok) throw new Error(`Local TTS ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      return `data:audio/wav;base64,${buf.toString('base64')}`;
    } catch (err) {
      console.error(`[TTS] 로컬 TTS 실패, Google 폴백: ${err.message}`);
      // Google로 폴백
    }
  }

  // Google Cloud TTS
  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voiceConfig.languageCode || 'ko-KR',
            name: voiceConfig.googleName || 'ko-KR-Chirp3-HD-Aoede',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: voiceConfig.speed || 1.0,
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`[TTS] Google TTS 실패 (${res.status}): ${body.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    return `data:audio/mp3;base64,${data.audioContent}`;
  } catch (err) {
    console.error(`[TTS] 네트워크 오류: ${err.message}`);
    return null;
  }
}

// --- 씬별 프레임 범위 (어떤 씬이 렌더링 중인지 판별용) ---

const sceneRanges = [];
let frameOffset = 0;
for (const scene of props.scenes) {
  const sceneFrames = Math.round(scene.durationSec * props.fps);
  sceneRanges.push({
    sceneNumber: scene.sceneNumber,
    startFrame: frameOffset,
    endFrame: frameOffset + sceneFrames,
  });
  frameOffset += sceneFrames;
}

async function main() {
  // --- 1단계: TTS 음성 합성 ---
  const voiceConfig = props.voice ?? {
    googleName: 'ko-KR-Chirp3-HD-Aoede',
    languageCode: 'ko-KR',
    speed: 1.0,
    backend: 'google',
  };

  emitProgress('음성 합성 시작...', 1);

  let ttsCount = 0;
  for (let i = 0; i < props.scenes.length; i++) {
    const scene = props.scenes[i];
    if (!scene.narration?.trim()) continue;

    const pct = 1 + Math.round((i / props.scenes.length) * 7); // 1~8% 구간
    emitProgress(`음성 합성 중... (씬 ${scene.sceneNumber}/${totalScenes})`, pct);

    const audioDataUrl = await synthesizeTTS(scene.narration, voiceConfig);
    if (audioDataUrl) {
      scene.audioDataUrl = audioDataUrl;
      ttsCount++;

      // 오디오 길이 추정 (base64 크기 기반)
      // MP3 ~32kbps → raw bytes / 4000 = 초
      const commaIdx = audioDataUrl.indexOf(',');
      const b64Len = audioDataUrl.length - commaIdx - 1;
      const rawBytes = Math.round(b64Len * 0.75);
      const isWav = audioDataUrl.includes('audio/wav');
      const estimatedSec = isWav
        ? rawBytes / (22050 * 2) // WAV 22050Hz 16bit mono
        : rawBytes / 4000; // MP3 ~32kbps

      scene.audioDurationSec = estimatedSec;

      // 씬 길이를 오디오 길이에 맞춤 (오디오 + 1초 여유)
      if (estimatedSec + 1 > scene.durationSec) {
        console.error(`[TTS] 씬 ${scene.sceneNumber}: 오디오 ${estimatedSec.toFixed(1)}초 > 씬 ${scene.durationSec}초 → ${(estimatedSec + 1).toFixed(1)}초로 조정`);
        scene.durationSec = Math.round(estimatedSec + 1);
      }
    }
  }

  console.error(`[TTS] ${ttsCount}/${props.scenes.length}개 씬 합성 완료`);

  // TTS 후 씬 길이가 조정되었으므로 총 프레임 재계산
  const adjustedDurationSec = props.scenes.reduce((sum, s) => sum + s.durationSec, 0);
  const adjustedTotalFrames = Math.round(adjustedDurationSec * props.fps);

  // 씬별 프레임 범위 재계산
  sceneRanges.length = 0;
  let newOffset = 0;
  for (const scene of props.scenes) {
    const sceneFrames = Math.round(scene.durationSec * props.fps);
    sceneRanges.push({
      sceneNumber: scene.sceneNumber,
      startFrame: newOffset,
      endFrame: newOffset + sceneFrames,
    });
    newOffset += sceneFrames;
  }

  console.error(`[Render] 총 길이: ${adjustedDurationSec.toFixed(1)}초 (${adjustedTotalFrames} 프레임)`);

  // --- 2단계: Remotion 번들링 ---
  emitProgress('번들링 중...', 9);

  const entryPoint = path.resolve(__dirname, '../src/remotion/index.ts');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  emitProgress('컴포지션 준비 중...', 12);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: props,
  });

  composition.durationInFrames = adjustedTotalFrames;
  composition.fps = props.fps;

  // --- 3단계: 렌더링 ---
  emitProgress(`${totalScenes}개 씬 렌더링 시작...`, 14);

  let lastReportedScene = -1;

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    videoBitrate: '1500K',
    outputLocation: outputPath,
    inputProps: props,
    onProgress: ({ progress }) => {
      const currentFrame = Math.round(progress * adjustedTotalFrames);
      const renderProgress = 14 + Math.round(progress * 78); // 14~92% 구간

      const currentSceneInfo = sceneRanges.find(
        (r) => currentFrame >= r.startFrame && currentFrame < r.endFrame
      );
      const sceneNum = currentSceneInfo?.sceneNumber ?? lastReportedScene;

      if (sceneNum !== lastReportedScene) {
        lastReportedScene = sceneNum;
        emitProgress(`씬 ${sceneNum}/${totalScenes} 렌더링 중...`, renderProgress);
      } else {
        const pct = Math.round(progress * 100);
        if (pct % 5 === 0 && pct > 0) {
          emitProgress(`씬 ${sceneNum}/${totalScenes} 렌더링 중... (${pct}%)`, renderProgress);
        }
      }
    },
  });

  emitProgress('인코딩 완료, 업로드 준비 중...', 94);
  console.log(`[Render] 완료: ${outputPath}`);
}

main().catch((err) => {
  console.error('[Render] 실패:', err);
  process.exit(1);
});
