export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sceneId: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId, sceneId } = await params;
    await getOwnedProject(supabase, projectId, user.id);

    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('id, project_id')
      .eq('id', sceneId)
      .single();

    if (sceneError || !scene || scene.project_id !== projectId) {
      throw ApiError.notFound('씬을 찾을 수 없습니다.');
    }

    const body = await request.json() as {
      selected_media_id?: string;
      media_type?: 'image' | 'video';
      transition?: string;
      scene_number?: number;
      narration?: string;
      duration_sec?: number;
    };

    const updateData: Record<string, unknown> = {};

    if (body.selected_media_id !== undefined) {
      // 기존 is_selected 초기화 후 새 미디어 선택
      const { error: resetError } = await supabase
        .from('scene_media')
        .update({ is_selected: false })
        .eq('scene_id', sceneId);
      if (resetError) throw new Error(resetError.message);

      const { error: selectError } = await supabase
        .from('scene_media')
        .update({ is_selected: true })
        .eq('id', body.selected_media_id);
      if (selectError) throw new Error(selectError.message);

      updateData.selected_media_id = body.selected_media_id;
    }

    if (body.media_type !== undefined) updateData.media_type = body.media_type;
    if (body.transition !== undefined) updateData.transition = body.transition;
    if (body.scene_number !== undefined) updateData.scene_number = body.scene_number;
    if (body.narration !== undefined) updateData.narration = body.narration;
    if (body.duration_sec !== undefined) updateData.duration_sec = body.duration_sec;

    const { data: updated, error: updateError } = await supabase
      .from('scenes')
      .update(updateData)
      .eq('id', sceneId)
      .select('*, scene_media(*)')
      .single();

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
