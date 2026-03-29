import pytest
from scripts.elevenlabs_tts import split_script_to_scenes, save_audio

def test_split_script_extracts_scene_text():
    script = "## Scene 1\n안녕하세요. 오늘 이야기를 시작합니다.\n## Scene 2\n반갑습니다. 여기는 우주입니다."
    scenes = split_script_to_scenes(script)
    assert len(scenes) == 2
    assert "안녕하세요" in scenes[0]["dialogue"]
    assert scenes[0]["scene_number"] == 1
    assert scenes[1]["scene_number"] == 2

def test_split_script_handles_extra_content():
    script = "# 대본 제목\n설명 텍스트\n## Scene 1\n첫 씬.\n## Scene 2\n둘째 씬."
    scenes = split_script_to_scenes(script)
    assert len(scenes) == 2

def test_save_audio_creates_file(tmp_path):
    fake_audio = b'\xff\xfb\x90\x00' + b'\x00' * 100
    output = tmp_path / "voice.mp3"
    save_audio(fake_audio, str(output))
    assert output.exists()
    assert output.stat().st_size > 0
