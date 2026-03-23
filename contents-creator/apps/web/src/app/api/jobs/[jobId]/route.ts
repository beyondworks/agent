export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { jobId } = await params;

    const { data: job, error } = await supabase
      .from('jobs')
      .select('id, status, progress, current_step, total_steps, error_message, output_data, created_at, started_at, completed_at, project_id')
      .eq('id', jobId)
      .single();

    if (error || !job) throw ApiError.notFound('Job을 찾을 수 없습니다.');

    // 프로젝트 소유권 확인
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', job.project_id)
      .single();

    if (projectError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
    if (project.user_id !== user.id) throw ApiError.forbidden();

    return NextResponse.json({
      data: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        current_step: job.current_step,
        total_steps: job.total_steps,
        error_message: job.error_message,
        output_data: job.output_data,
        created_at: job.created_at,
        started_at: job.started_at,
        completed_at: job.completed_at,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
