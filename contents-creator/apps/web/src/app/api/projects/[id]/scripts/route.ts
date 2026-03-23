export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { z } from 'zod';

const scriptUpdateSchema = z.object({
  full_script: z.string().optional(),
  scenes_json: z.array(z.unknown()).optional(),
});

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
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

    const { data: script, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: script ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;
    await getOwnedProject(supabase, projectId, user.id);

    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('id')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (scriptError) throw new Error(scriptError.message);
    if (!script) throw ApiError.notFound('활성 대본을 찾을 수 없습니다.');

    const body = await request.json();
    const input = scriptUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (input.full_script !== undefined) updateData.full_script = input.full_script;
    if (input.scenes_json !== undefined) updateData.scenes_json = input.scenes_json;

    const { data: updated, error: updateError } = await supabase
      .from('scripts')
      .update(updateData)
      .eq('id', script.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
