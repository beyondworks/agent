import { put } from '@vercel/blob';
import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { generateScenePrompts, type SceneInput } from '@/lib/ai/style-chain';
import { generateSceneImage } from '@/lib/ai/gemini';
import { generateVideoFromText } from "@/lib/ai/veo";;

interface ScenesGenerationEvent {
  data: {
    jobId: string;
    projectId: string;
  };
}

async function updateJobProgress(
  jobId: string,
  progress: number,
  currentStep: number,
  totalSteps: number
) {
  await prisma.jobs.update({
    where: { id: jobId },
    data: {
      progress,
      current_step: currentStep,
      total_steps: totalSteps,
      status: 'processing',
    },
  });
}

export const generateScenesFunction = inngest.createFunction(
  {
    id: 'generate-scenes',
    name: '씬 미디어 생성',
    retries: 1,
  },
  { event: 'scenes.generation.requested' },
  async ({ event, step }) => {
    const { jobId, projectId } = (event as ScenesGenerationEvent).data;

    // Step 1: 프로젝트 대본 + 스타일 설정 로드
    const context = await step.run('load-context', async () => {
      await updateJobProgress(jobId, 5, 1, 4);

      const project = await prisma.projects.findUnique({
        where: { id: projectId },
      });
      if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

      const script = await prisma.scripts.findFirst({
        where: { project_id: projectId, is_active: true },
        orderBy: { created_at: 'desc' },
      });
      if (!script) throw new Error('활성 대본이 없습니다.');

      const projectStyle = await prisma.project_styles.findUnique({
        where: { project_id: projectId },
      });

      const style = {
        final_prompt_prefix: projectStyle?.final_prompt_prefix ?? '',
        final_prompt_suffix: projectStyle?.final_prompt_suffix ?? '',
        final_negative_prompt: projectStyle?.final_negative_prompt ?? '',
      };

      const scenesJson = script.scenes_json as unknown as SceneInput[];

      return {
        contentType: project.content_type,
        scenes: scenesJson,
        style,
      };
    });

    // Step 2: Algorithm 3 스타일 프롬프트 체이닝
    const promptsResult = await step.run('generate-prompts', async () => {
      await updateJobProgress(jobId, 15, 2, 4);

      const scenePrompts = await generateScenePrompts(
        context.scenes,
        context.style,
        context.contentType
      );

      await updateJobProgress(jobId, 25, 2, 4);
      return { scenePrompts };
    });

    // Step 3: 씬별 미디어 생성 (이미지 2개 + 영상 1개)
    const totalScenes = context.scenes.length;
    const mediaResults: Array<{
      sceneNumber: number;
      images: Array<{ base64: string; prompt: string }>;
      video: { base64: string; durationSec: number; prompt: string } | null;
    }> = [];

    for (let i = 0; i < totalScenes; i++) {
      const scene = context.scenes[i];
      const scenePrompt = promptsResult.scenePrompts[i];
      if (!scene || !scenePrompt) continue;

      const sceneNumber = scene.scene_number;
      const progressBase = 25 + Math.round((i / totalScenes) * 55);
      await updateJobProgress(jobId, progressBase, 3, 4);

      // 이미지 2개 생성
      const images = await step.run(
        `generate-scene-${sceneNumber}-images`,
        async () => {
          const results: Array<{ base64: string; prompt: string }> = [];

          for (let imgIdx = 0; imgIdx < 2; imgIdx++) {
            try {
              const result = await generateSceneImage(
                scenePrompt.prompt,
                scenePrompt.aspect_ratio
              );
              results.push({
                base64: result.imageBase64,
                prompt: scenePrompt.prompt,
              });
            } catch (err) {
              console.error(
                `씬 ${sceneNumber} 이미지 ${imgIdx + 1} 생성 실패:`,
                err
              );
            }
          }

          return results;
        }
      );

      // 영상 1개 생성
      const video = await step.run(
        `generate-scene-${sceneNumber}-video`,
        async () => {
          try {
            const result = await generateVideoFromText(
              scenePrompt.prompt,
              Number(scene.duration_sec),
              scenePrompt.aspect_ratio === '9:16' ? '9:16' : '16:9'
            );
            return {
              base64: result.videoBase64,
              durationSec: result.durationSec,
              prompt: scenePrompt.prompt,
            };
          } catch (err) {
            console.error(`씬 ${sceneNumber} 영상 생성 실패:`, err);
            return null;
          }
        }
      );

      mediaResults.push({ sceneNumber, images, video });
    }

    // Step 4: 결과 저장
    await step.run('save-results', async () => {
      await updateJobProgress(jobId, 82, 4, 4);

      // 기존 씬 삭제 후 재생성
      await prisma.scenes.deleteMany({ where: { project_id: projectId } });

      for (let i = 0; i < context.scenes.length; i++) {
        const sceneInput = context.scenes[i];
        if (!sceneInput) continue;

        const mediaResult = mediaResults.find(
          (r) => r.sceneNumber === sceneInput.scene_number
        );

        // 씬 생성
        const scene = await prisma.scenes.create({
          data: {
            project_id: projectId,
            scene_number: sceneInput.scene_number,
            narration: sceneInput.narration,
            visual_desc: sceneInput.visual_desc,
            duration_sec: sceneInput.duration_sec,
            media_type: 'image',
            transition: 'fade',
          },
        });

        if (!mediaResult) continue;

        const createdMediaIds: string[] = [];

        // 이미지 저장
        for (let imgIdx = 0; imgIdx < mediaResult.images.length; imgIdx++) {
          const img = mediaResult.images[imgIdx];
          if (!img) continue;

          try {
            // base64 → Blob 업로드
            const buffer = Buffer.from(img.base64, 'base64');
            const blob = await put(
              `scenes/${projectId}/${scene.id}/image-${imgIdx + 1}.png`,
              buffer,
              { access: 'public', contentType: 'image/png' }
            );

            const media = await prisma.scene_media.create({
              data: {
                scene_id: scene.id,
                media_type: 'image',
                storage_path: `scenes/${projectId}/${scene.id}/image-${imgIdx + 1}.png`,
                url: blob.url,
                prompt_used: img.prompt,
                generation_seed: null,
                is_selected: imgIdx === 0,
              },
            });

            if (imgIdx === 0) {
              createdMediaIds.push(media.id);
            }
          } catch (err) {
            console.error(`이미지 저장 실패 (씬 ${sceneInput.scene_number}):`, err);
          }
        }

        // 영상 저장
        if (mediaResult.video) {
          try {
            const buffer = Buffer.from(mediaResult.video.base64, 'base64');
            const blob = await put(
              `scenes/${projectId}/${scene.id}/video.mp4`,
              buffer,
              { access: 'public', contentType: 'video/mp4' }
            );

            await prisma.scene_media.create({
              data: {
                scene_id: scene.id,
                media_type: 'video',
                storage_path: `scenes/${projectId}/${scene.id}/video.mp4`,
                url: blob.url,
                prompt_used: mediaResult.video.prompt,
                duration_sec: mediaResult.video.durationSec,
                is_selected: false,
              },
            });
          } catch (err) {
            console.error(`영상 저장 실패 (씬 ${sceneInput.scene_number}):`, err);
          }
        }

        // 첫 번째 이미지를 selected_media_id로 설정
        if (createdMediaIds.length > 0) {
          await prisma.scenes.update({
            where: { id: scene.id },
            data: { selected_media_id: createdMediaIds[0] },
          });
        }
      }

      // 프로젝트 상태 + scene_count 업데이트
      await prisma.projects.update({
        where: { id: projectId },
        data: {
          status: 'generating',
          scene_count: context.scenes.length,
        },
      });

      // Job 완료
      await prisma.jobs.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          progress: 100,
          current_step: 4,
          completed_at: new Date(),
          output_data: {
            sceneCount: context.scenes.length,
          } as import('@prisma/client').Prisma.InputJsonValue,
        },
      });
    });

    return { success: true };
  }
);
