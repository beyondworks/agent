// 영상 클립 목록을 트랜지션과 함께 연결

import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import fs from 'node:fs';

interface ClipEntry {
  clip: string;
  transition: string; // 'fade' | 'none' 등
}

const TRANSITION_DURATION = 0.5; // 초

/**
 * 영상 클립들을 xfade 트랜지션으로 연결합니다.
 */
export async function concatClips(clips: ClipEntry[]): Promise<string> {
  if (clips.length === 0) throw new Error('클립이 없습니다.');
  if (clips.length === 1) return clips[0].clip;

  const outputPath = path.join(os.tmpdir(), `concat_${crypto.randomUUID()}.mp4`);

  // 각 클립의 duration을 ffprobe로 확인
  const durations = await Promise.all(
    clips.map(
      (c) =>
        new Promise<number>((resolve, reject) => {
          ffmpeg.ffprobe(c.clip, (err, meta) => {
            if (err) return reject(err);
            resolve(meta.format.duration ?? 0);
          });
        })
    )
  );

  // 클립이 2개 이상일 때 xfade 필터 체인 구성
  // [0:v][1:v]xfade=...[v01]; [v01][2:v]xfade=...[v012]; ...
  let filterChain = '';
  let currentOffset = 0;
  let prevLabel = '[0:v]';

  const filterParts: string[] = [];

  for (let i = 1; i < clips.length; i++) {
    currentOffset += durations[i - 1] - TRANSITION_DURATION;
    const nextLabel = i === clips.length - 1 ? '[vout]' : `[v${i}]`;
    const transition = clips[i - 1].transition === 'none' ? 'fade' : 'xfade';
    filterParts.push(
      `${prevLabel}[${i}:v]${transition}=transition=fade:duration=${TRANSITION_DURATION}:offset=${currentOffset}${nextLabel}`
    );
    prevLabel = nextLabel;
  }

  filterChain = filterParts.join(';');

  return new Promise((resolve, reject) => {
    let cmd = ffmpeg();
    for (const c of clips) {
      cmd = cmd.input(c.clip);
    }

    cmd
      .complexFilter(filterChain)
      .outputOptions([
        '-map', '[vout]',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-an',
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(new Error(`concatClips 실패: ${err.message}`)))
      .run();
  });
}

/**
 * concat demuxer 방식 (트랜지션 없는 단순 연결)
 */
export async function concatClipsSimple(clipPaths: string[]): Promise<string> {
  const listPath = path.join(os.tmpdir(), `list_${crypto.randomUUID()}.txt`);
  const outputPath = path.join(os.tmpdir(), `concat_${crypto.randomUUID()}.mp4`);

  const listContent = clipPaths.map((p) => `file '${p}'`).join('\n');
  fs.writeFileSync(listPath, listContent, 'utf-8');

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(listPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c', 'copy'])
      .output(outputPath)
      .on('end', () => {
        fs.rmSync(listPath, { force: true });
        resolve(outputPath);
      })
      .on('error', (err) => {
        fs.rmSync(listPath, { force: true });
        reject(new Error(`concatClipsSimple 실패: ${err.message}`));
      })
      .run();
  });
}
