/**
 * Veo 3.1 Video Generation API
 * - Image-to-Video: 이미지 첫 프레임 → 3-5초 영상
 * - Text-to-Video: 프롬프트 → 영상
 * 비동기 (predictLongRunning) → 폴링 수신
 */

const VEO_MODEL = 'veo-3.1-fast-generate-preview';

export interface VideoGenerationResult {
  videoBase64: string;
  mimeType: string;
  durationSec: number;
}

/**
 * Image-to-Video: 이미지를 첫 프레임으로 사용하여 모션 추가
 */
export async function generateVideoFromImage(
  imageBase64: string,
  imageMimeType: string,
  prompt: string,
  durationSec: number = 5,
  aspectRatio: '16:9' | '9:16' = '9:16'
): Promise<VideoGenerationResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is required');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${VEO_MODEL}:predictLongRunning?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{
          prompt,
          image: { bytesBase64Encoded: imageBase64, mimeType: imageMimeType },
        }],
        parameters: {
          aspectRatio,
          durationSeconds: durationSec,
          personGeneration: 'allow_adult',
          sampleCount: 1,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Veo API 에러 (${response.status}): ${err}`);
  }

  const operation = await response.json();
  if (!operation.name) throw new Error('Veo: operation name 없음');

  return pollForResult(apiKey, operation.name);
}

/**
 * Text-to-Video: 프롬프트만으로 영상 생성
 */
export async function generateVideoFromText(
  prompt: string,
  durationSec: number = 5,
  aspectRatio: '16:9' | '9:16' = '9:16'
): Promise<VideoGenerationResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is required');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${VEO_MODEL}:predictLongRunning?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          aspectRatio,
          durationSeconds: durationSec,
          personGeneration: 'allow_adult',
          sampleCount: 1,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Veo API 에러 (${response.status}): ${err}`);
  }

  const operation = await response.json();
  return pollForResult(apiKey, operation.name);
}

async function pollForResult(
  apiKey: string,
  operationName: string,
  maxAttempts: number = 60,
  intervalMs: number = 5000
): Promise<VideoGenerationResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, intervalMs));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${apiKey}`
    );
    if (!res.ok) continue;

    const status = await res.json();

    if (status.done) {
      if (status.error) throw new Error(`Veo 실패: ${status.error.message}`);

      const predictions = status.response?.predictions ?? [];
      if (predictions.length === 0) throw new Error('Veo: 생성된 영상 없음');

      return {
        videoBase64: predictions[0].bytesBase64Encoded,
        mimeType: predictions[0].mimeType || 'video/mp4',
        durationSec: 5,
      };
    }

    console.log(`[Veo] 폴링 ${i + 1}/${maxAttempts}...`);
  }

  throw new Error('Veo: 타임아웃 (5분 초과)');
}
