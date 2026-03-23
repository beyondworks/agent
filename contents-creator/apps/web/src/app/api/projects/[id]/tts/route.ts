export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { synthesizeWithVoiceId } from '@/lib/ai/tts';

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;

    // 프로젝트 소유권 확인
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');

    const body = await request.json();
    const voiceId: string = body.voiceId ?? 'ko-f-bright';
    const speed: number = typeof body.speed === 'number' ? body.speed : 1.0;
    const emotionId: string | undefined = body.emotionId;
    const pitch: number | undefined = typeof body.pitch === 'number' ? body.pitch : undefined;

    // 텍스트 수집: body.text 우선, 없으면 프로젝트 씬 나레이션 합치기
    let text: string = body.text ?? '';
    if (!text.trim()) {
      const { data: scenes } = await supabase
        .from('scenes')
        .select('narration')
        .eq('project_id', projectId)
        .order('scene_number', { ascending: true });
      text = (scenes ?? [])
        .map((s) => s.narration)
        .filter(Boolean)
        .join(' ');
    }

    if (!text.trim()) {
      throw ApiError.badRequest('합성할 텍스트가 없습니다. 씬 나레이션을 먼저 작성해주세요.');
    }

    // Edge TTS 합성
    let result: Awaited<ReturnType<typeof synthesizeWithVoiceId>>;
    try {
      result = await synthesizeWithVoiceId(text, voiceId, speed, { emotionId, pitch });
    } catch (ttsError) {
      const msg = ttsError instanceof Error ? ttsError.message : String(ttsError);
      if (msg.includes('403') || msg.includes('Unexpected server response')) {
        throw ApiError.badRequest('Edge TTS 서비스가 일시적으로 차단되었습니다. 잠시 후 다시 시도하거나, 다른 TTS 서비스로 전환이 필요합니다.');
      }
      throw ttsError;
    }

    // Supabase Storage 업로드 (media 버킷)
    const storagePath = `${projectId}/audio/preview-${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, result.audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`오디오 업로드 실패: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath);

    // audio_tracks 레코드 생성
    const { error: insertError } = await supabase
      .from('audio_tracks')
      .insert({
        project_id: projectId,
        storage_path: storagePath,
        url: urlData.publicUrl,
        duration_sec: result.durationSec,
        voice_settings: { voiceId, speed, emotionId, pitch },
        word_timestamps: result.wordTimestamps,
      });
    if (insertError) throw new Error(`audio_tracks 저장 실패: ${insertError.message}`);

    return NextResponse.json({
      data: {
        audioUrl: urlData.publicUrl,
        wordTimestamps: result.wordTimestamps,
        durationSec: result.durationSec,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
