// Algorithm 5: FFmpeg 렌더링 파이프라인 총괄

import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { imageToVideo } from './image-to-video.js';
import { trimOrLoop } from './video-clip.js';
import { concatClips, concatClipsSimple } from './concat.js';
import { applyOverlay } from './overlay.js';

export interface TimelineEntry {
  scene_id: string;
  scene_number: number;
  audio_start: number;
  audio_end: number;
  transition: string;
  media_type: 'image' | 'video';
  media_url: string | null;
  media_storage_path: string | null;
  local_media_path?: string; // Worker가 다운로드 후 세팅
}

export interface RenderSettings {
  resolution: string;
  fps: number;
  format: string;
}

/**
 * 타임라인, 오디오, 자막을 받아 최종 MP4 파일을 생성합니다.
 */
export async function renderVideo(
  timeline: TimelineEntry[],
  audioPath: string,
  subtitleContent: string,
  settings: RenderSettings
): Promise<string> {
  console.log(`[render] 시작: ${timeline.length}개 씬, resolution=${settings.resolution}`);

  // 1단계: 씬별 클립 준비
  const clipEntries: Array<{ clip: string; transition: string }> = [];
  const tempFiles: string[] = [];

  for (const entry of timeline) {
    const duration = entry.audio_end - entry.audio_start;
    if (duration <= 0) continue;

    const mediaPath = entry.local_media_path;
    if (!mediaPath) {
      console.warn(`[render] scene ${entry.scene_number}: 미디어 없음, 스킵`);
      continue;
    }

    let clipPath: string;
    if (entry.media_type === 'image') {
      clipPath = await imageToVideo(mediaPath, duration, { resolution: settings.resolution });
    } else {
      clipPath = await trimOrLoop(mediaPath, duration);
    }

    tempFiles.push(clipPath);
    clipEntries.push({ clip: clipPath, transition: entry.transition });
    console.log(`[render] scene ${entry.scene_number} 클립 준비 완료: ${clipPath}`);
  }

  if (clipEntries.length === 0) {
    throw new Error('렌더링할 유효한 씬 클립이 없습니다.');
  }

  // 2단계: 씬 연결
  let rawVideoPath: string;
  try {
    const hasTransitions = clipEntries.some((c) => c.transition !== 'none');
    if (hasTransitions && clipEntries.length > 1) {
      rawVideoPath = await concatClips(clipEntries);
    } else {
      rawVideoPath = await concatClipsSimple(clipEntries.map((c) => c.clip));
    }
    tempFiles.push(rawVideoPath);
    console.log(`[render] 씬 연결 완료: ${rawVideoPath}`);
  } catch (err) {
    // xfade 실패 시 단순 연결로 폴백
    console.warn('[render] xfade 실패, 단순 연결로 폴백:', String(err));
    rawVideoPath = await concatClipsSimple(clipEntries.map((c) => c.clip));
    tempFiles.push(rawVideoPath);
  }

  // 3단계: 자막 + 오디오 오버레이
  const finalPath = await applyOverlay(rawVideoPath, audioPath, subtitleContent, settings);
  console.log(`[render] 최종 영상 생성 완료: ${finalPath}`);

  // 임시 파일 정리 (최종 파일 제외)
  for (const tmpFile of tempFiles) {
    try {
      fs.rmSync(tmpFile, { force: true });
    } catch {
      // 무시
    }
  }

  return finalPath;
}
