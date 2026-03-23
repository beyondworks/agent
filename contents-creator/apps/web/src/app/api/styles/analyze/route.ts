export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import {
  STYLE_ANALYSIS_SYSTEM_PROMPT,
  type StyleAnalysisResult,
} from '@/lib/ai/prompts/style-analysis';

async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`이미지 다운로드 실패: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = res.headers.get('content-type') ?? 'image/png';
  return { base64, mimeType };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const body = await request.json();
    const { image_url } = body as { image_url?: string };

    if (!image_url) {
      throw ApiError.badRequest('image_url이 필요합니다.');
    }

    // 서버에서 이미지를 직접 fetch → base64로 변환하여 Gemini에 전달
    // (Supabase Storage URL을 Gemini가 직접 접근하지 못하는 문제 해결)
    const { base64, mimeType } = await fetchImageAsBase64(image_url);

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: STYLE_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: Buffer.from(base64, 'base64'),
            },
            {
              type: 'text',
              text: '이 이미지의 시각적 스타일을 분석하고 JSON으로 결과를 반환해주세요.',
            },
          ],
        },
      ],
      maxOutputTokens: 4096,
    });

    const cleaned = text
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim();

    const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
    const result = JSON.parse(jsonMatch?.[1] ?? cleaned) as StyleAnalysisResult;

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('[styles/analyze] Error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { message: '스타일 분석 결과 파싱에 실패했습니다.', code: 'PARSE_ERROR' } },
        { status: 500 }
      );
    }
    return handleApiError(error);
  }
}
