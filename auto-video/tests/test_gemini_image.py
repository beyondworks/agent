import pytest
from scripts.gemini_image import build_image_prompt, save_image


def test_build_prompt_from_direction():
    """direction dict + base prompt로 이미지 프롬프트 생성"""
    direction = {
        "scene_number": 1,
        "visual_description": "우주 정거장에서 창밖을 바라보는 로봇",
        "mood": "고독한",
        "style_override": None,
    }
    base_prompt = "cartoon style, vibrant colors"
    prompt = build_image_prompt(direction, base_prompt)
    assert "우주 정거장" in prompt
    assert "cartoon style" in prompt
    assert "고독" in prompt


def test_build_prompt_with_style_override():
    """style_override가 있으면 base_prompt 대신 사용"""
    direction = {
        "scene_number": 2,
        "visual_description": "숲속 오두막",
        "mood": "평화로운",
        "style_override": "watercolor painting, soft edges",
    }
    base_prompt = "cartoon style, vibrant colors"
    prompt = build_image_prompt(direction, base_prompt)
    assert "watercolor" in prompt
    assert "cartoon style" not in prompt


def test_build_prompt_without_mood():
    """mood가 없어도 정상 동작"""
    direction = {
        "scene_number": 3,
        "visual_description": "도시 야경",
        "mood": "",
        "style_override": None,
    }
    prompt = build_image_prompt(direction, "flat illustration")
    assert "도시 야경" in prompt
    assert "flat illustration" in prompt


def test_save_image_creates_file(tmp_path):
    """이미지 바이트를 파일로 저장"""
    fake_bytes = b'\x89PNG\r\n\x1a\n' + b'\x00' * 100
    output = tmp_path / "visual.png"
    save_image(fake_bytes, str(output))
    assert output.exists()
    assert output.stat().st_size > 0


def test_save_image_creates_parent_dirs(tmp_path):
    """부모 디렉토리가 없으면 자동 생성"""
    output = tmp_path / "nested" / "dir" / "visual.png"
    fake_bytes = b'\x89PNG\r\n\x1a\n' + b'\x00' * 50
    save_image(fake_bytes, str(output))
    assert output.exists()
