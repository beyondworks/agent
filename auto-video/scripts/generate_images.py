"""Imagen 4로 씬별 이미지 생성.

scene-prompts.md에서 프롬프트를 추출하여 씬당 2-3장 이미지 생성.
인트로(Scene 1)/아웃트로(Scene 20)는 영상이므로 제외.
"""

import os
import re
import time
from pathlib import Path


def load_env():
    env_path = Path("config/api-keys.env")
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key] = val


def parse_prompts(prompts_path: str) -> list[dict]:
    """scene-prompts.md에서 씬별 프롬프트를 파싱한다.

    두 가지 포맷을 지원:
    - 단일 프롬프트: **Prompt:** ... **Audio Direction**
    - 멀티 이미지: **Image 1 Prompt:** ... **Ken Burns:** / **Image 2 Prompt:** ...
    """
    text = Path(prompts_path).read_text(encoding="utf-8")
    scenes = []

    # 인트로 파트 파싱 (### Intro Part A/B)
    intro_parts = re.split(r"(?=### Intro Part [A-Z]:)", text)
    for ip in intro_parts:
        intro_match = re.match(r"### Intro Part ([A-Z]): (.+)", ip)
        if not intro_match:
            continue
        part_letter = intro_match.group(1)
        title = intro_match.group(2).strip()
        prompt_match = re.search(
            r"\*\*Prompt:\*\*\n(.+?)(?=\n\*\*Audio Direction)", ip, re.DOTALL
        )
        prompt = prompt_match.group(1).strip() if prompt_match else ""
        if prompt:
            # 인트로는 scene_number=0, 파트별로 이미지 1장씩
            scenes.append({
                "scene_number": 0,
                "title": f"Intro {part_letter}: {title}",
                "prompt": prompt,
                "image_prompts": [prompt],
                "_intro_part": part_letter,
            })

    parts = re.split(r"(?=### Scene \d+:)", text)

    for part in parts:
        match = re.match(r"### Scene (\d+): (.+)", part)
        if not match:
            continue
        scene_num = int(match.group(1))
        title = match.group(2).strip()

        # 멀티 이미지 포맷: **Image N Prompt:**
        image_prompts = re.findall(
            r"\*\*Image \d+ Prompt:\*\*\n(.+?)(?=\n\*\*(?:Ken Burns|Consistency|Image \d+ Prompt))",
            part,
            re.DOTALL,
        )

        if image_prompts:
            # 멀티 이미지: 각 프롬프트를 개별 저장
            scenes.append({
                "scene_number": scene_num,
                "title": title,
                "prompt": image_prompts[0].strip(),
                "image_prompts": [p.strip() for p in image_prompts],
            })
        else:
            # 단일 프롬프트 (기존 포맷)
            prompt_match = re.search(
                r"\*\*Prompt:\*\*\n(.+?)(?=\n\*\*Audio Direction)", part, re.DOTALL
            )
            prompt = prompt_match.group(1).strip() if prompt_match else ""
            scenes.append({"scene_number": scene_num, "title": title, "prompt": prompt})

    return scenes


def generate_scene_images(scenes: list[dict], scenes_dir: str, images_per_scene: int = 2):
    """Imagen 4로 씬별 이미지를 생성한다."""
    from google import genai

    load_env()
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    print(f"\n=== Imagen 4 이미지 생성 ({len(scenes)}씬 × {images_per_scene}장) ===\n")

    total = 0
    errors = 0

    for scene in scenes:
        scene_dir = Path(scenes_dir) / f"scene-{scene['scene_number']:02d}"
        scene_dir.mkdir(parents=True, exist_ok=True)

        # 이미 이미지가 있으면 스킵
        existing = list(scene_dir.glob("img_*.png"))
        if len(existing) >= images_per_scene:
            print(f"  Scene {scene['scene_number']:02d}: 이미 {len(existing)}장 존재 — 스킵")
            total += len(existing)
            continue

        # 멀티 이미지 프롬프트가 있으면 그것을 사용, 없으면 기존 방식
        has_multi = "image_prompts" in scene and scene["image_prompts"]

        if has_multi:
            actual_count = len(scene["image_prompts"])
        else:
            actual_count = images_per_scene

        base_prompt = scene["prompt"]

        # 단일 프롬프트 모드: 각 이미지에 약간 다른 앵글/구도 지시 추가
        variations = [
            "Medium shot, centered composition.",
            "Close-up detail shot, shallow depth of field.",
            "Wide establishing shot, environmental context.",
        ]

        for j in range(actual_count):
            img_path = scene_dir / f"img_{j+1:02d}.png"
            if img_path.exists():
                print(f"  Scene {scene['scene_number']:02d} img_{j+1}: 존재 — 스킵")
                total += 1
                continue

            # 멀티 이미지: 개별 프롬프트 사용 / 단일: 변형 추가
            if has_multi:
                full_prompt = scene["image_prompts"][j]
            else:
                variation = variations[j % len(variations)]
                full_prompt = f"{base_prompt}\n\n{variation}\n\nPhotorealistic, cinematic, 4K, film grain."

            print(f"  Scene {scene['scene_number']:02d} img_{j+1}: 생성 중...")

            try:
                response = client.models.generate_images(
                    model="imagen-4.0-generate-001",
                    prompt=full_prompt,
                    config={"number_of_images": 1},
                )

                if response.generated_images:
                    img_data = response.generated_images[0].image.image_bytes
                    img_path.write_bytes(img_data)
                    print(f"    → 완료 ✓ ({len(img_data) // 1024}KB)")
                    total += 1
                else:
                    print(f"    → 이미지 없음")
                    errors += 1

            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    print(f"    → Rate limit — 60초 대기 후 재시도")
                    time.sleep(60)
                    try:
                        response = client.models.generate_images(
                            model="imagen-4.0-generate-001",
                            prompt=full_prompt,
                            config={"number_of_images": 1},
                        )
                        if response.generated_images:
                            img_data = response.generated_images[0].image.image_bytes
                            img_path.write_bytes(img_data)
                            print(f"    → 재시도 성공 ✓")
                            total += 1
                        else:
                            errors += 1
                    except Exception as e2:
                        print(f"    → 재시도 실패: {e2}")
                        errors += 1
                else:
                    print(f"    → 에러: {e}")
                    errors += 1

            time.sleep(3)  # API 속도 제한 방지

    print(f"\n이미지 생성 완료: {total}장 성공, {errors}개 실패\n")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Imagen 4 씬별 이미지 생성")
    parser.add_argument("--project", default="projects/2026-03-24-senior-content")
    parser.add_argument("--images-per-scene", type=int, default=2)
    parser.add_argument("--start", type=int, default=2, help="시작 씬 번호 (인트로 제외)")
    parser.add_argument("--end", type=int, default=19, help="끝 씬 번호 (아웃트로 제외)")
    args = parser.parse_args()

    prompts_path = Path(args.project) / "scene-prompts.md"
    scenes_dir = Path(args.project) / "scenes"

    all_scenes = parse_prompts(str(prompts_path))
    # 인트로/아웃트로 제외한 중간 씬만
    target_scenes = [s for s in all_scenes if args.start <= s["scene_number"] <= args.end]

    print(f"대상 씬: {len(target_scenes)}개 (Scene {args.start}~{args.end})")
    generate_scene_images(target_scenes, str(scenes_dir), args.images_per_scene)


if __name__ == "__main__":
    main()
