#!/usr/bin/env python3
"""
Qwen3 TTS 나레이션 생성기 v2
- 씬 단위 생성 (톤 일관성)
- 실제 오디오 길이 기반 타이밍 결정
- 볼륨 정규화 내장
"""

import json
import os
import sys
import numpy as np
import soundfile as sf
import torch

VOICE_REF = "/Users/yoogeon/Agents/lean-youtube/voice/김효율.m4a"
MODEL_ID = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
DEVICE = "mps"

# 씬 간 무음 갭 (ms)
SCENE_GAP_MS = 800
# 끝음 보호 패딩 (ms)
TAIL_PADDING_MS = 500

# ── 씬별 나레이션 전문 ────────────────────────────────────────────────
SCENES = [
    {
        "id": 1,
        "text": "올해 기업 앱의 40%가 AI 에이전트를 품을 거라고 합니다. 그런데 동시에, AI 에이전트 프로젝트의 80에서 90%는 실패합니다. 이 두 숫자가 동시에 존재하는 상황. 뭔가 이상하지 않습니까.",
    },
    {
        "id": 2,
        "text": "에이전트를 한마디로 하면, 스스로 판단하고 행동하는 AI입니다. 챗지피티한테 이거 알려줘라고 묻는 건 챗봇이고, 이 업무를 처음부터 끝까지 처리해줘라고 맡기는 게 에이전트입니다. 챗봇은 콜센터 상담원, 에이전트는 신입 직원이에요. 업무를 주면 알아서 단계를 나누고, 도구를 찾아 쓰고, 결과를 가져옵니다.",
    },
    {
        "id": 3,
        "text": "에이전트라는 개념은 새로운 게 아닙니다. 왜 하필 2026년에 폭발하느냐. 세 가지가 동시에 맞아떨어졌기 때문입니다. 첫째, 모델 성능이 임계점을 넘었습니다. 둘째, 엠씨피 같은 표준 프로토콜이 생겼습니다. 파이어쉽이 이걸 AI의 USB-C라고 비유했는데, 단자가 하나로 통일된 거예요. 셋째, 멀티 에이전트 시스템에 대한 기업 문의가 1,445% 급증했습니다.",
    },
    {
        "id": 4,
        "text": "여기서 냉정하게 볼 게 있습니다. 레딧 커뮤니티에서 가장 많이 나오는 비판이 뭐냐면, 에이전트라고 마케팅하는 것들 대부분이 그냥 챗봇에 자동화를 씌운 것이라는 겁니다. 제 경험상으로도 그렇습니다. 이커머스에서 에이전트 도입했다는 프로젝트 대부분이 챗봇이 주문 상태를 읽어주는 수준이었습니다. 자동화에 AI 라벨을 붙인 거지, 스스로 판단하는 구조는 아닌 거예요.",
    },
    {
        "id": 5,
        "text": "그래서 진짜 중요한 건 뭐냐. 에이전트를 쓰느냐 마느냐가 아니라, 어떤 구조로 쓰느냐입니다. 코딩 에이전트 시장만 봐도, 클로드코드, 커서, 데빈이 각각 다른 포지션을 잡고 있습니다. 그런데 도구가 좋아도 브리프가 엉망이면 결과도 엉망입니다. 에이전트한테 주는 지시에 목적과 조건과 판단 기준이 없으면 그냥 비싼 자동완성이 됩니다.",
    },
    {
        "id": 6,
        "text": "오늘 하나만 해보시죠. 지금 반복하고 있는 업무 하나를 골라서, 이 세 가지를 적어보세요. 이 일의 목적이 뭔지, 판단 기준이 뭔지, 끝난 상태가 어떤 건지. 이게 결국 브리프입니다. AI한테도 이 구조를 주면 일관된 결과가 나옵니다. 기획서를 넘기고 2주를 기다리던 시절에서, 지금은 이 구조를 주면 30분이면 결과를 봅니다. 구조가 먼저예요.",
    },
    {
        "id": 7,
        "text": "정리하겠습니다. 2026년, AI 에이전트는 진짜 폭발합니다. 그런데 90%는 실패할 겁니다. 차이를 만드는 건 도구가 아니라 설계입니다. 처음 AI로 만든 건 보기엔 그럴듯했는데, 쓸 수가 없었어요. 기획 없이 시작한 거였거든요. 그때 배운 겁니다. 코드를 모르니까 오히려 구조에 집중하게 됩니다. 다음 영상에서는 실제로 에이전트를 설계하는 과정을 보여드리겠습니다. 구독해두시면 놓치지 않습니다.",
    },
]


def normalize_audio(wav, target_rms=0.15):
    """RMS 기반 볼륨 정규화"""
    rms = np.sqrt(np.mean(wav ** 2))
    if rms < 1e-6:
        return wav
    gain = target_rms / rms
    wav = wav * gain
    # 클리핑 방지
    peak = np.abs(wav).max()
    if peak > 0.95:
        wav = wav * (0.95 / peak)
    return wav


def main():
    out_dir = "/Users/yoogeon/Agents/Creator/out"
    os.makedirs(out_dir, exist_ok=True)

    # ── 모델 로드 ──────────────────────────────────────────────────────
    print(f"[INFO] 모델 로드 중: {MODEL_ID}")
    from qwen_tts import Qwen3TTSModel
    model = Qwen3TTSModel.from_pretrained(MODEL_ID, device_map=DEVICE)
    print("[INFO] 모델 로드 완료")

    # ── 보이스 프롬프트 (1회) ──────────────────────────────────────────
    print(f"[INFO] 보이스 클론: {VOICE_REF}")
    voice_prompt = model.create_voice_clone_prompt(
        ref_audio=VOICE_REF,
        x_vector_only_mode=True,
    )
    print("[INFO] 보이스 프롬프트 준비 완료")

    # ── 씬별 TTS 생성 ─────────────────────────────────────────────────
    scene_wavs = []
    sample_rate = None

    for scene in SCENES:
        print(f"\n[Scene {scene['id']}] {scene['text'][:40]}...")
        result_wavs, sr = model.generate_voice_clone(
            text=scene["text"],
            language="korean",
            voice_clone_prompt=voice_prompt,
            non_streaming_mode=True,
            do_sample=True,
            top_k=30,
            top_p=0.9,
            temperature=0.6,
            repetition_penalty=1.2,
        )
        sample_rate = sr
        wav = result_wavs[0]

        # 끝음 보호 패딩
        pad = np.zeros(int((TAIL_PADDING_MS / 1000) * sr), dtype=np.float32)
        wav = np.concatenate([wav, pad])

        # 볼륨 정규화
        wav = normalize_audio(wav)

        scene_wavs.append(wav)
        sf.write(os.path.join(out_dir, f"scene_{scene['id']}.wav"), wav, sr)
        dur = len(wav) / sr
        print(f"  → {dur:.1f}초")

    # ── 씬 연결 (순차 배치) ────────────────────────────────────────────
    gap_samples = int((SCENE_GAP_MS / 1000) * sample_rate)
    gap = np.zeros(gap_samples, dtype=np.float32)

    segments = []
    for i, wav in enumerate(scene_wavs):
        segments.append(wav)
        if i < len(scene_wavs) - 1:
            segments.append(gap)

    full_audio = np.concatenate(segments)
    full_path = os.path.join(out_dir, "narration-v2.wav")
    sf.write(full_path, full_audio, sample_rate)
    total_dur = len(full_audio) / sample_rate
    print(f"\n[DONE] {full_path} ({total_dur:.1f}초)")

    # ── 타이밍 데이터 출력 ─────────────────────────────────────────────
    print("\n[TIMING] 씬별 실제 타이밍:")
    offset_ms = 0
    timing_data = []
    for i, wav in enumerate(scene_wavs):
        dur_ms = int(len(wav) / sample_rate * 1000)
        timing_data.append({
            "scene": SCENES[i]["id"],
            "startMs": offset_ms,
            "endMs": offset_ms + dur_ms,
            "durationMs": dur_ms,
        })
        print(f"  Scene {SCENES[i]['id']}: {offset_ms}ms → {offset_ms + dur_ms}ms ({dur_ms/1000:.1f}s)")
        offset_ms += dur_ms + SCENE_GAP_MS

    # 타이밍 JSON 저장
    timing_path = os.path.join(out_dir, "scene-timing.json")
    with open(timing_path, "w") as f:
        json.dump(timing_data, f, indent=2, ensure_ascii=False)
    print(f"[SAVED] {timing_path}")


if __name__ == "__main__":
    main()
