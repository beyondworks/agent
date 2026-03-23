#!/usr/bin/env python3
"""
Qwen3 TTS 나레이션 생성기
- 김효율.m4a 보이스 클론
- slides.json의 subtitles.sentences 기반
- 타이밍에 맞춰 전체 오디오 파일 생성
"""

import json
import os
import sys
import numpy as np
import soundfile as sf
import torch

# ── 설정 ──────────────────────────────────────────────────────────────────
VOICE_REF = "/Users/yoogeon/Agents/lean-youtube/voice/김효율.m4a"
MODEL_ID = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
DEVICE = "mps"

# 끝음 보호: 생성 후 무음 패딩 (ms)
TAIL_PADDING_MS = 350
# 문장 간 최소 갭 (ms)
MIN_GAP_MS = 100


def load_sentences(slides_path):
    with open(slides_path, "r") as f:
        data = json.load(f)
    return data["subtitles"]["sentences"]


def build_timeline_audio(sentences, wavs, sample_rate):
    """타이밍에 맞춰 문장별 오디오를 배치한 전체 오디오 생성"""
    last_end_ms = max(s["endMs"] for s in sentences)
    total_samples = int((last_end_ms / 1000) * sample_rate) + sample_rate  # +1초 여유
    timeline = np.zeros(total_samples, dtype=np.float32)

    for i, (sent, wav) in enumerate(zip(sentences, wavs)):
        start_sample = int((sent["startMs"] / 1000) * sample_rate)
        end_sample = start_sample + len(wav)

        # 타임라인 범위 초과 방지
        if end_sample > total_samples:
            wav = wav[: total_samples - start_sample]
            end_sample = total_samples

        # 오디오가 다음 문장 시작을 침범하면 페이드아웃으로 처리
        if i + 1 < len(sentences):
            next_start_sample = int((sentences[i + 1]["startMs"] / 1000) * sample_rate)
            gap_samples = int((MIN_GAP_MS / 1000) * sample_rate)
            max_end = next_start_sample - gap_samples
            if end_sample > max_end and max_end > start_sample:
                allowed_len = max_end - start_sample
                # 페이드아웃 (마지막 50ms)
                fade_samples = min(int(0.05 * sample_rate), allowed_len)
                wav = wav[:allowed_len].copy()
                if fade_samples > 0:
                    fade = np.linspace(1.0, 0.0, fade_samples, dtype=np.float32)
                    wav[-fade_samples:] *= fade
                end_sample = start_sample + len(wav)

        timeline[start_sample:end_sample] += wav[: end_sample - start_sample]

    return timeline


def main():
    slides_path = sys.argv[1] if len(sys.argv) > 1 else \
        "/Users/yoogeon/Agents/Creator/leanslide/slides/ai-agent-failure.slides.json"
    out_dir = "/Users/yoogeon/Agents/Creator/out"
    os.makedirs(out_dir, exist_ok=True)

    sentences = load_sentences(slides_path)
    print(f"[INFO] {len(sentences)}개 문장 로드")

    # ── 모델 로드 ──────────────────────────────────────────────────────
    print(f"[INFO] 모델 로드 중: {MODEL_ID}")
    from qwen_tts import Qwen3TTSModel
    model = Qwen3TTSModel.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float32,
        device_map=DEVICE,
    )
    print("[INFO] 모델 로드 완료")

    # ── 보이스 프롬프트 생성 (1회만) ────────────────────────────────────
    print(f"[INFO] 보이스 클론 프롬프트 생성: {VOICE_REF}")
    voice_prompt = model.create_voice_clone_prompt(
        ref_audio=VOICE_REF,
        x_vector_only_mode=True,
    )
    print("[INFO] 보이스 프롬프트 준비 완료")

    # ── 문장별 TTS 생성 ────────────────────────────────────────────────
    wavs = []
    sample_rate = None

    for i, sent in enumerate(sentences):
        text = sent["text"]
        print(f"[{i+1}/{len(sentences)}] \"{text}\"")

        result_wavs, sr = model.generate_voice_clone(
            text=text,
            language="korean",
            voice_clone_prompt=voice_prompt,
            non_streaming_mode=True,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
            repetition_penalty=1.1,
        )
        sample_rate = sr
        wav = result_wavs[0]

        # 끝음 보호: 무음 패딩 추가
        pad_samples = int((TAIL_PADDING_MS / 1000) * sr)
        wav = np.concatenate([wav, np.zeros(pad_samples, dtype=np.float32)])

        wavs.append(wav)

        # 개별 파일 저장 (디버깅용)
        sf.write(os.path.join(out_dir, f"sent_{i:02d}.wav"), wav, sr)

    # ── 타임라인 결합 ──────────────────────────────────────────────────
    print("[INFO] 타임라인 기반 오디오 결합 중...")
    timeline = build_timeline_audio(sentences, wavs, sample_rate)

    out_path = os.path.join(out_dir, "narration.wav")
    sf.write(out_path, timeline, sample_rate)
    print(f"[DONE] {out_path} ({len(timeline)/sample_rate:.1f}초)")


if __name__ == "__main__":
    main()
