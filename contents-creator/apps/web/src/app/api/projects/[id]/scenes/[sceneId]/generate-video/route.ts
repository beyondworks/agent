export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { generateVideoFromImage } from '@/lib/ai/veo';

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

async function getOwnedProject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  userId: string
) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  if (error || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
  if (project.user_id !== userId) throw ApiError.forbidden();
  return project;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sceneId: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId, sceneId } = await params;
    await getOwnedProject(supabase, projectId, user.id);

    // 씬 조회
    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('*, scene_media(*)')
      .eq('id', sceneId)
      .single();

    if (sceneError || !scene || scene.project_id !== projectId) {
      throw ApiError.notFound('씬을 찾을 수 없습니다.');
    }

    // 선택된 이미지 찾기 (is_selected 우선, 없으면 첫 번째 이미지)
    const sceneMediaList = (scene.scene_media ?? []) as Array<{
      id: string;
      media_type: string;
      url: string;
      is_selected: boolean;
      prompt_used?: string;
    }>;

    const selectedMedia =
      sceneMediaList.find((m) => m.is_selected && m.media_type === 'image') ??
      sceneMediaList.find((m) => m.media_type === 'image');

    if (!selectedMedia) {
      throw ApiError.badRequest('영상으로 변환할 이미지가 없습니다. 먼저 이미지를 생성해주세요.');
    }

    // 이미지 다운로드 → base64 변환
    const imageRes = await fetch(selectedMedia.url);
    if (!imageRes.ok) {
      throw new Error(`이미지 다운로드 실패: ${imageRes.status}`);
    }
    const imageBuffer = await imageRes.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const contentType = imageRes.headers.get('content-type') ?? 'image/png';
    const mimeType = contentType.split(';')[0].trim() as 'image/png' | 'image/jpeg' | 'image/webp';

    // 씬 프롬프트 (이미지 생성 시 사용된 프롬프트 재활용, 없으면 visual_desc 사용)
    const prompt =
      selectedMedia.prompt_used ??
      scene.visual_desc ??
      scene.narration ??
      'cinematic video clip';

    const durationSec = Math.min(Math.max(Number(scene.duration_sec), 3), 8);

    // Veo 3.1 I2V 생성
    const result = await generateVideoFromImage(
      imageBase64,
      mimeType,
      prompt,
      durationSec,
      '9:16'
    );

    // Vercel Blob 업로드
    const videoBuffer = Buffer.from(result.videoBase64, 'base64');
    const timestamp = Date.now();
    const blobPath = `scenes/${projectId}/${sceneId}/video-i2v-${timestamp}.mp4`;

    const blob = await put(blobPath, videoBuffer, {
      access: 'public',
      contentType: result.mimeType,
    });

    // scene_media 레코드 추가
    const { data: newMedia, error: mediaError } = await supabase
      .from('scene_media')
      .insert({
        scene_id: sceneId,
        media_type: 'video',
        storage_path: blobPath,
        url: blob.url,
        prompt_used: prompt,
        duration_sec: result.durationSec,
        is_selected: false,
      })
      .select()
      .single();

    if (mediaError) throw new Error(mediaError.message);

    // 씬의 media_type을 'video'로 업데이트하고 새 영상을 선택
    await supabase
      .from('scene_media')
      .update({ is_selected: false })
      .eq('scene_id', sceneId);

    await supabase
      .from('scene_media')
      .update({ is_selected: true })
      .eq('id', newMedia.id);

    const { data: updatedScene, error: updateError } = await supabase
      .from('scenes')
      .update({
        media_type: 'video',
        selected_media_id: newMedia.id,
      })
      .eq('id', sceneId)
      .select('*, scene_media(*)')
      .single();

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ data: updatedScene }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
