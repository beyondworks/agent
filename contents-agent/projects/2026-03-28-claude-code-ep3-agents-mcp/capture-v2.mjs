import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { mkdirSync, existsSync, readdirSync, unlinkSync, rmdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

// 18개 세그먼트: 각 씬을 2등분 (오디오 duration 기반 배분)
// 오디오 씬: 10.9 / 22.7 / 36.9 / 27.1 / 26.8 / 35.1 / 39.5 / 15.3 / 31.2
// 오디오 파형 기준 duration (씬별 2등분)
const SEGMENTS = [
  { file: 'seg-01.html', dur: 7.0 },    // Scene 1 (14.1s)
  { file: 'seg-02.html', dur: 7.1 },
  { file: 'seg-03.html', dur: 18.4 },   // Scene 2 (36.8s)
  { file: 'seg-04.html', dur: 18.4 },
  { file: 'seg-05.html', dur: 26.6 },   // Scene 3 (53.2s)
  { file: 'seg-06.html', dur: 26.6 },
  { file: 'seg-07.html', dur: 26.9 },   // Scene 4 (53.7s)
  { file: 'seg-08.html', dur: 26.8 },
  { file: 'seg-09.html', dur: 18.7 },   // Scene 5 (37.4s)
  { file: 'seg-10.html', dur: 18.7 },
  { file: 'seg-11.html', dur: 24.8 },   // Scene 6 (49.5s)
  { file: 'seg-12.html', dur: 24.7 },
  { file: 'seg-13.html', dur: 24.0 },   // Scene 7 (48.0s)
  { file: 'seg-14.html', dur: 24.0 },
  { file: 'seg-15.html', dur: 16.1 },   // Scene 8 (32.2s)
  { file: 'seg-16.html', dur: 16.1 },
  { file: 'seg-17.html', dur: 19.2 },   // Scene 9 (38.5s)
  { file: 'seg-18.html', dur: 19.3 },
];

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

const DIR = resolve(import.meta.dirname || '.');
const SCENES_DIR = join(DIR, 'scenes-v2');
const OUTPUT_DIR = join(DIR, 'output-v2');

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

async function captureSegment(browser, seg, index) {
  const name = seg.file.replace('.html', '');
  const totalFrames = Math.round(FPS * seg.dur);
  const framesDir = join(DIR, `_frames_${name}`);
  const mp4File = join(OUTPUT_DIR, `${name}.mp4`);

  if (existsSync(mp4File)) {
    console.log(`  [${index + 1}/${SEGMENTS.length}] ${seg.file} — 스킵`);
    return mp4File;
  }

  if (!existsSync(framesDir)) mkdirSync(framesDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  await page.goto(`file://${join(SCENES_DIR, seg.file)}`, { waitUntil: 'networkidle' });

  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.getAnimations({ subtree: true }).forEach(a => {
      if (a.animationName === 'sceneOut' || a.effect?.getKeyframes?.().some(k => k.offset === 1 && parseFloat(k.opacity) === 0 && k.transform?.includes('0.95'))) {
        a.cancel();
        return;
      }
      a.pause();
    });
  });

  const FADE_FRAMES = 15;
  console.log(`  [${index + 1}/${SEGMENTS.length}] ${seg.file} (${totalFrames}f, ${seg.dur}s)`);

  for (let i = 0; i < totalFrames; i++) {
    const timeMs = (i / FPS) * 1000;
    await page.evaluate((t) => {
      document.getAnimations({ subtree: true }).forEach(a => { a.currentTime = t; });
    }, timeMs);

    const framesLeft = totalFrames - i;
    if (framesLeft <= FADE_FRAMES) {
      const opacity = framesLeft / FADE_FRAMES;
      await page.evaluate((op) => { document.body.style.opacity = op; }, opacity);
    }

    const padded = String(i).padStart(5, '0');
    await page.screenshot({
      path: join(framesDir, `frame_${padded}.png`),
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    if (i % 30 === 0) process.stdout.write(`    ${i}/${totalFrames}\r`);
  }
  await page.close();

  execFileSync('ffmpeg', [
    '-y', '-framerate', String(FPS),
    '-i', join(framesDir, 'frame_%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-crf', '18', '-preset', 'fast',
    mp4File,
  ], { stdio: 'pipe' });

  console.log(`    done: ${name}.mp4`);
  for (const f of readdirSync(framesDir)) unlinkSync(join(framesDir, f));
  rmdirSync(framesDir);
  return mp4File;
}

async function main() {
  const totalSec = SEGMENTS.reduce((s, x) => s + x.dur, 0);
  console.log(`=== EP3 v2 캡처: ${SEGMENTS.length}개 세그먼트, ${totalSec.toFixed(1)}초 ===\n`);

  const browser = await chromium.launch({ headless: true });
  const mp4Files = [];

  for (let i = 0; i < SEGMENTS.length; i++) {
    const mp4 = await captureSegment(browser, SEGMENTS[i], i);
    mp4Files.push(mp4);
  }
  await browser.close();

  const concatList = join(OUTPUT_DIR, 'concat.txt');
  writeFileSync(concatList, mp4Files.map(f => `file '${f}'`).join('\n'));

  const finalFile = join(OUTPUT_DIR, 'ep3-agents-mcp-v2.mp4');
  execFileSync('ffmpeg', [
    '-y', '-f', 'concat', '-safe', '0',
    '-i', concatList, '-c', 'copy',
    finalFile,
  ], { stdio: 'pipe' });

  console.log(`\n=== 완료: ${finalFile} (${totalSec.toFixed(1)}초) ===`);
}

main().catch(console.error);
