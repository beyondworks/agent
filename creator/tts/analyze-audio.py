#!/usr/bin/env python3
"""
씬별 오디오 분석:
1. Whisper 전사 → 원문 비교 (오류/잡소리 탐지)
2. 단어별 타임스탬프 추출 (자막 싱크용)
3. 오디오 품질 분석 (클리핑, 노이즈)
"""

import json
import os
import numpy as np
import soundfile as sf
import whisper
from difflib import SequenceMatcher

OUT_DIR = "/Users/yoogeon/Agents/Creator/out"

SCENES = [
    {"id": 1, "text": "올해 기업 앱의 40%가 AI 에이전트를 품을 거라고 합니다. 그런데 동시에, AI 에이전트 프로젝트의 80에서 90%는 실패합니다. 이 두 숫자가 동시에 존재하는 상황. 뭔가 이상하지 않습니까."},
    {"id": 2, "text": "에이전트를 한마디로 하면, 스스로 판단하고 행동하는 AI입니다. 챗지피티한테 이거 알려줘라고 묻는 건 챗봇이고, 이 업무를 처음부터 끝까지 처리해줘라고 맡기는 게 에이전트입니다. 챗봇은 콜센터 상담원, 에이전트는 신입 직원이에요. 업무를 주면 알아서 단계를 나누고, 도구를 찾아 쓰고, 결과를 가져옵니다."},
    {"id": 3, "text": "에이전트라는 개념은 새로운 게 아닙니다. 왜 하필 2026년에 폭발하느냐. 세 가지가 동시에 맞아떨어졌기 때문입니다. 첫째, 모델 성능이 임계점을 넘었습니다. 둘째, 엠씨피 같은 표준 프로토콜이 생겼습니다. 파이어쉽이 이걸 AI의 USB-C라고 비유했는데, 단자가 하나로 통일된 거예요. 셋째, 멀티 에이전트 시스템에 대한 기업 문의가 1,445% 급증했습니다."},
    {"id": 4, "text": "여기서 냉정하게 볼 게 있습니다. 레딧 커뮤니티에서 가장 많이 나오는 비판이 뭐냐면, 에이전트라고 마케팅하는 것들 대부분이 그냥 챗봇에 자동화를 씌운 것이라는 겁니다. 제 경험상으로도 그렇습니다. 이커머스에서 에이전트 도입했다는 프로젝트 대부분이 챗봇이 주문 상태를 읽어주는 수준이었습니다. 자동화에 AI 라벨을 붙인 거지, 스스로 판단하는 구조는 아닌 거예요."},
    {"id": 5, "text": "그래서 진짜 중요한 건 뭐냐. 에이전트를 쓰느냐 마느냐가 아니라, 어떤 구조로 쓰느냐입니다. 코딩 에이전트 시장만 봐도, 클로드코드, 커서, 데빈이 각각 다른 포지션을 잡고 있습니다. 그런데 도구가 좋아도 브리프가 엉망이면 결과도 엉망입니다. 에이전트한테 주는 지시에 목적과 조건과 판단 기준이 없으면 그냥 비싼 자동완성이 됩니다."},
    {"id": 6, "text": "오늘 하나만 해보시죠. 지금 반복하고 있는 업무 하나를 골라서, 이 세 가지를 적어보세요. 이 일의 목적이 뭔지, 판단 기준이 뭔지, 끝난 상태가 어떤 건지. 이게 결국 브리프입니다. AI한테도 이 구조를 주면 일관된 결과가 나옵니다. 기획서를 넘기고 2주를 기다리던 시절에서, 지금은 이 구조를 주면 30분이면 결과를 봅니다. 구조가 먼저예요."},
    {"id": 7, "text": "정리하겠습니다. 2026년, AI 에이전트는 진짜 폭발합니다. 그런데 90%는 실패할 겁니다. 차이를 만드는 건 도구가 아니라 설계입니다. 처음 AI로 만든 건 보기엔 그럴듯했는데, 쓸 수가 없었어요. 기획 없이 시작한 거였거든요. 그때 배운 겁니다. 코드를 모르니까 오히려 구조에 집중하게 됩니다. 다음 영상에서는 실제로 에이전트를 설계하는 과정을 보여드리겠습니다. 구독해두시면 놓치지 않습니다."},
]


def analyze_audio_quality(wav_path):
    """오디오 품질 지표 분석"""
    data, sr = sf.read(wav_path)
    duration = len(data) / sr

    # RMS 에너지 (100ms 윈도우)
    window = int(0.1 * sr)
    rms_values = []
    for i in range(0, len(data) - window, window):
        chunk = data[i:i+window]
        rms = np.sqrt(np.mean(chunk**2))
        rms_values.append(rms)
    rms_arr = np.array(rms_values)

    # 무음 구간 탐지 (RMS < 0.005)
    silence_threshold = 0.005
    silent_windows = np.sum(rms_arr < silence_threshold)
    silent_ratio = silent_windows / len(rms_arr) if len(rms_arr) > 0 else 0

    # 클리핑 탐지
    clip_threshold = 0.95
    clip_count = np.sum(np.abs(data) > clip_threshold)

    # 끝음 에너지 (마지막 1초)
    tail_samples = min(int(1.0 * sr), len(data))
    tail_rms = np.sqrt(np.mean(data[-tail_samples:]**2))

    return {
        "duration": round(duration, 2),
        "max_amp": round(float(np.abs(data).max()), 4),
        "mean_rms": round(float(rms_arr.mean()), 4),
        "silent_ratio": round(silent_ratio, 3),
        "clip_samples": int(clip_count),
        "tail_rms": round(float(tail_rms), 4),
    }


def compare_texts(original, transcribed):
    """원문 vs 전사 유사도"""
    # 공백/구두점 제거 후 비교
    def clean(t):
        return t.replace(" ", "").replace(",", "").replace(".", "").replace("%", "퍼센트")

    orig_clean = clean(original)
    trans_clean = clean(transcribed)

    ratio = SequenceMatcher(None, orig_clean, trans_clean).ratio()
    return round(ratio, 3)


def main():
    print("[INFO] Whisper 모델 로드 중 (medium)...")
    model = whisper.load_model("medium", device="cpu")
    print("[INFO] Whisper 로드 완료\n")

    results = []

    for scene in SCENES:
        wav_path = os.path.join(OUT_DIR, f"scene_{scene['id']}.wav")
        if not os.path.exists(wav_path):
            print(f"[SKIP] {wav_path} 없음")
            continue

        print(f"=== Scene {scene['id']} ===")

        # 1. 오디오 품질 분석
        quality = analyze_audio_quality(wav_path)
        print(f"  품질: duration={quality['duration']}s, max={quality['max_amp']}, "
              f"rms={quality['mean_rms']}, silent={quality['silent_ratio']}, "
              f"clip={quality['clip_samples']}, tail_rms={quality['tail_rms']}")

        # 2. Whisper 전사
        result = model.transcribe(
            wav_path,
            language="ko",
            word_timestamps=True,
            condition_on_previous_text=False,
        )
        transcribed = result["text"].strip()
        print(f"  원문: {scene['text'][:60]}...")
        print(f"  전사: {transcribed[:60]}...")

        # 3. 유사도
        similarity = compare_texts(scene["text"], transcribed)
        print(f"  유사도: {similarity}")

        # 4. 세그먼트별 타임스탬프
        segments = []
        for seg in result["segments"]:
            segments.append({
                "start": round(seg["start"], 2),
                "end": round(seg["end"], 2),
                "text": seg["text"].strip(),
            })
            print(f"    [{seg['start']:.1f}s-{seg['end']:.1f}s] {seg['text'].strip()}")

        # 5. 문제 탐지
        issues = []
        if similarity < 0.85:
            issues.append(f"LOW_SIMILARITY({similarity})")
        if quality["clip_samples"] > 100:
            issues.append(f"CLIPPING({quality['clip_samples']})")
        if quality["tail_rms"] > 0.03:
            issues.append(f"TAIL_NOISE(rms={quality['tail_rms']})")
        if quality["silent_ratio"] > 0.3:
            issues.append(f"TOO_MUCH_SILENCE({quality['silent_ratio']})")

        if issues:
            print(f"  ⚠️  문제: {', '.join(issues)}")
        else:
            print(f"  ✓ 양호")

        results.append({
            "scene": scene["id"],
            "quality": quality,
            "similarity": similarity,
            "transcribed": transcribed,
            "original": scene["text"],
            "segments": segments,
            "issues": issues,
        })
        print()

    # 결과 저장
    report_path = os.path.join(OUT_DIR, "audio-analysis.json")
    with open(report_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"[SAVED] {report_path}")

    # 요약
    print("\n=== 요약 ===")
    for r in results:
        status = "⚠️ " + ", ".join(r["issues"]) if r["issues"] else "✓"
        print(f"  Scene {r['scene']}: sim={r['similarity']} {status}")


if __name__ == "__main__":
    main()
