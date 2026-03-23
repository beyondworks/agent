/**
 * Nano Banana Core Formula (Google Gemini Image Generation):
 * [Subject + descriptive adj], [action/pose/state], [location/context]. [Composition/camera]. [Lighting]. [Style/medium].
 *
 * Prompts must be written as full descriptive sentences — never tag soup.
 * The prompt itself carries all quality signal; no booster keywords are appended.
 */
const NEGATIVE_PROMPT = 'text, words, letters, watermark, signature, deformed hands, extra fingers';

export interface GenerateImageResult {
  imageBase64: string;
  mimeType: string;
}

export async function generateSceneImage(
  prompt: string,
  aspectRatio: '16:9' | '9:16' | '1:1' = '16:9',
  negativePrompt?: string,
  seed?: number
): Promise<GenerateImageResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is required');

  const finalNegative = negativePrompt ? `${NEGATIVE_PROMPT}, ${negativePrompt}` : NEGATIVE_PROMPT;

  const requestBody: Record<string, unknown> = {
    contents: [{
      parts: [{
        text: `Generate an image with aspect ratio ${aspectRatio}: ${prompt}\n\nNEGATIVE PROMPT (do NOT include these): ${finalNegative}\n\nIMPORTANT: Do not render any Korean, Japanese, or Chinese characters in the image. Replace any non-Latin text with visual icons, symbols, or English text only.`,
      }],
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  if (seed !== undefined) {
    (requestBody.generationConfig as Record<string, unknown>).seed = seed;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Image API 에러 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidates = data.candidates ?? [];

  for (const candidate of candidates) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inlineData) {
        return {
          imageBase64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }
  }

  throw new Error('이미지 생성 실패: 응답에 이미지 데이터가 없습니다.');
}
