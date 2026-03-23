import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { synthesize } from '@/lib/ai/tts';
import { groupWords } from '@/lib/subtitle/word-grouper';
import { generateASS } from '@/lib/subtitle/ass-generator';
import type { WordTimestamp } from '@/lib/ai/tts';
import type { Prisma } from '@prisma/client';

interface RenderRequestedEvent {
  data: {
    jobId: string;
    projectId: string;
    userId: string;
    voiceSettings: {
      language: string;
      speed: number;
      voice_id?: string;
    };
    subtitleStyle?: {
      fontName?: string;
      fontSize?: number;
      primaryColor?: string;
      outlineColor?: string;
      outlineWidth?: number;
      alignment?: number;
    };
    exportSettings: {
      resolution: string;
      fps: number;
      format: string;
    };
  };
}

async function updateJobProgress(jobId: string, progress: number, currentStep: number) {
  await prisma.jobs.update({
    where: { id: jobId },
    data: { progress, current_step: currentStep, status: 'processing' },
  });
}

export const renderPipelineFunction = inngest.createFunction(
  {
    id: 'render-pipeline',
    name: '렌더링 파이프라인',
    retries: 2,
    concurrency: { limit: 5 },
  },
  { event: 'render.requested' },
  async ({ event, step }) => {
    const { jobId, projectId, userId, voiceSettings, subtitleStyle, exportSettings } =
      (event as RenderRequestedEvent).data;

    const TOTAL_STEPS = 3;

    // Step 1: TTS 생성
    const ttsResult = await step.run('generate-tts', async () => {
      await updateJobProgress(jobId, 10, 1);

      // 씬 목록 조회
      const scenes = await prisma.scenes.findMany({
        where: { project_id: projectId },
        orderBy: { scene_number: 'asc' },
        select: { id: true, narration: true, duration_sec: true },
      });

      const allWordTimestamps: Array<WordTimestamp & { scene_id: string }> = [];
      const audioBuffers: Buffer[] = [];
      let currentOffset = 0;
      const silenceDuration = 0.5;

      for (const scene of scenes) {
        if (!scene.narration.trim()) continue;

        const result = await synthesize(
          scene.narration,
          voiceSettings.language,
          voiceSettings.speed,
          voiceSettings.voice_id
        );

        // 타임스탬프에 오프셋 + scene_id 추가
        for (const wt of result.wordTimestamps) {
          allWordTimestamps.push({
            word: wt.word,
            start: wt.start + currentOffset,
            end: wt.end + currentOffset,
            scene_id: scene.id,
          });
        }

        audioBuffers.push(result.audioBuffer);
        currentOffset += result.durationSec + silenceDuration;
      }

      // 합쳐진 오디오 버퍼 (Worker에서 실제 FFmpeg 처리)
      const combinedAudio = Buffer.concat(audioBuffers);
      const totalDuration = currentOffset;

      // Supabase Storage에 업로드
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const storagePath = `audio/${projectId}/${jobId}.wav`;
      const { error: uploadError } = await supabase.storage
        .from('renders')
        .upload(storagePath, combinedAudio, {
          contentType: 'audio/wav',
          upsert: true,
        });

      if (uploadError) throw new Error(`오디오 업로드 실패: ${uploadError.message}`);

      const { data: urlData } = supabase.storage.from('renders').getPublicUrl(storagePath);

      // audio_tracks에 저장
      await prisma.audio_tracks.create({
        data: {
          project_id: projectId,
          storage_path: storagePath,
          url: urlData.publicUrl,
          duration_sec: totalDuration,
          voice_settings: voiceSettings as unknown as Prisma.InputJsonValue,
          word_timestamps: allWordTimestamps as unknown as Prisma.InputJsonValue,
        },
      });

      await updateJobProgress(jobId, 40, 1);

      return {
        audioUrl: urlData.publicUrl,
        storagePath,
        wordTimestamps: allWordTimestamps,
        totalDuration,
      };
    });

    // Step 2: 자막 생성
    const subtitleResult = await step.run('generate-subtitles', async () => {
      await updateJobProgress(jobId, 50, 2);

      const events = groupWords(ttsResult.wordTimestamps, 4);
      const assContent = generateASS(events, subtitleStyle ?? {});

      // subtitles 테이블에 upsert
      await prisma.subtitles.upsert({
        where: { project_id_format: { project_id: projectId, format: 'ass' } },
        create: {
          project_id: projectId,
          format: 'ass',
          content: assContent,
          style_settings: (subtitleStyle ?? {}) as unknown as Prisma.InputJsonValue,
        },
        update: {
          content: assContent,
          style_settings: (subtitleStyle ?? {}) as unknown as Prisma.InputJsonValue,
          updated_at: new Date(),
        },
      });

      await updateJobProgress(jobId, 65, 2);

      return { assContent };
    });

    // Step 3: Worker에 FFmpeg 렌더링 이벤트 발행
    await step.run('trigger-ffmpeg', async () => {
      await updateJobProgress(jobId, 70, 3);

      // 씬 + 미디어 타임라인 구성
      const scenes = await prisma.scenes.findMany({
        where: { project_id: projectId },
        orderBy: { scene_number: 'asc' },
        include: {
          scene_media: {
            where: { is_selected: true },
            take: 1,
          },
        },
      });

      const timeline = scenes.map((scene) => {
        const media = scene.scene_media[0];
        const sceneWords = ttsResult.wordTimestamps.filter(
          (wt) => (wt as WordTimestamp & { scene_id: string }).scene_id === scene.id
        );
        const audioStart = sceneWords.length > 0 ? sceneWords[0].start : 0;
        const audioEnd =
          sceneWords.length > 0 ? sceneWords[sceneWords.length - 1].end : audioStart;

        return {
          scene_id: scene.id,
          scene_number: scene.scene_number,
          audio_start: audioStart,
          audio_end: audioEnd,
          transition: scene.transition,
          media_type: media?.media_type ?? 'image',
          media_url: media?.url ?? null,
          media_storage_path: media?.storage_path ?? null,
        };
      });

      await inngest.send({
        name: 'render.ffmpeg.requested',
        data: {
          jobId,
          projectId,
          userId,
          audioUrl: ttsResult.audioUrl,
          subtitleContent: subtitleResult.assContent,
          timeline,
          exportSettings,
        },
      });

      await updateJobProgress(jobId, 75, 3);
    });

    return { success: true, jobId };
  }
);
