export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);
    const jobType = searchParams.get('type');
    const status = searchParams.get('status');

    let query = supabase
      .from('jobs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (jobType) query = query.eq('job_type', jobType);
    if (status) query = query.eq('status', status);

    const { data: job, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);

    return NextResponse.json({ data: job });
  } catch (error) {
    return handleApiError(error);
  }
}
