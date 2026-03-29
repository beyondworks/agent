import pytest
from scripts.compositor import detect_scene_type, build_timeline, validate_project_dir


def test_detect_image_scene():
    assert detect_scene_type("scene-01/visual.png") == "image"
    assert detect_scene_type("scene-01/visual.jpg") == "image"
    assert detect_scene_type("scene-01/visual.jpeg") == "image"


def test_detect_video_scene():
    assert detect_scene_type("scene-01/visual.mp4") == "video"
    assert detect_scene_type("scene-01/visual.mov") == "video"
    assert detect_scene_type("scene-01/visual.webm") == "video"


def test_detect_unknown_type():
    with pytest.raises(ValueError):
        detect_scene_type("scene-01/visual.txt")


def test_build_timeline_order():
    scenes = [
        {"visual": "scene-01/visual.png", "voice": "scene-01/voice.mp3"},
        {"visual": "scene-02/visual.mp4", "voice": "scene-02/voice.mp3"},
    ]
    timeline = build_timeline(scenes)
    assert len(timeline) == 2
    assert timeline[0]["index"] == 0
    assert timeline[0]["visual_type"] == "image"
    assert timeline[1]["index"] == 1
    assert timeline[1]["visual_type"] == "video"


def test_build_timeline_empty():
    timeline = build_timeline([])
    assert timeline == []


def test_validate_project_dir(tmp_path):
    """유효한 프로젝트 디렉토리 구조 확인"""
    scenes = tmp_path / "scenes" / "scene-01"
    scenes.mkdir(parents=True)
    (scenes / "visual.png").write_bytes(b'\x89PNG')
    (scenes / "voice.mp3").write_bytes(b'\xff\xfb')

    result = validate_project_dir(str(tmp_path))
    assert len(result) == 1
    assert result[0]["visual"].endswith("visual.png")
    assert result[0]["voice"].endswith("voice.mp3")
