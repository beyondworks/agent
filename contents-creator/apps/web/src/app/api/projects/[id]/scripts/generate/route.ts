export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { generateAIText, generateAIJSON } from '@/lib/ai/claude';
import {
  RESEARCH_ANALYSIS_SYSTEM,
  SCRIPT_WRITING_SYSTEM,
  SCENE_SPLITTING_SYSTEM,
  getSceneSplittingPrompt,
} from '@/lib/ai/prompts/script-generation';
import { QUALITY_EVALUATION_SYSTEM, getQualityEvaluationPrompt } from '@/lib/ai/prompts/quality-evaluation';
import { z } from 'zod';

const sceneSchema = z.array(z.object({
  scene_number: z.number(),
  narration: z.string(),
  visual_desc: z.string().optional(),
  duration_sec: z.number(),
  keywords: z.array(z.string()).optional(),
}));

const generateSchema = z.object({
  keywords: z.array(z.string().min(1)).min(1, '키워드를 최소 1개 입력하세요.'),
  source_url: z.string().url().optional().or(z.literal('')),
  source_text: z.string().optional(),
});

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;

    // 프로젝트 소유권 확인
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();
    if (projError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');

    const body = await request.json();
    const input = generateSchema.parse(body);
    const contentType = project.content_type as 'short_form' | 'long_form';
    const targetDuration = contentType === 'short_form' ? 60 : 600;
    const spicyLevel: number = (project.export_settings as { spicy_level?: number } | null)?.spicy_level ?? 50;

    // Job 생성
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        project_id: projectId,
        job_type: 'script_generation',
        status: 'processing',
        total_steps: 5,
        current_step: 1,
        progress: 10,
      })
      .select()
      .single();
    if (jobError || !job) throw new Error(jobError?.message ?? 'Job 생성 실패');

    // 프로젝트 상태 업데이트
    await supabase.from('projects').update({ status: 'scripting' }).eq('id', projectId);

    const t0 = Date.now();
    console.log('[Script Gen] Step 1: 콘텐츠 분석 시작');

    // Step 1: 콘텐츠 분석
    const analysisPrompt = `다음 키워드에 대해 영상 콘텐츠 전략을 분석하세요.
키워드: ${input.keywords.join(', ')}
${input.source_text ? `\n참조 텍스트:\n${input.source_text}` : ''}
${input.source_url ? `\n참조 URL: ${input.source_url}` : ''}

핵심 트렌드, 타겟 시청자의 관심사, 차별화 포인트를 도출하세요.`;

    const analysis = await generateAIText(RESEARCH_ANALYSIS_SYSTEM, analysisPrompt);
    console.log(`[Script Gen] Step 1 완료 (${((Date.now() - t0) / 1000).toFixed(1)}s, ${analysis.length}자)`);

    await supabase.from('jobs').update({ current_step: 2, progress: 30 }).eq('id', job.id);

    // Step 2: 대본 작성
    const t1 = Date.now();
    console.log('[Script Gen] Step 2: 대본 작성 시작');
    const targetWordCount = Math.round(targetDuration * 2.5);
    const sourceWarning = (input.source_text || input.source_url)
      ? `\n\n⚠️ 주의: 제공된 소스 텍스트는 참고 자료일 뿐입니다. 절대 원본을 복사하지 마세요. 핵심 인사이트만 추출하여 이 캐릭터의 관점과 문체로 완전히 새로운 대본을 작성하세요.`
      : '';
    const scriptPrompt = `다음 분석 결과를 바탕으로 ${contentType === 'short_form' ? '숏폼(정확히 60초)' : '롱폼(7-12분)'} 영상 대본을 작성하세요.

키워드: ${input.keywords.join(', ')}
목표 어절 수: 약 ${targetWordCount}어절 (${contentType === 'short_form' ? '60초 분량, 한국어 분당 275자 기준 약 275자' : ''})

분석 자료:
${analysis}

규칙:
- 첫 문장은 질문 또는 충격적 통계로 시작
- 각 섹션을 [SECTION: 섹션명] 태그로 구분
- CTA는 구체적 행동 지시
- 친근하고 전문적인 톤
Spicy Level: ${spicyLevel}/100
${spicyLevel >= 80 ? '매우 자극적이고 직설적인 구어체 사용. 감탄사, 축약어, 인터넷 밈 활용.' :
  spicyLevel >= 60 ? '직설적이고 강렬한 톤. 과감한 주장과 자극적 표현 허용.' :
  spicyLevel >= 30 ? '친근하고 편안한 톤. 자연스러운 대화체.' :
  '차분하고 전문적인 톤. 정제된 표현.'}${sourceWarning}`;
    const fullScript = await generateAIText(SCRIPT_WRITING_SYSTEM, scriptPrompt);
    console.log(`[Script Gen] Step 2 완료 (${((Date.now() - t1) / 1000).toFixed(1)}s, ${fullScript.length}자)`);

    await supabase.from('jobs').update({ current_step: 3, progress: 60 }).eq('id', job.id);

    // Step 3: 씬 분할
    const t2 = Date.now();
    console.log('[Script Gen] Step 3: 씬 분할 시작');
    const sceneSplitPrompt = getSceneSplittingPrompt(fullScript, contentType);
    let scenesJson: unknown[];
    try {
      scenesJson = await generateAIJSON(
        SCENE_SPLITTING_SYSTEM,
        sceneSplitPrompt,
        sceneSchema,
        contentType === 'long_form' ? 16384 : 8192
      );
      console.log(`[Script Gen] Step 3 완료 (${((Date.now() - t2) / 1000).toFixed(1)}s, ${scenesJson.length}개 씬)`);
    } catch (sceneError) {
      console.error('[Script Gen] Step 3 씬 분할 실패:', sceneError);
      scenesJson = [];
    }

    await supabase.from('jobs').update({ current_step: 5, progress: 85 }).eq('id', job.id);

    // Step 4: 품질 평가
    const t3 = Date.now();
    console.log('[Script Gen] Step 4: 품질 평가 시작');
    await supabase.from('jobs').update({ current_step: 5, progress: 90 }).eq('id', job.id);

    const qualitySchema = z.object({
      categories: z.object({
        hook: z.object({ score: z.number(), reason: z.string() }),
        storytelling: z.object({ score: z.number(), reason: z.string() }),
        density: z.object({ score: z.number(), reason: z.string() }),
        cta: z.object({ score: z.number(), reason: z.string() }),
        visual: z.object({ score: z.number(), reason: z.string() }),
      }),
      total: z.number(),
      suggestions: z.array(z.string()).optional(),
    });

    let qualityScore = {};
    try {
      const qualityPrompt = getQualityEvaluationPrompt({
        fullScript,
        scenes: scenesJson as Array<{ scene_number: number; narration: string; visual_desc: string; duration_sec: number }>,
        contentType,
      });
      qualityScore = await generateAIJSON(
        QUALITY_EVALUATION_SYSTEM,
        qualityPrompt,
        qualitySchema
      );
      console.log(`[Script Gen] Step 4 완료 (${((Date.now() - t3) / 1000).toFixed(1)}s)`);
    } catch (qError) {
      console.error('[Script Gen] Step 4 품질 평가 실패:', qError);
      qualityScore = { total: 0, categories: {}, suggestions: [] };
    }

    console.log(`[Script Gen] 전체 소요: ${((Date.now() - t0) / 1000).toFixed(1)}s`);

    // 기존 활성 대본 비활성화
    await supabase
      .from('scripts')
      .update({ is_active: false })
      .eq('project_id', projectId)
      .eq('is_active', true);

    // 대본 저장
    const { data: script, error: scriptError } = await supabase
      .from('scripts')
      .insert({
        project_id: projectId,
        source_type: input.source_url ? 'url' : input.source_text ? 'text' : 'keyword',
        source_keywords: input.keywords,
        source_url: input.source_url || null,
        source_text: input.source_text || null,
        research_data: { analysis },
        full_script: fullScript,
        scenes_json: scenesJson,
        quality_score: qualityScore,
        is_active: true,
      })
      .select()
      .single();

    if (scriptError) throw new Error(scriptError.message);

    // Job 완료
    await supabase.from('jobs').update({
      status: 'completed',
      progress: 100,
      current_step: 5,
      completed_at: new Date().toISOString(),
      output_data: { scriptId: script?.id },
    }).eq('id', job.id);

    return NextResponse.json({
      data: {
        jobId: job.id,
        script: {
          id: script?.id,
          full_script: fullScript,
          scenes_json: scenesJson,
        },
      },
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
