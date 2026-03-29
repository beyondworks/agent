"""Veo3 영상 생성 스크립트.

direction.yaml에서 씬 방향을 로드하고, Gemini Veo3 API로 영상을 생성한다.
"""

import argparse
import os
from pathlib import Path

import yaml


def load_env():
    env_path = Path("config/api-keys.env")
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key] = val


def build_video_prompt(direction: dict) -> str:
    """direction dict에서 영상 프롬프트를 생성한다.

    Args:
        direction: scene_number, visual_description, camera_movement, mood, duration_sec를 포함한 dict

    Returns:
        Veo3 API에 전달할 프롬프트 문자열
    """
    visual = direction.get("visual_description", "")
    camera = direction.get("camera_movement", "")
    mood = direction.get("mood", "")
    duration = direction.get("duration_sec", 5)

    parts = [visual]
    if camera:
        parts.append(f"카메라: {camera}")
    if mood:
        parts.append(f"분위기: {mood}")
    parts.append(f"영상 길이: {duration}초")

    return ". ".join(parts)


def save_video(video_bytes: bytes, output_path: str) -> None:
    """바이트를 MP4 파일로 저장한다.

    Args:
        video_bytes: MP4 바이트 데이터
        output_path: 저장할 파일 경로 (부모 디렉토리 자동 생성)
    """
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(video_bytes)


def generate_scene_video(direction_path: str, output_path: str) -> None:
    """전체 파이프라인 실행: direction.yaml 로드 → 프롬프트 빌드 → Veo3 API 호출 → 저장.

    Args:
        direction_path: direction.yaml 파일 경로
        output_path: 출력 MP4 파일 경로
    """
    from google import genai

    with open(direction_path, encoding="utf-8") as f:
        direction = yaml.safe_load(f)

    prompt = build_video_prompt(direction)

    load_env()
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.")

    client = genai.Client(api_key=api_key)

    import time

    print(f"Veo 3 영상 생성 시작: {prompt[:80]}...")
    operation = client.models.generate_videos(
        model="veo-3.0-generate-001",
        prompt=prompt,
    )

    # 폴링: 영상 생성 완료 대기
    while not operation.done:
        time.sleep(10)
        operation = client.operations.get(operation)
        print(f"  생성 중... (done={operation.done})")

    if not operation.response or not operation.response.generated_videos:
        raise RuntimeError("API 응답에 영상 데이터가 없습니다.")

    video = operation.response.generated_videos[0]
    video_data = client.files.download(file=video.video)
    save_video(video_data, output_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Veo3 영상 생성")
    parser.add_argument("--direction", required=True, help="direction.yaml 경로")
    parser.add_argument("--output", required=True, help="출력 MP4 경로")
    args = parser.parse_args()

    generate_scene_video(args.direction, args.output)
    print(f"영상 저장 완료: {args.output}")
