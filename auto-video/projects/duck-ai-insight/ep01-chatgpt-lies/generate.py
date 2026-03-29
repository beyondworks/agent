"""EP01 애덕이 숏폼 이미지 생성 — Gemini Nano Banana.

7장면 캐릭터 일러스트를 생성한다.
캐릭터 일관성을 위해 모든 프롬프트에 공통 프리픽스를 적용.
"""

import asyncio
import os
import sys
import time
from pathlib import Path

# 프로젝트 루트를 path에 추가
PROJECT_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(PROJECT_ROOT))

CHARACTER_PREFIX = (
    "Flat vector illustration of a white duck character with an orange beak "
    "and simple black dot eyes. Minimal clean style, no outlines, no gradients, "
    "no shadows. The duck has a long slender neck (goose-like proportions). "
    "Solid single-color background. Upper body composition (chest to head). "
    "Modern graphic design aesthetic. 9:16 vertical portrait orientation."
)

SCENES = [
    {
        "id": "scene-01",
        "name": "후킹 — 놀란 표정",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck has wide surprised eyes and wings spread out to the sides. "
            "Solid red background (#E04040). Shocked expression."
        ),
    },
    {
        "id": "scene-02",
        "name": "문제 제기 — 채팅 UI 가리킴",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck is tilting its head curiously to the right, one wing pointing "
            "to the side at a floating chat bubble with Korean text. "
            "Solid dark navy background (#2D3A8C). Curious expression."
        ),
    },
    {
        "id": "scene-03",
        "name": "칠판 설명 — 헤드셋 착용",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck is wearing a black gaming headset with green ear cups and "
            "a small microphone boom. A yellow code symbol </> is on the ear cup. "
            "One wing raised pointing upward. "
            "Solid dark green background (#2A6B4F). Teacher-like confident pose."
        ),
    },
    {
        "id": "scene-04",
        "name": "비유 — 시험지 들기",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck is holding up a white paper (test sheet) with red X marks on it. "
            "Smugly confident expression with slightly squinted eyes. "
            "Solid sky blue background (#4DA6E8)."
        ),
    },
    {
        "id": "scene-05",
        "name": "원리 — 생각하는 포즈",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck has one wing on its chin in a classic thinking pose. "
            "Contemplative, slightly curious expression. "
            "Solid purple background (#6B4FA0)."
        ),
    },
    {
        "id": "scene-06",
        "name": "실용 팁 — 커피 + 엄지척",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck is holding a black takeout coffee cup with a white lid in one wing, "
            "and giving a thumbs up with the other wing. Friendly confident expression. "
            "Solid orange background (#E8863C)."
        ),
    },
    {
        "id": "scene-07",
        "name": "마무리 — 헤드셋+커피+윙크",
        "prompt": (
            f"{CHARACTER_PREFIX} "
            "The duck is wearing a black gaming headset with green ear cups and microphone, "
            "holding a black takeout coffee cup with white lid, winking with one eye closed. "
            "Confident and friendly expression. "
            "Solid blue background (#3366CC)."
        ),
    },
]


async def generate_scene(scene: dict, output_dir: Path) -> str | None:
    """단일 장면 이미지를 생성한다."""
    from scripts.gemini_client import GeminiClient

    scene_dir = output_dir / scene["id"]
    scene_dir.mkdir(parents=True, exist_ok=True)
    output_path = scene_dir / "img.png"

    if output_path.exists():
        print(f"  {scene['id']}: 이미 존재 — 스킵")
        return str(output_path)

    print(f"  {scene['id']} ({scene['name']}): 생성 중...")

    client = GeminiClient(require_key=True)
    try:
        result = await client.generate_image(scene["prompt"], str(output_path))
        size_kb = output_path.stat().st_size // 1024
        print(f"    -> 완료 ({size_kb}KB)")
        return result
    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            print(f"    -> Rate limit — 60초 대기 후 재시도")
            time.sleep(60)
            try:
                result = await client.generate_image(scene["prompt"], str(output_path))
                print(f"    -> 재시도 성공")
                return result
            except Exception as e2:
                print(f"    -> 재시도 실패: {e2}")
                return None
        else:
            print(f"    -> 에러: {e}")
            return None


async def main():
    output_dir = Path(__file__).parent / "scenes"
    output_dir.mkdir(exist_ok=True)

    print(f"\n=== EP01 애덕이 이미지 생성 (Nano Banana, {len(SCENES)}장) ===\n")

    success = 0
    for scene in SCENES:
        result = await generate_scene(scene, output_dir)
        if result:
            success += 1
        time.sleep(5)  # API 속도 제한 방지

    print(f"\n완료: {success}/{len(SCENES)}장 성공\n")


if __name__ == "__main__":
    asyncio.run(main())
