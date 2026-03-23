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

async function getProject(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string, userId: string) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();
  if (error || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
  return project;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, supabase } = await getAuthUser();
    await getProject(supabase, id, user.id);

    const { data: style, error } = await supabase
      .from('project_styles')
      .select('*, preset:style_presets(id, name, category, description, thumbnail_url, style_params)')
      .eq('project_id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: style });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, supabase } = await getAuthUser();
    await getProject(supabase, id, user.id);

    const body = await request.json();
    const { preset_id, reference_urls, analyzed_style } = body as {
      preset_id?: string;
      reference_urls?: string[];
      analyzed_style?: Record<string, unknown>;
    };

    if (!preset_id && (!reference_urls || reference_urls.length === 0)) {
      throw ApiError.badRequest('preset_id 또는 reference_urls가 필요합니다.');
    }

    let finalPromptPrefix = '';
    let finalPromptSuffix = '';
    let finalNegativePrompt = '';

    if (preset_id) {
      const { data: preset, error: presetError } = await supabase
        .from('style_presets')
        .select('prompt_prefix, prompt_suffix, negative_prompt')
        .eq('id', preset_id)
        .single();
      if (presetError || !preset) throw ApiError.notFound('프리셋을 찾을 수 없습니다.');
      finalPromptPrefix = preset.prompt_prefix;
      finalPromptSuffix = preset.prompt_suffix;
      finalNegativePrompt = preset.negative_prompt;
    } else if (analyzed_style) {
      finalPromptPrefix = (analyzed_style.prompt_prefix as string) ?? '';
      finalPromptSuffix = (analyzed_style.prompt_suffix as string) ?? '';
      finalNegativePrompt = (analyzed_style.negative_prompt as string) ?? '';
    }

    // upsert: project_id 기준
    const { data: existing } = await supabase
      .from('project_styles')
      .select('id')
      .eq('project_id', id)
      .maybeSingle();

    let style;
    if (existing) {
      const { data, error } = await supabase
        .from('project_styles')
        .update({
          preset_id: preset_id ?? null,
          reference_urls: reference_urls ?? [],
          analyzed_style: analyzed_style ?? {},
          final_prompt_prefix: finalPromptPrefix,
          final_prompt_suffix: finalPromptSuffix,
          final_negative_prompt: finalNegativePrompt,
          updated_at: new Date().toISOString(),
        })
        .eq('project_id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      style = data;
    } else {
      const { data, error } = await supabase
        .from('project_styles')
        .insert({
          project_id: id,
          preset_id: preset_id ?? null,
          reference_urls: reference_urls ?? [],
          analyzed_style: analyzed_style ?? {},
          final_prompt_prefix: finalPromptPrefix,
          final_prompt_suffix: finalPromptSuffix,
          final_negative_prompt: finalNegativePrompt,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      style = data;
    }

    // 프로젝트 상태를 styling으로 업데이트
    const { error: updateError } = await supabase
      .from('projects')
      .update({ status: 'styling' })
      .eq('id', id);
    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ data: style }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
