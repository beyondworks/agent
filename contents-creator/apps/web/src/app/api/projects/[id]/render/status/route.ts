export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const { id: projectId } = await context.params;

    // 프로젝트 소유 확인
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, status, output_url')
      .eq('id', projectId)
      .single();

    if (projectError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
    if (project.user_id !== user.id) throw ApiError.forbidden();

    // 가장 최근 render job 조회
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, progress, total_steps, current_step, error_message, started_at, completed_at, created_at, output_data')
      .eq('project_id', projectId)
      .eq('job_type', 'render')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (jobError || !job) throw ApiError.notFound('렌더링 작업을 찾을 수 없습니다.');

    const stepLabels: Record<number, string> = {
      0: '대기 중',
      1: 'TTS 음성 생성',
      2: '자막 생성',
      3: 'FFmpeg 렌더링',
    };

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      currentStep: job.current_step,
      totalSteps: job.total_steps,
      currentStepLabel: stepLabels[job.current_step] ?? '처리 중',
      errorMessage: job.error_message,
      projectStatus: project.status,
      outputUrl: project.output_url,
      startedAt: job.started_at,
      completedAt: job.completed_at,
      createdAt: job.created_at,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
