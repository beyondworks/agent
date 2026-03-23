// Worker Inngest 함수: render.ffmpeg.requested 이벤트 처리

import { Inngest } from 'inngest';
import { createClient } from '@supabase/supabase-js';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { renderVideo, type TimelineEntry, type RenderSettings } from './ffmpeg/render.js';

export const inngest = new Inngest({ id: 'videoforge' });

interface FFmpegRequestedEvent {
  data: {
    jobId: string;
    projectId: string;
    userId: string;
    audioUrl: string;
    subtitleContent: string;
    timeline: Array<{
      scene_id: string;
      scene_number: number;
      audio_start: number;
      audio_end: number;
      transition: string;
      media_type: 'image' | 'video';
      media_url: string | null;
      media_storage_path: string | null;
    }>;
    exportSettings: {
      resolution: string;
      fps: number;
      format: string;
    };
  };
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase 환경변수(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다.');
  return createClient(url, key);
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`파일 다운로드 실패 (${response.status}): ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

export const renderFFmpegFunction = inngest.createFunction(
  {
    id: 'render-ffmpeg',
    name: 'FFmpeg 렌더링',
    retries: 1,
    concurrency: { limit: 3 },
    timeouts: { finish: '30m' },
  },
  { event: 'render.ffmpeg.requested' },
  async ({ event, step }) => {
    const { jobId, projectId, userId, audioUrl, subtitleContent, timeline, exportSettings } =
      (event as FFmpegRequestedEvent).data;

    const supabase = getSupabaseAdmin();
    const workDir = path.join(os.tmpdir(), `render_${crypto.randomUUID()}`);
    fs.mkdirSync(workDir, { recursive: true });

    const tempFiles: string[] = [workDir];

    try {
      // Step 1: 파일 다운로드
      const downloadResult = await step.run('download-files', async () => {
        // 오디오 다운로드
        const audioPath = path.join(workDir, 'audio.wav');
        await downloadFile(audioUrl, audioPath);
        console.log(`[ffmpeg-worker] 오디오 다운로드 완료: ${audioPath}`);

        // 미디어 파일 다운로드
        const updatedTimeline: TimelineEntry[] = [];
        for (const entry of timeline) {
          if (!entry.media_url) {
            updatedTimeline.push({ ...entry });
            continue;
          }

          const ext = entry.media_type === 'image' ? '.jpg' : '.mp4';
          const mediaPath = path.join(workDir, `scene_${entry.scene_number}${ext}`);
          await downloadFile(entry.media_url, mediaPath);
          updatedTimeline.push({ ...entry, local_media_path: mediaPath });
        }

        return { audioPath, timeline: updatedTimeline };
      });

      // Step 2: FFmpeg 렌더링
      const renderResult = await step.run('ffmpeg-render', async () => {
        const settings: RenderSettings = {
          resolution: exportSettings.resolution,
          fps: exportSettings.fps ?? 30,
          format: exportSettings.format ?? 'mp4',
        };

        const finalPath = await renderVideo(
          downloadResult.timeline,
          downloadResult.audioPath,
          subtitleContent,
          settings
        );
        tempFiles.push(finalPath);
        console.log(`[ffmpeg-worker] 렌더링 완료: ${finalPath}`);
        return { finalPath };
      });

      // Step 3: 완성 영상 업로드
      await step.run('upload-result', async () => {
        const storagePath = `video/${projectId}/${jobId}.mp4`;
        const fileBuffer = fs.readFileSync(renderResult.finalPath);

        const { error: uploadError } = await supabase.storage
          .from('renders')
          .upload(storagePath, fileBuffer, {
            contentType: 'video/mp4',
            upsert: true,
          });

        if (uploadError) throw new Error(`영상 업로드 실패: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from('renders').getPublicUrl(storagePath);

        // output_expires: 7일 후
        const outputExpires = new Date();
        outputExpires.setDate(outputExpires.getDate() + 7);

        // projects 업데이트 — Prisma 없이 Supabase REST 사용
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            output_url: urlData.publicUrl,
            output_expires: outputExpires.toISOString(),
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (projectError) throw new Error(`프로젝트 업데이트 실패: ${projectError.message}`);

        // job 완료 처리
        const { error: jobError } = await supabase
          .from('jobs')
          .update({
            status: 'completed',
            progress: 100,
            current_step: 3,
            completed_at: new Date().toISOString(),
            output_data: { storagePath, outputUrl: urlData.publicUrl },
          })
          .eq('id', jobId);

        if (jobError) throw new Error(`job 업데이트 실패: ${jobError.message}`);

        // 사용량 카운터 증가 (실패해도 렌더링 성공은 유지)
        try {
          const { error: rpcError } = await supabase.rpc('increment_monthly_renders', { user_id: userId });
          if (rpcError) console.warn('[ffmpeg-worker] 사용량 카운터 증가 실패:', rpcError.message);
        } catch {
          // 무시
        }

        console.log(`[ffmpeg-worker] 업로드 완료: ${urlData.publicUrl}`);
        return { outputUrl: urlData.publicUrl };
      });

      return { success: true, jobId };
    } catch (err) {
      console.error('[ffmpeg-worker] 렌더링 실패:', err);

      // job 실패 처리
      await supabase
        .from('jobs')
        .update({
          status: 'failed',
          error_message: err instanceof Error ? err.message : String(err),
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      await supabase
        .from('projects')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', projectId);

      throw err;
    } finally {
      // 작업 디렉토리 정리
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
      } catch {
        // 무시
      }
    }
  }
);
