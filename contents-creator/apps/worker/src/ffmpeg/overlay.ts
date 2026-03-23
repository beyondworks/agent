// 자막 + 오디오 오버레이 및 최종 인코딩

import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import fs from 'node:fs';

interface OverlaySettings {
  resolution: string;
  fps: number;
  format: string;
}

function getResolutionDimensions(resolution: string): { width: number; height: number } {
  switch (resolution) {
    case '4k':
      return { width: 3840, height: 2160 };
    case '720p':
      return { width: 1280, height: 720 };
    case '1080p':
    default:
      return { width: 1920, height: 1080 };
  }
}

/**
 * 영상에 ASS 자막과 오디오를 합성하여 최종 파일을 생성합니다.
 */
export async function applyOverlay(
  videoPath: string,
  audioPath: string,
  subtitleContent: string,
  settings: OverlaySettings
): Promise<string> {
  const { width, height } = getResolutionDimensions(settings.resolution);
  const outputPath = path.join(os.tmpdir(), `final_${crypto.randomUUID()}.mp4`);

  // ASS 자막 내용을 임시 파일에 저장
  const subtitlePath = path.join(os.tmpdir(), `sub_${crypto.randomUUID()}.ass`);
  fs.writeFileSync(subtitlePath, subtitleContent, 'utf-8');

  // ASS 경로에 특수문자가 있으면 이스케이프
  const escapedSubPath = subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\:');

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .complexFilter([
        // 자막 오버레이 + 해상도 조절
        `[0:v]ass='${escapedSubPath}',scale=${width}:${height},fps=${settings.fps}[vout]`,
        // 오디오 패스스루
        `[1:a]aformat=sample_rates=44100:channel_layouts=stereo[aout]`,
      ])
      .outputOptions([
        '-map', '[vout]',
        '-map', '[aout]',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
      ])
      .output(outputPath)
      .on('end', () => {
        fs.rmSync(subtitlePath, { force: true });
        resolve(outputPath);
      })
      .on('error', (err) => {
        fs.rmSync(subtitlePath, { force: true });
        reject(new Error(`applyOverlay 실패: ${err.message}`));
      })
      .run();
  });
}
