import pytest
from scripts.veo3_video import build_video_prompt, save_video

def test_build_video_prompt_from_direction():
    direction = {
        "scene_number": 1,
        "visual_description": "로봇이 천천히 고개를 돌린다",
        "duration_sec": 5,
        "camera_movement": "slow pan right",
        "mood": "고독한",
    }
    prompt = build_video_prompt(direction)
    assert "로봇" in prompt
    assert len(prompt) > 20

def test_build_video_prompt_includes_camera():
    direction = {
        "scene_number": 2,
        "visual_description": "숲속 오솔길",
        "duration_sec": 3,
        "camera_movement": "dolly forward",
        "mood": "평화로운",
    }
    prompt = build_video_prompt(direction)
    assert "dolly" in prompt.lower() or "전진" in prompt

def test_save_video_creates_file(tmp_path):
    fake_bytes = b'\x00\x00\x00\x1cftypisom' + b'\x00' * 100
    output = tmp_path / "visual.mp4"
    save_video(fake_bytes, str(output))
    assert output.exists()
