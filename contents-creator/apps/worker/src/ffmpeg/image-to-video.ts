// 이미지를 Ken Burns 효과가 적용된 영상 클립으로 변환

import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

interface ImageToVideoOptions {
  resolution: string; // '1080p' | '720p' | '4k'
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
 * 이미지를 지정된 길이의 영상 클립으로 변환합니다 (Ken Burns 효과 적용).
 */
export async function imageToVideo(
  imagePath: string,
  durationSec: number,
  options: ImageToVideoOptions = { resolution: '1080p' }
): Promise<string> {
  const { width, height } = getResolutionDimensions(options.resolution);
  const outputPath = path.join(os.tmpdir(), `clip_${crypto.randomUUID()}.mp4`);

  // Ken Burns: 1.05배 줌인으로 시작해서 서서히 확대
  // zoompan 필터: z=줌, x/y=패닝, d=프레임수, s=출력크기
  const fps = 30;
  const totalFrames = Math.ceil(durationSec * fps);
  const zoomFilter = [
    `zoompan=z='min(zoom+0.0005,1.1)':`,
    `x='iw/2-(iw/zoom/2)':`,
    `y='ih/2-(ih/zoom/2)':`,
    `d=${totalFrames}:`,
    `s=${width}x${height}:`,
    `fps=${fps}`,
  ]
    .join('')
    .replace(/\n/g, '');

  return new Promise((resolve, reject) => {
    ffmpeg(imagePath)
      .inputOptions(['-loop', '1'])
      .inputOptions(['-framerate', String(fps)])
      .videoFilters(zoomFilter)
      .outputOptions([
        '-t', String(durationSec),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-an',
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(new Error(`imageToVideo 실패: ${err.message}`)))
      .run();
  });
}
