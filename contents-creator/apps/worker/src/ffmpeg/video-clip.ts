// 영상 클립 길이 조절 — 짧으면 루프, 길면 트림

import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

/**
 * 영상 길이를 가져옵니다.
 */
function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(new Error(`ffprobe 실패: ${err.message}`));
      resolve(metadata.format.duration ?? 0);
    });
  });
}

/**
 * 영상이 targetDuration보다 짧으면 루프, 길면 트림합니다.
 */
export async function trimOrLoop(videoPath: string, targetDuration: number): Promise<string> {
  const outputPath = path.join(os.tmpdir(), `clip_${crypto.randomUUID()}.mp4`);
  const sourceDuration = await getVideoDuration(videoPath);

  return new Promise((resolve, reject) => {
    if (sourceDuration >= targetDuration) {
      // 트림
      ffmpeg(videoPath)
        .outputOptions(['-t', String(targetDuration), '-c', 'copy'])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error(`trim 실패: ${err.message}`)))
        .run();
    } else {
      // 루프: stream_loop -1로 무한 루프 후 target 길이만큼 출력
      ffmpeg(videoPath)
        .inputOptions(['-stream_loop', '-1'])
        .outputOptions([
          '-t', String(targetDuration),
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-crf', '18',
          '-pix_fmt', 'yuv420p',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error(`loop 실패: ${err.message}`)))
        .run();
    }
  });
}
