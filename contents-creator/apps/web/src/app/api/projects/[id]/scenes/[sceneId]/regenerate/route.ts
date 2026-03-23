export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { generateScenePrompts } from '@/lib/ai/style-chain';
import { generateSceneImage } from '@/lib/ai/gemini';
import { generateVideoFromText } from "@/lib/ai/veo";;

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

async function getOwnedProject(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string, userId: string) {
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sceneId: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId, sceneId } = await params;
    const project = await getOwnedProject(supabase, projectId, user.id);

    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', sceneId)
      .single();

    if (sceneError || !scene || scene.project_id !== projectId) {
      throw ApiError.notFound('씬을 찾을 수 없습니다.');
    }

    const body = await request.json() as { mediaType: 'image' | 'video' };
    const { mediaType } = body;
    if (!mediaType || !['image', 'video'].includes(mediaType)) {
      throw ApiError.badRequest('mediaType은 image 또는 video여야 합니다.');
    }

    // 스타일 로드
    const { data: projectStyle } = await supabase
      .from('project_styles')
      .select('final_prompt_prefix, final_prompt_suffix, final_negative_prompt')
      .eq('project_id', projectId)
      .maybeSingle();

    const style = {
      final_prompt_prefix: projectStyle?.final_prompt_prefix ?? '',
      final_prompt_suffix: projectStyle?.final_prompt_suffix ?? '',
      final_negative_prompt: projectStyle?.final_negative_prompt ?? '',
    };

    // 씬 프롬프트 생성
    const [scenePrompt] = await generateScenePrompts(
      [
        {
          scene_number: scene.scene_number,
          narration: scene.narration,
          visual_desc: scene.visual_desc,
          duration_sec: Number(scene.duration_sec),
        },
      ],
      style,
      project.content_type
    );

    if (!scenePrompt) throw new Error('프롬프트 생성에 실패했습니다.');

    let newMedia;

    if (mediaType === 'image') {
      const result = await generateSceneImage(
        scenePrompt.prompt,
        scenePrompt.aspect_ratio
      );

      const buffer = Buffer.from(result.imageBase64, 'base64');
      const timestamp = Date.now();
      const blob = await put(
        `scenes/${projectId}/${sceneId}/image-regen-${timestamp}.png`,
        buffer,
        { access: 'public', contentType: 'image/png' }
      );

      const { data: media, error: mediaError } = await supabase
        .from('scene_media')
        .insert({
          scene_id: sceneId,
          media_type: 'image',
          storage_path: `scenes/${projectId}/${sceneId}/image-regen-${timestamp}.png`,
          url: blob.url,
          prompt_used: scenePrompt.prompt,
          generation_seed: scenePrompt.seed,
          is_selected: false,
        })
        .select()
        .single();

      if (mediaError) throw new Error(mediaError.message);
      newMedia = media;
    } else {
      const result = await generateVideoFromText(
        scenePrompt.prompt,
        Number(scene.duration_sec),
        scenePrompt.aspect_ratio === '9:16' ? '9:16' : '16:9'
      );

      const buffer = Buffer.from(result.videoBase64, 'base64');
      const timestamp = Date.now();
      const blob = await put(
        `scenes/${projectId}/${sceneId}/video-regen-${timestamp}.mp4`,
        buffer,
        { access: 'public', contentType: 'video/mp4' }
      );

      const { data: media, error: mediaError } = await supabase
        .from('scene_media')
        .insert({
          scene_id: sceneId,
          media_type: 'video',
          storage_path: `scenes/${projectId}/${sceneId}/video-regen-${timestamp}.mp4`,
          url: blob.url,
          prompt_used: scenePrompt.prompt,
          duration_sec: result.durationSec,
          is_selected: false,
        })
        .select()
        .single();

      if (mediaError) throw new Error(mediaError.message);
      newMedia = media;
    }

    return NextResponse.json({ data: newMedia }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
