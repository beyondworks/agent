#!/usr/bin/env node
/**
 * ComponentDemo 컴포지션 렌더링 (TTS 합성 포함)
 * 사용법: node scripts/render-demo.mjs [outputPath]
 *
 * 우선순위: 로컬 TTS 서버(http://127.0.0.1:8000) → Google TTS 폴백
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = process.argv[2] || '/tmp/component-demo-narrated.mp4';
const entryPoint = path.resolve(__dirname, '../src/remotion/index.ts');

// .env.local에서 Google API 키 로드 (폴백용)
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
} catch { /* .env.local 없으면 무시 */ }

// 씬 1-7 데이터 (DB에서 가져온 나레이션)
const scenes = [
  {
    sceneNumber: 1,
    narration: '89만 원짜리 최신형 맥미니, 당장 장바구니에서 빼십시오. AI로 자동화 시스템을 만들겠다며 비싼 장비부터 사는 건, 제 경험상 가장 확실하게 돈을 낭비하는 방법입니다.',
    durationSec: 8,
  },
  {
    sceneNumber: 2,
    narration: '저도 그렇게 삽질하다가 결국 넷플릭스 전용 머신으로 전락한 적이 있거든요. 우리가 코딩을 배우고 서버를 돌리려는 이유는 개발자가 되기 위해서가 아닙니다. 내 퇴근 시간을 앞당기 위해서죠.',
    durationSec: 10,
  },
  {
    sceneNumber: 3,
    narration: "지금은 코드를 한 줄도 몰라도 자연어로 지시하면 AI가 알아서 결과물을 만들어내는 '바이브 코딩'의 시대입니다.",
    durationSec: 6,
  },
  {
    sceneNumber: 4,
    narration: "대화형 AI가 내가 질문할 때만 답을 찾아주는 '도서관 사서'였다면, 지금 등장하는 에이전트 AI는 내 권한을 위임받아 알아서 움직이는 '행동 대장'입니다.",
    durationSec: 8,
  },
  {
    sceneNumber: 5,
    narration: '오늘은 비개발자인 기획자의 시선에서, 단돈 2만 원으로 나만의 24시간 AI 비서를 세팅하고 텔레그램으로 보고받는 완벽한 구조를 해부해 드립니다. 코드를 치는 실력이 아니라, 시스템의 순서를 짜는 설계가 왜 중요한지 보여드리겠습니다.',
    durationSec: 12,
  },
  {
    sceneNumber: 6,
    narration: '스타트업 PM, 이커머스 마케터, 혹은 1인 프리랜서 분들. 우리가 자동화를 포기하는 순간은 언제나 똑같습니다. 구글링해서 블로그를 열었는데, 검은 터미널 화면에 하얀 글씨가 가득할 때죠.',
    durationSec: 9,
  },
  {
    sceneNumber: 7,
    narration: "'도커를 설치하라'느니, '환경 변수를 설정하라'느니 하는 외계어를 보는 순간 조용히 창을 닫습니다. 우리는 기술의 작동 원리를 뼛속까지 알고 싶은 게 아닙니다. 우리가 진짜 원하는 건 딱 하나입니다.",
    durationSec: 10,
  },
];

// --- TTS 합성 ---

async function synthesizeLocalTTS(text) {
  if (!text?.trim()) return null;

  try {
    const res = await fetch('http://127.0.0.1:8000/api/tts/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice_id: 'bfdb8b63-3203-43f5-a16c-f6c9011d4556',
        language: 'ko',
        temperature: 0.3,
        top_p: 0.8,
        instruction: '자연스럽고 차분한 유튜브 나레이션 톤으로 말하세요. 문장 끝을 깔끔하게 마무리하고, 적절한 호흡을 유지하세요.',
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[TTS] 로컬 TTS 실패 (${res.status}): ${body.slice(0, 200)}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:audio/wav;base64,${base64}`;
  } catch (err) {
    console.error(`[TTS] 로컬 TTS 네트워크 오류: ${err.message}`);
    return null;
  }
}

async function synthesizeGoogleTTS(text) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error('[TTS] GOOGLE_GENERATIVE_AI_API_KEY 없음. Google TTS 건너뜀.');
    return null;
  }
  if (!text?.trim()) return null;

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'ko-KR',
            name: 'ko-KR-Chirp3-HD-Aoede',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
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
    console.error(`[TTS] Google TTS 네트워크 오류: ${err.message}`);
    return null;
  }
}

async function synthesizeTTS(text) {
  // 1순위: 로컬 TTS 서버 (김효율 보이스 클론)
  const localResult = await synthesizeLocalTTS(text);
  if (localResult) return { dataUrl: localResult, source: 'local' };

  // 2순위: Google TTS 폴백
  console.warn('[TTS] 로컬 TTS 실패 → Google TTS 폴백 시도...');
  const googleResult = await synthesizeGoogleTTS(text);
  if (googleResult) return { dataUrl: googleResult, source: 'google' };

  return null;
}

/** WAV 헤더를 파싱하여 정확한 오디오 길이를 계산 */
function parseAudioDuration(dataUrl) {
  const commaIdx = dataUrl.indexOf(',');
  const b64Data = dataUrl.slice(commaIdx + 1);

  if (dataUrl.startsWith('data:audio/wav')) {
    try {
      const buffer = Buffer.from(b64Data, 'base64');
      const sampleRate = buffer.readUInt32LE(24);
      const channels = buffer.readUInt16LE(22);
      const bitsPerSample = buffer.readUInt16LE(34);
      const bytesPerSample = (bitsPerSample / 8) * channels;

      // data 청크 찾기
      let offset = 12;
      while (offset < buffer.length - 8) {
        const chunkId = buffer.toString('ascii', offset, offset + 4);
        const chunkSize = buffer.readUInt32LE(offset + 4);
        if (chunkId === 'data') {
          return chunkSize / (sampleRate * bytesPerSample);
        }
        offset += 8 + chunkSize;
      }
      // data 청크 못 찾으면 전체에서 헤더(44바이트) 제외
      return (buffer.length - 44) / (sampleRate * bytesPerSample);
    } catch (err) {
      console.error(`[WAV] 헤더 파싱 실패: ${err.message}`);
    }
  }

  // MP3 폴백 추정
  const rawBytes = Math.round(b64Data.length * 0.75);
  return rawBytes / 4000;
}

async function main() {
  const fps = 30;

  // 1단계: TTS 합성
  console.log('[Demo] TTS 합성 시작...');
  let ttsCount = 0;
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    console.log(`[TTS] 씬 ${scene.sceneNumber}/${scenes.length}...`);

    const result = await synthesizeTTS(scene.narration);
    if (result) {
      scene.audioDataUrl = result.dataUrl;
      ttsCount++;

      const audioDuration = parseAudioDuration(result.dataUrl);
      scene.audioDurationSec = audioDuration;

      // 씬 길이 = 오디오 + 2초 여유 (끝음 끊김 방지)
      if (audioDuration + 2 > scene.durationSec) {
        console.log(`[TTS] 씬 ${scene.sceneNumber}: 오디오 ${audioDuration.toFixed(1)}초 > 씬 ${scene.durationSec}초 → ${(audioDuration + 2).toFixed(1)}초로 조정 [${result.source}]`);
        scene.durationSec = Math.round(audioDuration + 2);
      } else {
        console.log(`[TTS] 씬 ${scene.sceneNumber}: ${estimatedSec.toFixed(1)}초 [${result.source}]`);
      }
    }
  }
  console.log(`[TTS] ${ttsCount}/${scenes.length}개 완료`);

  // 총 프레임 계산
  const totalDurationSec = scenes.reduce((sum, s) => sum + s.durationSec, 0);
  const totalFrames = Math.round(totalDurationSec * fps);
  console.log(`[Demo] 총 길이: ${totalDurationSec.toFixed(1)}초 (${totalFrames}프레임)`);

  // 2단계: 번들링
  console.log('[Demo] 번들링 시작...');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  // 3단계: 컴포지션 로드
  console.log('[Demo] 컴포지션 로드...');
  const props = { scenes, fps };
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'ComponentDemo',
    inputProps: props,
  });

  composition.durationInFrames = totalFrames;
  composition.fps = fps;

  // 4단계: 렌더링
  console.log(`[Demo] 렌더링 시작 (${totalFrames}프레임)...`);
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    videoBitrate: '3000K',
    outputLocation: outputPath,
    inputProps: props,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        process.stdout.write(`\r[Demo] 렌더링 ${pct}%`);
      }
    },
  });

  console.log(`\n[Demo] 완료: ${outputPath}`);
}

main().catch((err) => {
  console.error('[Demo] 실패:', err);
  process.exit(1);
});
