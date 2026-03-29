import pytest
from scripts.youtube_metadata import validate_metadata, format_metadata_yaml


def test_validate_metadata_structure():
    metadata = {
        "title": "테스트 영상 제목",
        "description": "이 영상은 테스트입니다",
        "tags": ["태그1", "태그2"],
    }
    assert validate_metadata(metadata) is True


def test_validate_rejects_empty_title():
    metadata = {"title": "", "description": "설명", "tags": []}
    assert validate_metadata(metadata) is False


def test_validate_rejects_missing_description():
    metadata = {"title": "제목", "tags": ["태그"]}
    assert validate_metadata(metadata) is False


def test_validate_rejects_long_title():
    metadata = {"title": "x" * 101, "description": "설명", "tags": []}
    assert validate_metadata(metadata) is False


def test_format_metadata_yaml():
    metadata = {
        "title": "테스트",
        "description": "설명",
        "tags": ["a", "b"],
    }
    result = format_metadata_yaml(metadata)
    assert "title:" in result
    assert "테스트" in result
