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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;
    await getOwnedProject(supabase, projectId, user.id);

    const { data: scenes, error } = await supabase
      .from('scenes')
      .select('*, scene_media(*)')
      .eq('project_id', projectId)
      .order('scene_number', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: scenes });
  } catch (error) {
    return handleApiError(error);
  }
}
