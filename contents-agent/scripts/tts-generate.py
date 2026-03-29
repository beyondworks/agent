#!/usr/bin/env python3
"""
tts-generate.py — TTS 청크 파일로부터 음성을 자동 생성 (Voicebox 내부 API)

Voicebox 앱 실행 시 내부 포트에서 API 사용 가능.
씬별 WAV 파일 + SRT 자막 파일을 생성한다.

Usage:
  python3 tts-generate.py config.json

config.json 예시:
{
  "chunks_file": "script/tts-chunks.md",
  "output_dir": "voice",
  "profile_id": "6d6070e5-d965-43eb-8b8f-401ab9d5504e",
  "language": "ko",
  "padding_ms": 300,
  "gap_within_scene_ms": 400,
  "gap_between_scene_ms": 800
}
"""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

import requests


def find_voicebox_port():
    """실행 중인 Voicebox 서버 포트를 찾는다."""
    r = subprocess.run(
        ["ps", "aux"], capture_output=True, text=True,
    )
    for line in r.stdout.split("\n"):
        if "voicebox-server" in line and "--port" in line:
            m = re.search(r"--port\s+(\d+)", line)
            if m:
                return int(m.group(1))
    return None


def parse_chunks_md(filepath):
    """tts-chunks.md를 파싱하여 [{scene, chunk_num, text}, ...] 반환"""
    content = Path(filepath).read_text(encoding="utf-8")
    chunks = []
    current_scene = ""

    for line in content.split("\n"):
        scene_match = re.match(r"^## (Scene \d+:.+)", line)
        if scene_match:
            current_scene = scene_match.group(1)
            continue

        chunk_match = re.match(r"\*\*청크 (\d+)\*\*\s*\(\d+자\)\s*(.+)", line)
        if chunk_match:
            num = int(chunk_match.group(1))
            text = chunk_match.group(2).strip()
            # (...) 패턴 유지 — Voicebox 끝음 끊김 방지용
            if text:
                chunks.append({
                    "scene": current_scene,
                    "chunk_num": num,
                    "text": text,
                })

    return chunks


def generate_and_wait(server_url, profile_id, text, language, timeout=120):
    """Voicebox API로 TTS 생성하고 완료까지 대기. 오디오 파일 경로 반환."""
    payload = {
        "profile_id": profile_id,
        "text": text,
        "language": language,
    }

    resp = requests.post(f"{server_url}/generate", json=payload, timeout=30)
    if resp.status_code != 200:
        raise RuntimeError(f"Generate 실패 (HTTP {resp.status_code}): {resp.text[:200]}")

    gen = resp.json()
    gen_id = gen["id"]

    # 완료까지 폴링 (SSE 엔드포인트를 일반 GET으로 폴링)
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            sr = requests.get(f"{server_url}/generate/{gen_id}/status", timeout=10, stream=True)
            for line in sr.iter_lines(decode_unicode=True):
                if line.startswith("data:"):
                    data = json.loads(line[5:].strip())
                    if data.get("status") == "completed":
                        # history에서 오디오 경로 획득
                        hist = requests.get(f"{server_url}/history/{gen_id}", timeout=10).json()
                        return hist["audio_path"], hist["duration"]
                    elif data.get("status") == "error":
                        raise RuntimeError(f"TTS 에러: {data.get('error')}")
            sr.close()
        except requests.exceptions.ChunkedEncodingError:
            pass
        time.sleep(1)

    raise RuntimeError(f"TTS 타임아웃 ({timeout}s)")


def add_padding(wav_path, padding_ms=300):
    """WAV 끝에 무음 패딩 추가"""
    padded = wav_path + ".padded.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-i", wav_path, "-af", f"apad=pad_dur={padding_ms / 1000}",
         "-c:a", "pcm_s16le", padded],
        capture_output=True,
    )
    os.replace(padded, wav_path)


def get_duration_sec(filepath):
    """ffprobe로 파일 길이(초) 반환"""
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", filepath],
        capture_output=True, text=True,
    )
    return float(json.loads(r.stdout)["format"]["duration"])


def make_silence(path, duration_ms, sample_rate=24000):
    """무음 WAV 파일 생성"""
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i",
         f"anullsrc=r={sample_rate}:cl=mono:d={duration_ms / 1000}",
         "-c:a", "pcm_s16le", path],
        capture_output=True,
    )


def concat_wavs(wav_files, output_path, gaps=None):
    """WAV 파일들을 갭과 함께 합본."""
    concat_list = "/tmp/tts_concat.txt"
    with open(concat_list, "w") as f:
        for i, wav in enumerate(wav_files):
            f.write(f"file '{wav}'\n")
            if gaps and i < len(gaps) and gaps[i]:
                f.write(f"file '{gaps[i]}'\n")

    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
         "-c:a", "pcm_s16le", output_path],
        capture_output=True,
    )


def generate_srt(chunks, chunk_durations, gap_within_ms, gap_between_ms, scene_boundaries, output_path):
    """청크별 타이밍으로 SRT 파일 생성"""
    cursor_ms = 0
    srt_lines = []

    def fmt(ms):
        h = ms // 3600000
        m = (ms % 3600000) // 60000
        s = (ms % 60000) // 1000
        ms_r = ms % 1000
        return f"{h:02d}:{m:02d}:{s:02d},{ms_r:03d}"

    for i, chunk in enumerate(chunks):
        dur_ms = int(chunk_durations[i] * 1000)
        start_ms = cursor_ms
        end_ms = cursor_ms + dur_ms

        # SRT 텍스트에서는 (...) 제거
        srt_text = re.sub(r"\(\.\.\.\)$", "", chunk["text"]).strip()

        srt_lines.append(f"{i + 1}")
        srt_lines.append(f"{fmt(start_ms)} --> {fmt(end_ms)}")
        srt_lines.append(srt_text)
        srt_lines.append("")

        cursor_ms = end_ms
        if i < len(chunks) - 1:
            if i + 1 in scene_boundaries:
                cursor_ms += gap_between_ms
            else:
                cursor_ms += gap_within_ms

    Path(output_path).write_text("\n".join(srt_lines), encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    config_path = Path(sys.argv[1]).resolve()
    with open(config_path) as f:
        config = json.load(f)

    config_dir = config_path.parent
    chunks_file = config_dir / config["chunks_file"]
    output_dir = config_dir / config["output_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)

    profile_id = config["profile_id"]
    language = config.get("language", "ko")
    padding_ms = config.get("padding_ms", 300)
    gap_within_ms = config.get("gap_within_scene_ms", 400)
    gap_between_ms = config.get("gap_between_scene_ms", 800)

    # Voicebox 포트 자동 탐지
    port = find_voicebox_port()
    if not port:
        print("Voicebox 앱이 실행 중이 아닙니다. 앱을 먼저 실행하세요.")
        sys.exit(1)

    server = f"http://localhost:{port}"
    print(f"Voicebox 서버: {server}")

    # 서버 연결 확인
    try:
        r = requests.get(f"{server}/health", timeout=5)
        print(f"서버 상태: 정상\n")
    except requests.ConnectionError:
        print(f"Voicebox 서버에 연결할 수 없습니다: {server}")
        sys.exit(1)

    # 파싱
    chunks = parse_chunks_md(str(chunks_file))
    print(f"=== TTS 생성: {len(chunks)} 청크 ===\n")

    # 이미 생성된 청크 스킵 (이어하기 지원)
    skip_until = 0
    for chunk in chunks:
        wav_path = output_dir / f"chunk-{chunk['chunk_num']:03d}.wav"
        if wav_path.exists() and wav_path.stat().st_size > 1000:
            skip_until = chunk["chunk_num"]
        else:
            break

    if skip_until > 0:
        print(f"  (chunk-{skip_until:03d}까지 이미 생성됨, 이어서 진행)\n")

    # 씬 경계 계산
    scene_boundaries = set()
    for i in range(1, len(chunks)):
        if chunks[i]["scene"] != chunks[i - 1]["scene"]:
            scene_boundaries.add(i)

    # 무음 파일 준비
    gap_within_file = "/tmp/gap_within.wav"
    gap_between_file = "/tmp/gap_between.wav"
    make_silence(gap_within_file, gap_within_ms)
    make_silence(gap_between_file, gap_between_ms)

    # 청크별 TTS 생성
    wav_files = []
    chunk_durations = []
    total_start = time.time()

    for chunk in chunks:
        wav_path = str(output_dir / f"chunk-{chunk['chunk_num']:03d}.wav")

        # 이미 생성된 파일 스킵
        if chunk["chunk_num"] <= skip_until:
            dur = get_duration_sec(wav_path)
            chunk_durations.append(dur)
            wav_files.append(wav_path)
            continue

        text_preview = chunk["text"][:45] + ("..." if len(chunk["text"]) > 45 else "")
        print(f"  [{chunk['chunk_num']:2d}/{len(chunks)}] {text_preview}")

        t0 = time.time()
        audio_path, api_dur = generate_and_wait(server, profile_id, chunk["text"], language)

        # Voicebox 생성 파일을 프로젝트 디렉토리에 복사
        import shutil
        shutil.copy2(audio_path, wav_path)
        add_padding(wav_path, padding_ms)

        dur = get_duration_sec(wav_path)
        chunk_durations.append(dur)
        wav_files.append(wav_path)
        elapsed = time.time() - t0
        print(f"         → {dur:.2f}s (생성 {elapsed:.1f}s)")

    # SRT 생성
    srt_path = str(output_dir / "subtitles.srt")
    generate_srt(chunks, chunk_durations, gap_within_ms, gap_between_ms, scene_boundaries, srt_path)
    print(f"\n  SRT: {srt_path}")

    # 씬별 합본
    current_scene = ""
    scene_chunk_wavs = []
    scene_num = 0
    scene_outputs = []

    for i, chunk in enumerate(chunks):
        if chunk["scene"] != current_scene:
            if scene_chunk_wavs:
                scene_num += 1
                scene_out = str(output_dir / f"scene-{scene_num:02d}.wav")
                gaps = [gap_within_file if j < len(scene_chunk_wavs) - 1 else None
                        for j in range(len(scene_chunk_wavs))]
                concat_wavs(scene_chunk_wavs, scene_out, gaps)
                scene_outputs.append(scene_out)
                scene_dur = get_duration_sec(scene_out)
                print(f"  scene-{scene_num:02d}.wav ({scene_dur:.1f}s)")
            current_scene = chunk["scene"]
            scene_chunk_wavs = []
        scene_chunk_wavs.append(wav_files[i])

    if scene_chunk_wavs:
        scene_num += 1
        scene_out = str(output_dir / f"scene-{scene_num:02d}.wav")
        gaps = [gap_within_file if j < len(scene_chunk_wavs) - 1 else None
                for j in range(len(scene_chunk_wavs))]
        concat_wavs(scene_chunk_wavs, scene_out, gaps)
        scene_outputs.append(scene_out)
        scene_dur = get_duration_sec(scene_out)
        print(f"  scene-{scene_num:02d}.wav ({scene_dur:.1f}s)")

    # 전체 합본
    full_output = str(output_dir / "full-voice.wav")
    gaps = [gap_between_file if j < len(scene_outputs) - 1 else None
            for j in range(len(scene_outputs))]
    concat_wavs(scene_outputs, full_output, gaps)
    total_dur = get_duration_sec(full_output)
    total_elapsed = time.time() - total_start

    print(f"\n=== 완료: {full_output} ({total_dur:.1f}s) ===")
    print(f"    청크: {len(chunks)}개")
    print(f"    씬:   {scene_num}개")
    print(f"    SRT:  {srt_path}")
    print(f"    소요: {total_elapsed:.0f}초")


if __name__ == "__main__":
    main()
