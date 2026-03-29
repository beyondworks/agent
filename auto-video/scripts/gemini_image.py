"""Nano Banana 이미지 생성 스크립트.

씬 연출 지시서(direction.yaml) → 프롬프트 빌드 → Gemini 이미지 생성 API → PNG 저장.
"""

import argparse
import os
from pathlib import Path

import yaml


def build_image_prompt(direction: dict, base_prompt: str) -> str:
    """direction dict와 base prompt를 결합하여 이미지 프롬프트를 생성한다.

    Args:
        direction: 씬 연출 지시서 dict
        base_prompt: character.yaml의 nano_banana_base_prompt

    Returns:
        최적화된 이미지 생성 프롬프트
    """
    visual = direction.get("visual_description", "")
    mood = direction.get("mood", "")
    style_override = direction.get("style_override")

    style = style_override if style_override else base_prompt

    parts = [visual]
    if mood:
        parts.append(f"{mood} 분위기")
    parts.append(style)

    return ", ".join(parts)


def save_image(image_bytes: bytes, output_path: str) -> None:
    """이미지 바이트를 파일로 저장한다.

    Args:
        image_bytes: 이미지 바이너리 데이터
        output_path: 저장할 파일 경로
    """
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(image_bytes)


async def generate_scene_image(
    direction_path: str,
    character_yaml_path: str,
    output_path: str,
) -> str:
    """씬 이미지를 생성하는 전체 파이프라인.

    Args:
        direction_path: direction.yaml 경로
        character_yaml_path: brand/character.yaml 경로
        output_path: 출력 PNG 경로

    Returns:
        저장된 파일 경로
    """
    from scripts.gemini_client import GeminiClient

    # direction 로드
    with open(direction_path, encoding="utf-8") as f:
        direction = yaml.safe_load(f)

    # character.yaml에서 base prompt 로드
    with open(character_yaml_path, encoding="utf-8") as f:
        character = yaml.safe_load(f)

    base_prompt = character.get("visual", {}).get("nano_banana_base_prompt", "")

    # 프롬프트 빌드
    prompt = build_image_prompt(direction, base_prompt)

    # API 호출
    client = GeminiClient(require_key=True)
    result_path = await client.generate_image(prompt, output_path)
    return result_path


def main():
    parser = argparse.ArgumentParser(description="Nano Banana 이미지 생성")
    parser.add_argument("--direction", required=True, help="direction.yaml 경로")
    parser.add_argument(
        "--character",
        default="brand/character.yaml",
        help="character.yaml 경로",
    )
    parser.add_argument("--output", required=True, help="출력 PNG 경로")
    args = parser.parse_args()

    import asyncio

    asyncio.run(generate_scene_image(args.direction, args.character, args.output))


if __name__ == "__main__":
    main()
