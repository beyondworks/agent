#!/usr/bin/env python3
"""FFmpeg 렌더러 — 씬 이미지 + 오디오 + 자막 → MP4."""
import os
import subprocess

PROJECT = "/Users/yoogeon/Agents/contents agent/projects/2026-03-23-fireship-agent-benchmark"
SCENES_DIR = os.path.join(PROJECT, "scenes")
AUDIO = os.path.join(PROJECT, "voice", "narration.wav")
SRT = os.path.join(PROJECT, "subtitles", "final.srt")
OUTPUT = os.path.join(PROJECT, "output", "render_ffmpeg.mp4")

# 씬별 Duration (초) - 대본 기준
SCENE_DURATIONS = [15, 24, 29, 29, 26, 27, 31]  # total 181초
FPS = 30

os.makedirs(os.path.join(PROJECT, "output"), exist_ok=True)

# 1. 각 씬 이미지를 해당 duration만큼 영상으로 변환
segments = []
for i, dur in enumerate(SCENE_DURATIONS, 1):
    img = os.path.join(SCENES_DIR, f"scene-{i:03d}.png")
    seg = os.path.join(SCENES_DIR, f"_seg_{i:03d}.mp4")
    segments.append(seg)
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", img,
        "-c:v", "libx264",
        "-t", str(dur),
        "-pix_fmt", "yuv420p",
        "-vf", f"scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#001C2F",
        "-r", str(FPS),
        "-preset", "fast",
        seg
    ]
    print(f"[{i}/7] scene-{i:03d}.png → {dur}초 영상")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  에러: {r.stderr[-200:]}")

# 2. 세그먼트 결합
concat_file = os.path.join(SCENES_DIR, "_concat.txt")
with open(concat_file, "w") as f:
    for seg in segments:
        f.write(f"file '{seg}'\n")

merged = os.path.join(SCENES_DIR, "_merged.mp4")
print("\n영상 세그먼트 결합 중...")
subprocess.run([
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", concat_file, "-c", "copy", merged
], capture_output=True, text=True)

# 3. 오디오 + 자막 합성
print("오디오 + 자막 오버레이...")
cmd = [
    "ffmpeg", "-y",
    "-i", merged,
    "-i", AUDIO,
    "-vf", f"subtitles='{SRT}':force_style='FontSize=22,PrimaryColour=&Hf1f1f1,BackColour=&H80000000,BorderStyle=4,Outline=0,Shadow=0,MarginV=40,FontName=AppleSDGothicNeo-Bold'",
    "-c:v", "libx264",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    "-preset", "fast",
    OUTPUT
]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode != 0:
    print(f"에러: {r.stderr[-500:]}")
else:
    size_mb = os.path.getsize(OUTPUT) / (1024*1024)
    # duration 확인
    dur_cmd = ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", OUTPUT]
    dur_r = subprocess.run(dur_cmd, capture_output=True, text=True)
    duration = float(dur_r.stdout.strip()) if dur_r.stdout.strip() else 0
    print(f"\n완료: {OUTPUT}")
    print(f"  크기: {size_mb:.1f}MB / 길이: {duration:.1f}초")

# cleanup
for seg in segments:
    os.remove(seg) if os.path.exists(seg) else None
os.remove(merged) if os.path.exists(merged) else None
os.remove(concat_file) if os.path.exists(concat_file) else None
