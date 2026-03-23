export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const SIGNED_URL_EXPIRES_IN = 60 * 60; // 1시간

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const { id: projectId } = await context.params;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, status, output_url, title')
      .eq('id', projectId)
      .single();

    if (projectError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
    if (project.user_id !== user.id) throw ApiError.forbidden();

    if (project.status !== 'completed' || !project.output_url) {
      return NextResponse.json(
        { error: { message: '렌더링이 완료되지 않았습니다.', code: 'NOT_READY' } },
        { status: 409 }
      );
    }

    // output_url에서 storage path 추출 후 signed URL 생성
    // output_url 형식: renders/<path>
    const storageAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // output_url에서 버킷 경로 파싱
    // 예: https://<project>.supabase.co/storage/v1/object/public/renders/video/...
    const urlObj = new URL(project.output_url);
    const pathParts = urlObj.pathname.split('/storage/v1/object/public/renders/');
    const storagePath = pathParts[1] ?? project.output_url;

    const { data: signedData, error: signedError } = await storageAdmin.storage
      .from('renders')
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRES_IN, {
        download: `${project.title}.mp4`,
      });

    if (signedError || !signedData) {
      throw new Error(`Signed URL 생성 실패: ${signedError?.message}`);
    }

    return NextResponse.json({
      downloadUrl: signedData.signedUrl,
      expiresIn: SIGNED_URL_EXPIRES_IN,
      filename: `${project.title}.mp4`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
