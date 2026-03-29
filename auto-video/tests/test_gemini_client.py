import pytest
import os
from scripts.gemini_client import GeminiClient


def test_client_loads_config():
    """config/models.yaml에서 모델 매핑을 로드하는지 확인"""
    client = GeminiClient(config_path="config/models.yaml")
    assert client.get_model("research") == "gemini-3-flash"
    assert client.get_model("script") == "gemini-3.1-pro"
    assert client.get_model("image_generation") == "nano-banana"


def test_client_get_model_unknown_purpose():
    """알 수 없는 용도에 대해 KeyError 발생"""
    client = GeminiClient(config_path="config/models.yaml")
    with pytest.raises(KeyError):
        client.get_model("unknown_purpose")


def test_client_loads_api_config():
    """API 설정(base_url 등)을 로드하는지 확인"""
    client = GeminiClient(config_path="config/models.yaml")
    assert "generativelanguage" in client.api_config["gemini_base_url"]
