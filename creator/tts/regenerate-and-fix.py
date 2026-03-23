#!/usr/bin/env python3
"""
문제 씬 재생성 + 전체 tail noise 제거 + 결합
"""

import json
import os
import numpy as np
import soundfile as sf
import torch

VOICE_REF = "/Users/yoogeon/Agents/lean-youtube/voice/김효율.m4a"
MODEL_ID = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
DEVICE = "mps"
OUT_DIR = "/Users/yoogeon/Agents/Creator/out"

SCENE_GAP_MS = 800
TAIL_PADDING_MS = 500

# 재생성 대상 씬 (2, 4)
REGEN_SCENES = {
    2: "에이전트를 한마디로 하면, 스스로 판단하고 행동하는 AI입니다. 챗지피티한테 이거 알려줘라고 묻는 건 챗봇이고, 이 업무를 처음부터 끝까지 처리해줘라고 맡기는 게 에이전트입니다. 챗봇은 콜센터 상담원, 에이전트는 신입 직원이에요. 업무를 주면 알아서 단계를 나누고, 도구를 찾아 쓰고, 결과를 가져옵니다.",
    4: "여기서 냉정하게 볼 게 있습니다. 레딧 커뮤니티에서 가장 많이 나오는 비판이 뭐냐면, 에이전트라고 마케팅하는 것들 대부분이 그냥 챗봇에 자동화를 씌운 것이라는 겁니다. 제 경험상으로도 그렇습니다. 이커머스에서 에이전트 도입했다는 프로젝트 대부분이 챗봇이 주문 상태를 읽어주는 수준이었습니다. 자동화에 AI 라벨을 붙인 거지, 스스로 판단하는 구조는 아닌 거예요.",
}

ALL_SCENES = [1, 2, 3, 4, 5, 6, 7]


def normalize_audio(wav, target_rms=0.15):
    rms = np.sqrt(np.mean(wav ** 2))
    if rms < 1e-6:
        return wav
    gain = target_rms / rms
    wav = wav * gain
    peak = np.abs(wav).max()
    if peak > 0.95:
        wav = wav * (0.95 / peak)
    return wav


def trim_tail_noise(wav, sr, threshold=0.01, min_silence_ms=200):
    """끝부분 노이즈 트리밍: RMS가 threshold 이하인 마지막 구간 제거"""
    window = int(0.05 * sr)  # 50ms 윈도우
    min_silence_windows = int(min_silence_ms / 50)

    # 뒤에서부터 RMS 계산
    rms_values = []
    for i in range(0, len(wav) - window, window):
        chunk = wav[i:i+window]
        rms_values.append(np.sqrt(np.mean(chunk**2)))

    if not rms_values:
        return wav

    # 뒤에서부터 연속 무음 구간 찾기
    silent_count = 0
    cut_index = len(rms_values)
    for i in range(len(rms_values) - 1, -1, -1):
        if rms_values[i] < threshold:
            silent_count += 1
        else:
            break
        cut_index = i

    if silent_count >= min_silence_windows:
        # 무음 시작 지점 + 100ms 여유
        keep_samples = (cut_index * window) + int(0.1 * sr)
        wav = wav[:min(keep_samples, len(wav))]

    return wav


def main():
    # ── 모델 로드 ──────────────────────────────────────────────────────
    print("[INFO] 모델 로드 중...")
    from qwen_tts import Qwen3TTSModel
    model = Qwen3TTSModel.from_pretrained(MODEL_ID, device_map=DEVICE)
    print("[INFO] 모델 로드 완료")

    print("[INFO] 보이스 클론 프롬프트 생성...")
    voice_prompt = model.create_voice_clone_prompt(
        ref_audio=VOICE_REF,
        x_vector_only_mode=True,
    )

    # ── 재생성 + 기존 씬 로드 ──────────────────────────────────────────
    scene_wavs = {}
    sample_rate = None

    for scene_id in ALL_SCENES:
        wav_path = os.path.join(OUT_DIR, f"scene_{scene_id}.wav")

        if scene_id in REGEN_SCENES:
            text = REGEN_SCENES[scene_id]
            print(f"\n[REGEN Scene {scene_id}] {text[:40]}...")

            # 최대 3번 시도, 유사도 체크
            best_wav = None
            for attempt in range(3):
                result_wavs, sr = model.generate_voice_clone(
                    text=text,
                    language="korean",
                    voice_clone_prompt=voice_prompt,
                    non_streaming_mode=True,
                    do_sample=True,
                    top_k=30,
                    top_p=0.9,
                    temperature=0.5,  # 낮춰서 안정성 증가
                    repetition_penalty=1.3,  # 높여서 반복 방지
                )
                sample_rate = sr
                wav = result_wavs[0]
                dur = len(wav) / sr
                print(f"  시도 {attempt+1}: {dur:.1f}초")

                if best_wav is None or (14 < dur < 30):
                    best_wav = wav
                    if 14 < dur < 30:
                        break

            wav = best_wav
        else:
            print(f"\n[LOAD Scene {scene_id}] 기존 파일 사용")
            wav, sr = sf.read(wav_path)
            sample_rate = sr

        # tail noise 제거
        original_len = len(wav)
        wav = trim_tail_noise(wav, sample_rate)
        trimmed = original_len - len(wav)
        if trimmed > 0:
            print(f"  tail trim: {trimmed/sample_rate*1000:.0f}ms 제거")

        # 끝음 보호 패딩
        pad = np.zeros(int((TAIL_PADDING_MS / 1000) * sample_rate), dtype=np.float32)
        wav = np.concatenate([wav, pad])

        # 정규화
        wav = normalize_audio(wav)

        scene_wavs[scene_id] = wav
        sf.write(os.path.join(OUT_DIR, f"scene_{scene_id}.wav"), wav, sample_rate)
        print(f"  최종: {len(wav)/sample_rate:.1f}초")

    # ── 순차 결합 ──────────────────────────────────────────────────────
    gap_samples = int((SCENE_GAP_MS / 1000) * sample_rate)
    gap = np.zeros(gap_samples, dtype=np.float32)

    segments = []
    for i, scene_id in enumerate(ALL_SCENES):
        segments.append(scene_wavs[scene_id])
        if i < len(ALL_SCENES) - 1:
            segments.append(gap)

    full_audio = np.concatenate(segments)
    full_path = os.path.join(OUT_DIR, "narration-v2.wav")
    sf.write(full_path, full_audio, sample_rate)
    print(f"\n[DONE] {full_path} ({len(full_audio)/sample_rate:.1f}초)")

    # ── 타이밍 출력 ────────────────────────────────────────────────────
    print("\n[TIMING]")
    offset_ms = 0
    timing = []
    for scene_id in ALL_SCENES:
        wav = scene_wavs[scene_id]
        dur_ms = int(len(wav) / sample_rate * 1000)
        timing.append({"scene": scene_id, "startMs": offset_ms, "endMs": offset_ms + dur_ms})
        print(f"  Scene {scene_id}: {offset_ms}ms → {offset_ms + dur_ms}ms ({dur_ms/1000:.1f}s)")
        offset_ms += dur_ms + SCENE_GAP_MS

    with open(os.path.join(OUT_DIR, "scene-timing.json"), "w") as f:
        json.dump(timing, f, indent=2)


if __name__ == "__main__":
    main()
