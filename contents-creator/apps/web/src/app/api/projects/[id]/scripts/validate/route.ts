export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { generateAIJSON } from '@/lib/ai/claude';
import { z } from 'zod';
import { QUALITY_EVALUATION_SYSTEM, getQualityEvaluationPrompt } from '@/lib/ai/prompts/quality-evaluation';

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

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;
    const project = await getOwnedProject(supabase, projectId, user.id);

    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (scriptError) throw new Error(scriptError.message);
    if (!script) throw ApiError.notFound('활성 대본을 찾을 수 없습니다.');

    const scenes = (script.scenes_json as unknown as Array<{
      scene_number: number;
      narration: string;
      visual_desc: string;
      duration_sec: number;
    }>) ?? [];

    const quality = await generateAIJSON<{
      categories: {
        hook: { score: number; reason: string };
        storytelling: { score: number; reason: string };
        density: { score: number; reason: string };
        cta: { score: number; reason: string };
        visual: { score: number; reason: string };
      };
      total: number;
      suggestions: string[];
    }>(
      QUALITY_EVALUATION_SYSTEM,
      getQualityEvaluationPrompt({
        fullScript: script.full_script,
        scenes,
        contentType: project.content_type,
      }),
      z.object({
        categories: z.object({
          hook: z.object({ score: z.number(), reason: z.string() }),
          storytelling: z.object({ score: z.number(), reason: z.string() }),
          density: z.object({ score: z.number(), reason: z.string() }),
          cta: z.object({ score: z.number(), reason: z.string() }),
          visual: z.object({ score: z.number(), reason: z.string() }),
        }),
        total: z.number(),
        suggestions: z.array(z.string()),
      })
    );

    // 품질 점수 업데이트
    const { error: updateError } = await supabase
      .from('scripts')
      .update({ quality_score: quality })
      .eq('id', script.id);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ data: quality });
  } catch (error) {
    return handleApiError(error);
  }
}
