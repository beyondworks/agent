/**
 * 로컬 FFmpeg 렌더링 테스트
 * 실행: npx tsx scripts/local-render-test.ts
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ID = '42220cbb-23d2-4741-9d71-c85b02f0432a';
const SUPABASE_URL = 'https://xsjovkusodmqijvyopoe.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzam92a3Vzb2RtcWlqdnlvcG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk0NTQzOSwiZXhwIjoyMDg3NTIxNDM5fQ.OFeM3P9djJh9grfzG5a1AelFGVBsfE4jV9tdQFXXnCw';

const OUT_DIR = join(process.cwd(), 'render-output');

interface Scene {
  scene_number: number;
  narration: string;
  duration_sec: number;
  scene_media: Array<{ url: string; media_type: string }>;
}

async function fetchScenes(): Promise<Scene[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/scenes?project_id=eq.${PROJECT_ID}&order=scene_number&select=scene_number,narration,duration_sec,scene_media(url,media_type)`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  return res.json();
}

async function downloadImage(url: string, outPath: string) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buffer);
  console.log(`  Downloaded: ${outPath}`);
}

function generateTTS(text: string, outPath: string): number {
  try {
    execFileSync('edge-tts', [
      '--voice', 'ko-KR-SunHiNeural',
      '--text', text,
      '--write-media', outPath,
    ], { timeout: 30000, stdio: 'pipe' });

    const duration = execFileSync('ffprobe', [
      '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', outPath,
    ], { encoding: 'utf-8', timeout: 10000 }).trim();

    const dur = parseFloat(duration);
    console.log(`  TTS: ${dur.toFixed(1)}s → ${outPath}`);
    return dur;
  } catch {
    console.log(`  TTS 실패, 기본 duration 사용`);
    return 0;
  }
}

function formatASSTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function generateASS(scenes: Array<{ narration: string; start: number; end: number }>): string {
  const header = `[Script Info]
Title: VideoForge Auto Subtitle
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Apple SD Gothic Neo,52,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,0,2,30,30,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

  const events = scenes.map(s => {
    const words = s.narration.split(/\s+/);
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 4) {
      chunks.push(words.slice(i, i + 4).join(' '));
    }
    const chunkDuration = (s.end - s.start) / chunks.length;
    return chunks.map((chunk, i) => {
      const cs = formatASSTime(s.start + i * chunkDuration);
      const ce = formatASSTime(s.start + (i + 1) * chunkDuration);
      return `Dialogue: 0,${cs},${ce},Default,,0,0,0,,${chunk}`;
    }).join('\n');
  });

  return `${header}\n${events.join('\n')}`;
}

function ffmpeg(args: string[]) {
  execFileSync('ffmpeg', args, { timeout: 120000, stdio: 'pipe' });
}

async function main() {
  console.log('=== VideoForge 로컬 렌더링 테스트 ===\n');

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const scenesDir = join(OUT_DIR, 'scenes');
  if (!existsSync(scenesDir)) mkdirSync(scenesDir, { recursive: true });

  // 1. 씬 데이터
  console.log('1. 씬 데이터 로딩...');
  const scenes = await fetchScenes();
  console.log(`   ${scenes.length}개 씬\n`);

  // 2. 이미지 다운로드 + TTS
  console.log('2. 이미지 + TTS 생성...');
  const sceneData: Array<{
    number: number; imagePath: string; audioPath: string;
    narration: string; audioDuration: number;
  }> = [];

  for (const scene of scenes) {
    console.log(`\n  --- 씬 ${scene.scene_number} ---`);
    const imgUrl = scene.scene_media?.[0]?.url;
    if (!imgUrl) { console.log('  ⚠ 이미지 없음'); continue; }

    const imagePath = join(scenesDir, `scene_${scene.scene_number}.png`);
    const audioPath = join(scenesDir, `scene_${scene.scene_number}.mp3`);

    await downloadImage(imgUrl, imagePath);
    const audioDuration = generateTTS(scene.narration, audioPath);

    sceneData.push({
      number: scene.scene_number, imagePath, audioPath,
      narration: scene.narration,
      audioDuration: audioDuration > 0 ? audioDuration : scene.duration_sec,
    });
  }

  if (sceneData.length === 0) { console.error('씬 없음'); process.exit(1); }

  // 3. ASS 자막
  console.log('\n3. ASS 자막 생성...');
  let currentTime = 0;
  const subtitleData = sceneData.map(s => {
    const start = currentTime;
    const end = currentTime + s.audioDuration;
    currentTime = end + 0.3;
    return { narration: s.narration, start, end };
  });
  const assPath = join(OUT_DIR, 'subtitles.ass');
  writeFileSync(assPath, generateASS(subtitleData), 'utf-8');
  console.log(`   ${assPath}`);

  // 4. 씬별 클립 생성
  console.log('\n4. FFmpeg 씬별 클립...');
  const clipPaths: string[] = [];

  for (const scene of sceneData) {
    const clipPath = join(scenesDir, `clip_${scene.number}.mp4`);
    const hasAudio = existsSync(scene.audioPath) && scene.audioDuration > 0;
    const dur = Math.ceil(scene.audioDuration * 30);

    if (hasAudio) {
      ffmpeg([
        '-y', '-loop', '1', '-i', scene.imagePath, '-i', scene.audioPath,
        '-vf', `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,zoompan=z='min(zoom+0.001,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${dur}:s=1080x1920:fps=30`,
        '-c:v', 'libx264', '-tune', 'stillimage', '-c:a', 'aac', '-b:a', '192k',
        '-shortest', '-pix_fmt', 'yuv420p', clipPath,
      ]);
    } else {
      ffmpeg([
        '-y', '-loop', '1', '-i', scene.imagePath, '-t', String(scene.audioDuration),
        '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', clipPath,
      ]);
    }

    console.log(`   씬 ${scene.number} (${scene.audioDuration.toFixed(1)}s) ✓`);
    clipPaths.push(clipPath);
  }

  // 5. 클립 연결
  console.log('\n5. 클립 연결...');
  const concatPath = join(OUT_DIR, 'concat.txt');
  writeFileSync(concatPath, clipPaths.map(p => `file '${p}'`).join('\n'), 'utf-8');

  const rawPath = join(OUT_DIR, 'raw_video.mp4');
  ffmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', concatPath, '-c', 'copy', rawPath]);
  console.log(`   ${rawPath}`);

  // 6. 자막 오버레이
  console.log('\n6. 자막 오버레이...');
  const finalPath = join(OUT_DIR, 'final_video.mp4');
  ffmpeg([
    '-y', '-i', rawPath, '-vf', `ass=${assPath}`,
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'copy', finalPath,
  ]);

  // 7. 결과
  const info = execFileSync('ffprobe', [
    '-v', 'quiet', '-show_entries', 'format=duration,size', '-of', 'json', finalPath,
  ], { encoding: 'utf-8' });
  const meta = JSON.parse(info);
  const duration = parseFloat(meta.format.duration);
  const sizeMB = (parseInt(meta.format.size) / 1024 / 1024).toFixed(1);

  console.log('\n=== 렌더링 완료! ===');
  console.log(`📁 ${finalPath}`);
  console.log(`⏱  ${duration.toFixed(1)}초`);
  console.log(`📦 ${sizeMB}MB`);
  console.log(`🎬 1080x1920 (9:16 숏폼)`);
  console.log(`\n재생: open "${finalPath}"`);
}

main().catch(console.error);
