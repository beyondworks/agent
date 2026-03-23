import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { generateAIText, generateAIJSON } from '@/lib/ai/claude';
import { z } from 'zod';
import { search } from '@/lib/ai/brave-search';
import {
  RESEARCH_ANALYSIS_SYSTEM,
  OUTLINE_SYSTEM,
  getOutlinePrompt,
  SCRIPT_WRITING_SYSTEM,
  getScriptWritingPrompt,
  SCENE_SPLITTING_SYSTEM,
  getSceneSplittingPrompt,
} from '@/lib/ai/prompts/script-generation';
import {
  QUALITY_EVALUATION_SYSTEM,
  getQualityEvaluationPrompt,
} from '@/lib/ai/prompts/quality-evaluation';

interface ScriptGenerationEvent {
  data: {
    jobId: string;
    projectId: string;
    keywords: string[];
    contentType: 'short_form' | 'long_form';
    sourceUrl?: string;
    sourceText?: string;
  };
}

interface SceneData {
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
  keywords: string[];
}

interface OutlineData {
  title: string;
  sections: Array<{ name: string; duration_sec: number; key_message: string; notes: string }>;
  target_word_count: number;
}

interface QualityData {
  categories: {
    hook: { score: number; reason: string };
    storytelling: { score: number; reason: string };
    density: { score: number; reason: string };
    cta: { score: number; reason: string };
    visual: { score: number; reason: string };
  };
  total: number;
  suggestions: string[];
}

async function updateJobProgress(jobId: string, progress: number, currentStep: number) {
  await prisma.jobs.update({
    where: { id: jobId },
    data: {
      progress,
      current_step: currentStep,
      status: 'processing',
    },
  });
}

export const generateScriptFunction = inngest.createFunction(
  {
    id: 'generate-script',
    name: '대본 생성',
    retries: 2,
  },
  { event: 'script.generation.requested' },
  async ({ event, step }) => {
    const { jobId, projectId, keywords, contentType, sourceUrl, sourceText } =
      (event as ScriptGenerationEvent).data;

    const TOTAL_STEPS = 5;

    // Step 1: 웹 리서치
    const researchResult = await step.run('web-research', async () => {
      await updateJobProgress(jobId, 10, 1);

      let analysis: string;

      if (sourceText) {
        analysis = await generateAIText(
          RESEARCH_ANALYSIS_SYSTEM,
          `다음 텍스트를 분석하여 핵심 주제, 구조, 강점, 약점을 파악하세요:\n\n${sourceText}`
        );
      } else if (sourceUrl) {
        analysis = await generateAIText(
          RESEARCH_ANALYSIS_SYSTEM,
          `다음 URL의 콘텐츠를 기반으로 핵심 주제, 구조, 강점, 약점을 분석하세요. URL: ${sourceUrl}\n키워드: ${keywords.join(', ')}`
        );
      } else {
        const searchQuery = keywords.join(' ');
        const results = await search(searchQuery, 10).catch(() => []);

        const summaries = results
          .slice(0, 5)
          .map((r) => `제목: ${r.title}\nURL: ${r.url}\n설명: ${r.description}`)
          .join('\n\n---\n\n');

        analysis = await generateAIText(
          RESEARCH_ANALYSIS_SYSTEM,
          `키워드: ${keywords.join(', ')}\n\n검색 결과:\n${summaries || '검색 결과 없음'}\n\n위 내용을 바탕으로 트렌드, 공통 주제, 차별화 기회를 분석하세요.`
        );
      }

      await updateJobProgress(jobId, 25, 1);
      return { analysis };
    });

    // Step 2: 콘텐츠 분석 + 아웃라인
    const outlineResult = await step.run('content-analysis', async () => {
      await updateJobProgress(jobId, 35, 2);

      const targetDuration = contentType === 'short_form' ? 45 : 300;
      const targetWordCount = Math.round(targetDuration * 2.5);

      const outline = await generateAIJSON<OutlineData>(
        OUTLINE_SYSTEM,
        getOutlinePrompt({
          analysis: researchResult.analysis,
          keywords,
          contentType,
          targetDuration,
        }),
        z.object({
          title: z.string(),
          sections: z.array(z.object({
            name: z.string(),
            duration_sec: z.number(),
            key_message: z.string(),
            notes: z.string(),
          })),
          target_word_count: z.number(),
        })
      );

      await updateJobProgress(jobId, 45, 2);
      return { outline, targetDuration, targetWordCount };
    });

    // Step 3: 대본 작성
    const scriptResult = await step.run('script-writing', async () => {
      await updateJobProgress(jobId, 55, 3);

      const outlineText = JSON.stringify(outlineResult.outline, null, 2);
      const fullScript = await generateAIText(
        SCRIPT_WRITING_SYSTEM,
        getScriptWritingPrompt({
          outline: outlineText,
          targetWordCount: outlineResult.targetWordCount,
          contentType,
        })
      );

      await updateJobProgress(jobId, 65, 3);
      return { fullScript };
    });

    // Step 4: 씬 분할
    const scenesResult = await step.run('scene-splitting', async () => {
      await updateJobProgress(jobId, 75, 4);

      const scenes = await generateAIJSON<SceneData[]>(
        SCENE_SPLITTING_SYSTEM,
        getSceneSplittingPrompt(scriptResult.fullScript, contentType),
        z.array(z.object({
          scene_number: z.number(),
          narration: z.string(),
          visual_desc: z.string(),
          duration_sec: z.number(),
          keywords: z.array(z.string()),
        }))
      );

      await updateJobProgress(jobId, 85, 4);
      return { scenes };
    });

    // Step 5: 품질 평가
    const qualityResult = await step.run('quality-evaluation', async () => {
      await updateJobProgress(jobId, 90, 5);

      const quality = await generateAIJSON<QualityData>(
        QUALITY_EVALUATION_SYSTEM,
        getQualityEvaluationPrompt({
          fullScript: scriptResult.fullScript,
          scenes: scenesResult.scenes,
          contentType,
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

      await updateJobProgress(jobId, 95, 5);
      return { quality };
    });

    // 결과 저장
    await step.run('save-results', async () => {
      const [savedScript] = await prisma.$transaction([
        prisma.scripts.create({
          data: {
            project_id: projectId,
            source_type: sourceUrl ? 'url' : sourceText ? 'text' : 'keyword',
            source_keywords: keywords,
            source_url: sourceUrl ?? null,
            source_text: sourceText ?? null,
            full_script: scriptResult.fullScript,
            scenes_json: scenesResult.scenes as unknown as import('@prisma/client').Prisma.InputJsonValue,
            quality_score: qualityResult.quality as unknown as import('@prisma/client').Prisma.InputJsonValue,
            is_active: true,
          },
        }),
        prisma.jobs.update({
          where: { id: jobId },
          data: {
            status: 'completed',
            progress: 100,
            current_step: TOTAL_STEPS,
            completed_at: new Date(),
            output_data: {
              scriptId: '',
            } as import('@prisma/client').Prisma.InputJsonValue,
          },
        }),
        prisma.projects.update({
          where: { id: projectId },
          data: { status: 'scripting' },
        }),
      ]);

      // scriptId를 output_data에 업데이트
      await prisma.jobs.update({
        where: { id: jobId },
        data: {
          output_data: {
            scriptId: savedScript.id,
          } as import('@prisma/client').Prisma.InputJsonValue,
        },
      });

      return { scriptId: savedScript.id };
    });

    return { success: true };
  }
);
