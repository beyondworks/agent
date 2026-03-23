export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ApiError, handleApiError } from '@/lib/api-error';
import { checkUsage } from '@/lib/usage-limiter';
import { VOICE_CATALOG } from '@/lib/ai/tts';
import type { SceneData } from '@/remotion/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const { id: projectId } = await context.params;

    // 최신 render job 조회
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('project_id', projectId)
      .eq('job_type', 'render')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ data: job });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw ApiError.unauthorized();

    const { id: projectId } = await context.params;

    // 프로젝트 소유 확인
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, status')
      .eq('id', projectId)
      .single();

    if (projectError || !project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
    if (project.user_id !== user.id) throw ApiError.forbidden();

    // 사용량 제한 체크 (Algorithm 6)
    const usageCheck = await checkUsage(user.id, 'render');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: { message: usageCheck.message, code: 'USAGE_LIMIT_EXCEEDED', remaining: usageCheck.remaining } },
        { status: 429 }
      );
    }

    // 요청 바디 파싱 (선택적)
    const body = await request.json().catch(() => ({}));
    const voiceSettings = body.voiceSettings ?? { language: 'ko', speed: 1.0 };
    const subtitleStyle = body.subtitleStyle ?? {};
    const exportSettings = body.exportSettings ?? { resolution: '1080p', fps: 30, format: 'mp4' };

    // job 생성
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        project_id: projectId,
        job_type: 'render',
        status: 'pending',
        total_steps: 3,
        input_data: { voiceSettings, subtitleStyle, exportSettings },
      })
      .select()
      .single();

    if (jobError || !job) throw new Error(jobError?.message ?? 'Job 생성 실패');

    // 프로젝트 상태를 rendering으로 변경
    const { error: updateError } = await supabase
      .from('projects')
      .update({ status: 'rendering' })
      .eq('id', projectId);

    if (updateError) throw new Error(updateError.message);

    // 씬 데이터 조회
    const { data: scenes } = await supabase
      .from('scenes')
      .select('scene_number, narration, visual_desc, duration_sec, transition, scene_media(url, is_selected)')
      .eq('project_id', projectId)
      .order('scene_number', { ascending: true });

    if (!scenes?.length) {
      throw ApiError.badRequest('렌더링할 씬이 없습니다.');
    }

    // scene_number 기준 중복 제거 (이미지가 있는 행 우선, 없으면 최신)
    const deduped = new Map<number, (typeof scenes)[number]>();
    for (const s of scenes) {
      const existing = deduped.get(s.scene_number);
      if (!existing) {
        deduped.set(s.scene_number, s);
        continue;
      }
      const hasMedia = (row: typeof s) =>
        (row.scene_media as Array<{ url: string; is_selected: boolean }>)?.some(m => m.is_selected) ?? false;
      if (!hasMedia(existing) && hasMedia(s)) {
        deduped.set(s.scene_number, s);
      }
    }

    const sceneData: SceneData[] = [...deduped.values()].map(s => ({
      sceneNumber: s.scene_number,
      narration: s.narration ?? '',
      visualDesc: s.visual_desc ?? '',
      durationSec: Number(s.duration_sec) || 5,
      imageUrl: (s.scene_media as Array<{ url: string; is_selected: boolean }>)?.find(m => m.is_selected)?.url ?? '',
      transition: (s.transition as SceneData['transition']) ?? 'fade',
    }));

    // Voice 설정 해석
    const voiceId = voiceSettings.voiceId ?? 'ko-f-bright';
    const voice = VOICE_CATALOG.find(v => v.id === voiceId) ?? VOICE_CATALOG[0];

    const isShort = exportSettings.resolution === '9:16';
    const propsData = {
      scenes: sceneData,
      subtitleSettings: { fontSize: subtitleStyle.fontSize ?? 42, color: '#ffffff', position: 'bottom' },
      fps: exportSettings.fps ?? 30,
      width: isShort ? 1080 : 1920,
      height: isShort ? 1920 : 1080,
      voice: {
        googleName: voice.googleName ?? 'ko-KR-Chirp3-HD-Aoede',
        languageCode: voice.languageCode,
        speed: voiceSettings.speed ?? 1.0,
        backend: voice.backend,
        localVoiceId: voice.localVoiceId,
        instruction: voice.instruction,
      },
    };

    // props를 임시 파일로 저장
    const propsPath = path.join('/tmp', `render-${job.id}.json`);
    const outputPath = path.join('/tmp', `render-${job.id}.mp4`);
    writeFileSync(propsPath, JSON.stringify(propsData));

    // 백그라운드 렌더 프로세스 시작
    // cwd가 workspace root일 수도, apps/web일 수도 있으므로 양쪽 경로 모두 시도
    let scriptPath = path.resolve(process.cwd(), 'apps/web/scripts/render-video.mjs');
    let workspaceRoot = process.cwd();
    if (!existsSync(scriptPath)) {
      scriptPath = path.resolve(process.cwd(), 'scripts/render-video.mjs');
      workspaceRoot = path.resolve(process.cwd(), '../..');
    }
    const child = spawn('node', [scriptPath, propsPath, outputPath], {
      cwd: workspaceRoot,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.unref();

    // 진행률 메시지 파싱 → DB 업데이트
    const progressDb = createAdminClient();
    let lastProgressUpdate = 0;
    child.stdout?.on('data', (d) => {
      const lines = d.toString().split('\n');
      for (const line of lines) {
        if (!line.startsWith('[PROGRESS]')) continue;
        try {
          const payload = JSON.parse(line.slice('[PROGRESS] '.length));
          const now = Date.now();
          // DB 업데이트는 2초 간격으로 제한
          if (now - lastProgressUpdate > 2000) {
            lastProgressUpdate = now;
            progressDb.from('jobs').update({
              status: 'processing',
              progress: payload.progress ?? 0,
              error_message: payload.message ?? '',
            }).eq('id', job.id).then();
          }
        } catch {}
      }
    });

    // 렌더 완료 시 업로드 + Job 업데이트
    let stderr = '';
    child.stderr?.on('data', (d) => { stderr += d.toString(); });

    child.on('close', async (code) => {
      try {
        const adminSupabase = createAdminClient();
        if (code === 0) {
          // MP4 업로드
          const mp4Buffer = readFileSync(outputPath);
          const fileSizeMB = mp4Buffer.length / 1024 / 1024;
          console.log(`[Render] MP4 크기: ${fileSizeMB.toFixed(1)}MB`);
          const storagePath = `${projectId}/renders/${job.id}.mp4`;
          const { error: uploadError } = await adminSupabase.storage.from('media').upload(storagePath, mp4Buffer, {
            contentType: 'video/mp4',
            upsert: true,
          });
          if (uploadError) {
            console.error('[Render] Storage 업로드 실패:', uploadError.message);
            await adminSupabase.from('jobs').update({
              status: 'failed',
              error_message: `업로드 실패: ${uploadError.message} (${fileSizeMB.toFixed(0)}MB)`,
            }).eq('id', job.id);
            return;
          }
          const { data: urlData } = adminSupabase.storage.from('media').getPublicUrl(storagePath);

          await adminSupabase.from('jobs').update({
            status: 'completed',
            progress: 100,
            completed_at: new Date().toISOString(),
            output_data: { videoUrl: urlData.publicUrl, storagePath },
          }).eq('id', job.id);

          await adminSupabase.from('projects').update({ status: 'completed' }).eq('id', projectId);

          // 임시 파일 정리
          try { unlinkSync(propsPath); unlinkSync(outputPath); } catch {}
        } else {
          await adminSupabase.from('jobs').update({
            status: 'failed',
            error_message: stderr.slice(-500) || `렌더 프로세스 종료 코드: ${code}`,
          }).eq('id', job.id);
        }
      } catch (e) {
        console.error('[Render] 후처리 실패:', e);
      }
    });

    return NextResponse.json({ jobId: job.id }, { status: 202 });
  } catch (error) {
    return handleApiError(error);
  }
}
