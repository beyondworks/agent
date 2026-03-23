export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiError, handleApiError } from '@/lib/api-error';
import { generateSceneImage } from '@/lib/ai/gemini';
import { generateScenePrompts, type ProjectStyle, type SceneInput } from '@/lib/ai/style-chain';
import { generateAIJSON } from '@/lib/ai/claude';
import { z } from 'zod';

const VISUAL_DESC_SYSTEM = `당신은 영상 콘텐츠 시각 연출 전문가입니다.

나레이션 텍스트와 스타일 가이드를 받아, 각 씬의 시각적 장면을 구체적으로 설명합니다.

### 규칙
- 나레이션의 핵심 메시지를 시각적으로 어떻게 표현할지 구체적으로 서술
- 스타일 가이드가 있으면 해당 스타일의 시각 언어에 맞춰 설명 (차트 유형, 레이아웃 패턴, 색상 활용 등)
- 텍스트 오버레이 대신 시각적 메타포 사용 (아이콘, 화살표, 인물 표정, 그래프 등)
- 빈 화면 금지: 항상 시각적 요소가 있어야 함
- 비유가 나오면 비유 소재를 시각화 (예: "물 흐르듯" → 물결 모양 그래픽)
- 각 씬의 visual_desc는 한국어로 2-3문장

JSON 배열로 응답하세요.`;

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw ApiError.unauthorized();
  return { user, supabase };
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, supabase } = await getAuthUser();
    const { id: projectId } = await params;

    // 프로젝트 소유권
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();
    if (!project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');

    // 대본 조회
    const { data: script } = await supabase
      .from('scripts')
      .select('id, scenes_json, full_script')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .single();
    if (!script || !script.scenes_json?.length) {
      throw ApiError.badRequest('먼저 대본을 생성하세요 (씬 분할 포함).');
    }

    // 스타일 조회
    const { data: style } = await supabase
      .from('project_styles')
      .select('*, style_presets(*)')
      .eq('project_id', projectId)
      .single();

    const projectStyle: ProjectStyle = {
      final_prompt_prefix: style?.final_prompt_prefix || style?.style_presets?.prompt_prefix || '',
      final_prompt_suffix: style?.final_prompt_suffix || style?.style_presets?.prompt_suffix || '',
      final_negative_prompt: style?.final_negative_prompt || style?.style_presets?.negative_prompt || '',
    };

    const styleGuide = style?.analyzed_style?.style_guide as string | undefined;

    const rawScenes = script.scenes_json as Array<{
      scene_number: number;
      narration: string;
      visual_desc?: string;
      duration_sec: number;
      keywords?: string[];
    }>;

    const contentType = project.content_type === 'short_form' ? 'short_form' as const : 'long_form' as const;

    // === Phase 1: 시각 설명 생성 (나레이션 + 스타일 → visual_desc) ===
    console.log(`[Scene Gen] Phase 1: ${rawScenes.length}개 씬 시각 설명 생성`);

    const needsVisualDesc = rawScenes.some(s => !s.visual_desc);

    let scenes: SceneInput[];
    if (needsVisualDesc) {
      const styleContext = [
        projectStyle.final_prompt_prefix && `스타일: ${projectStyle.final_prompt_prefix}`,
        styleGuide && `디자인 가이드: ${styleGuide}`,
      ].filter(Boolean).join('\n');

      const visualDescPrompt = `${styleContext ? `${styleContext}\n\n` : ''}다음 씬들의 나레이션을 읽고, 각 씬의 시각적 장면 설명(visual_desc)을 작성하세요.

${rawScenes.map(s => `씬 ${s.scene_number} (${s.duration_sec}초): "${s.narration}"`).join('\n')}

각 씬에 대해 JSON 배열로 응답:
[{"scene_number": 1, "visual_desc": "..."}, ...]`;

      const visualDescSchema = z.array(z.object({
        scene_number: z.number(),
        visual_desc: z.string(),
      }));

      try {
        const visualDescs = await generateAIJSON(VISUAL_DESC_SYSTEM, visualDescPrompt, visualDescSchema);
        scenes = rawScenes.map(s => {
          const generated = visualDescs.find(v => v.scene_number === s.scene_number);
          return {
            scene_number: s.scene_number,
            narration: s.narration,
            visual_desc: s.visual_desc || generated?.visual_desc || s.narration,
            duration_sec: s.duration_sec,
          };
        });
        console.log(`[Scene Gen] Phase 1 완료: ${visualDescs.length}개 시각 설명 생성`);
      } catch (err) {
        console.error('[Scene Gen] Phase 1 시각 설명 생성 실패, 나레이션을 대체 사용:', err);
        scenes = rawScenes.map(s => ({
          scene_number: s.scene_number,
          narration: s.narration,
          visual_desc: s.visual_desc || s.narration,
          duration_sec: s.duration_sec,
        }));
      }
    } else {
      scenes = rawScenes.map(s => ({
        scene_number: s.scene_number,
        narration: s.narration,
        visual_desc: s.visual_desc!,
        duration_sec: s.duration_sec,
      }));
    }

    // === Phase 2: Nano Banana 프롬프트 최적화 ===
    console.log(`[Scene Gen] Phase 2: ${scenes.length}개 씬 Nano Banana 프롬프트 최적화`);
    const optimizedPrompts = await generateScenePrompts(scenes, projectStyle, contentType);
    console.log(`[Scene Gen] Phase 2 완료: ${optimizedPrompts.length}개 프롬프트`);

    // === Phase 3: 이미지 생성 ===
    console.log(`[Scene Gen] Phase 3: 이미지 생성 시작`);

    // Job 생성
    const { data: job } = await supabase
      .from('jobs')
      .insert({
        project_id: projectId,
        job_type: 'scene_generation',
        status: 'processing',
        total_steps: scenes.length,
        current_step: 0,
        progress: 5,
      })
      .select()
      .single();
    if (!job) throw new Error('Job 생성 실패');

    await supabase.from('projects').update({ status: 'generating' }).eq('id', projectId);

    const createdScenes = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const optimized = optimizedPrompts.find(p => p.scene_number === scene.scene_number);
      const fullPrompt = optimized?.prompt ?? `${projectStyle.final_prompt_prefix}, ${scene.visual_desc}, ${projectStyle.final_prompt_suffix}`.trim();
      const negativePrompt = optimized?.negative_prompt || projectStyle.final_negative_prompt || undefined;
      const aspectRatio = optimized?.aspect_ratio ?? '16:9';
      const seed = optimized?.seed;

      console.log(`[Scene Gen] Phase 3: 씬 ${scene.scene_number}/${scenes.length} 이미지 생성`);

      // 씬 레코드 생성
      const { data: sceneRecord } = await supabase
        .from('scenes')
        .insert({
          project_id: projectId,
          scene_number: scene.scene_number,
          narration: scene.narration,
          visual_desc: scene.visual_desc,
          duration_sec: scene.duration_sec,
          generation_prompt: fullPrompt,
          media_type: 'image',
          transition: 'fade',
        })
        .select()
        .single();

      if (!sceneRecord) {
        console.error(`[Scene Gen] 씬 ${scene.scene_number} 레코드 생성 실패`);
        continue;
      }

      // 이미지 생성
      try {
        const result = await generateSceneImage(fullPrompt, aspectRatio, negativePrompt, seed);

        const buffer = Buffer.from(result.imageBase64, 'base64');
        const ext = result.mimeType === 'image/png' ? 'png' : 'jpeg';
        const storagePath = `${projectId}/scenes/${sceneRecord.id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, buffer, {
            contentType: result.mimeType,
            upsert: true,
          });

        if (uploadError) {
          console.error(`[Scene Gen] 씬 ${scene.scene_number} 업로드 실패:`, uploadError.message);
          continue;
        }

        const { data: urlData } = supabase.storage.from('media').getPublicUrl(storagePath);

        const { data: media } = await supabase
          .from('scene_media')
          .insert({
            scene_id: sceneRecord.id,
            media_type: 'image',
            storage_path: storagePath,
            url: urlData.publicUrl,
            prompt_used: fullPrompt,
            is_selected: true,
          })
          .select()
          .single();

        if (media) {
          await supabase
            .from('scenes')
            .update({ selected_media_id: media.id })
            .eq('id', sceneRecord.id);
        }

        console.log(`[Scene Gen] 씬 ${scene.scene_number} 완료 ✓`);
        createdScenes.push({ sceneId: sceneRecord.id, mediaUrl: urlData.publicUrl });
      } catch (imgError) {
        console.error(`[Scene Gen] 씬 ${scene.scene_number} 이미지 생성 실패:`, imgError);
      }

      // 진행률 업데이트
      const progress = Math.round(((i + 1) / scenes.length) * 90) + 5;
      await supabase.from('jobs').update({
        current_step: i + 1,
        progress,
      }).eq('id', job.id);
    }

    // 완료
    await supabase.from('jobs').update({
      status: 'completed',
      progress: 100,
      completed_at: new Date().toISOString(),
    }).eq('id', job.id);

    await supabase.from('projects').update({
      status: 'editing',
      scene_count: createdScenes.length,
    }).eq('id', projectId);

    console.log(`[Scene Gen] 전체 완료: ${createdScenes.length}/${scenes.length}개 씬`);

    return NextResponse.json({
      data: {
        jobId: job.id,
        scenesCreated: createdScenes.length,
        totalScenes: scenes.length,
        scenes: createdScenes,
      },
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
