export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { projectCreateSchema } from '@videoforge/shared/validators';

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthUser();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
    const offset = (page - 1) * limit;

    const { data: projects, error, count } = await supabase
      .from('projects')
      .select('id, title, topic, content_type, target_platform, status, thumbnail_url, scene_count, created_at, updated_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return NextResponse.json({
      data: projects,
      pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthUser();

    const body = await request.json();
    const input = projectCreateSchema.parse(body);

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title: input.title,
        topic: input.topic,
        content_type: input.content_type,
        target_platform: input.target_platform,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
