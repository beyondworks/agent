"""Core voice cloning engine wrapping Qwen3 TTS."""

import json
import shutil
from pathlib import Path
from typing import Optional

import numpy as np
import soundfile as sf
import torch

TEMPLATES_DIR = Path.home() / ".voice-clone" / "templates"
TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)

# M1 Max 최적 파라미터 (끝음 잘림 방지)
DEFAULT_GENERATE_PARAMS = {
    "max_new_tokens": 4096,
    "temperature": 0.7,
    "repetition_penalty": 1.0,
    "top_k": 50,
    "top_p": 1.0,
}

MODEL_ID = "Qwen/Qwen3-TTS-12Hz-0.6B-Base"


def _detect_device():
    """사용 가능한 최적 디바이스 감지."""
    if torch.cuda.is_available():
        return "cuda:0", torch.bfloat16
    if torch.backends.mps.is_available():
        return "mps", torch.float32  # MPS는 bfloat16 미지원
    return "cpu", torch.float32


def _load_model(model_id: str = MODEL_ID):
    """모델 로딩 (캐시됨)."""
    from qwen_tts import Qwen3TTSModel

    device, dtype = _detect_device()
    model = Qwen3TTSModel.from_pretrained(
        model_id,
        device_map=device,
        dtype=dtype,
    )
    return model


def register_template(name: str, audio_path: str, ref_text: str):
    """보이스 템플릿 등록 — 참조 오디오 복사 + 메타데이터 저장."""
    template_dir = TEMPLATES_DIR / name
    template_dir.mkdir(parents=True, exist_ok=True)

    src = Path(audio_path).expanduser().resolve()
    if not src.exists():
        raise FileNotFoundError(f"참조 오디오 없음: {src}")

    dst = template_dir / f"ref{src.suffix}"
    shutil.copy2(src, dst)

    meta = {
        "name": name,
        "ref_audio": str(dst),
        "ref_text": ref_text,
        "model_id": MODEL_ID,
        "generate_params": DEFAULT_GENERATE_PARAMS,
    }
    (template_dir / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    return meta


def list_templates():
    """등록된 템플릿 목록."""
    templates = []
    if not TEMPLATES_DIR.exists():
        return templates
    for d in sorted(TEMPLATES_DIR.iterdir()):
        meta_file = d / "meta.json"
        if meta_file.exists():
            meta = json.loads(meta_file.read_text())
            templates.append(meta)
    return templates


def get_template(name: str) -> dict:
    """이름으로 템플릿 로드."""
    meta_file = TEMPLATES_DIR / name / "meta.json"
    if not meta_file.exists():
        raise FileNotFoundError(f"템플릿 '{name}' 없음. `voice-clone list`로 확인하세요.")
    return json.loads(meta_file.read_text())


def remove_template(name: str):
    """템플릿 삭제."""
    template_dir = TEMPLATES_DIR / name
    if not template_dir.exists():
        raise FileNotFoundError(f"템플릿 '{name}' 없음.")
    shutil.rmtree(template_dir)


def update_template_params(name: str, **params):
    """템플릿 생성 파라미터 업데이트."""
    meta = get_template(name)
    meta["generate_params"].update(params)
    meta_file = TEMPLATES_DIR / name / "meta.json"
    meta_file.write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    return meta


def generate(
    template_name: str,
    text: str,
    language: str = "Korean",
    output: str = "output.wav",
    model_id: Optional[str] = None,
    **override_params,
) -> str:
    """등록된 템플릿으로 보이스 클론 음성 생성."""
    meta = get_template(template_name)
    model = _load_model(model_id or meta.get("model_id", MODEL_ID))

    ref_audio = meta["ref_audio"]
    ref_text = meta["ref_text"]

    gen_params = {**meta.get("generate_params", DEFAULT_GENERATE_PARAMS), **override_params}

    wavs, sr = model.generate_voice_clone(
        text=text,
        language=language,
        ref_audio=ref_audio,
        ref_text=ref_text,
        **gen_params,
    )

    output_path = Path(output).expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(output_path), wavs[0], sr)
    return str(output_path)


def generate_batch(
    template_name: str,
    texts: list[str],
    language: str = "Korean",
    output_prefix: str = "output",
    model_id: Optional[str] = None,
    **override_params,
) -> list[str]:
    """여러 문장 배치 생성."""
    meta = get_template(template_name)
    model = _load_model(model_id or meta.get("model_id", MODEL_ID))

    ref_audio = meta["ref_audio"]
    ref_text = meta["ref_text"]

    gen_params = {**meta.get("generate_params", DEFAULT_GENERATE_PARAMS), **override_params}

    # 프롬프트 1회 생성 → 재사용
    prompt = model.create_voice_clone_prompt(
        ref_audio=ref_audio,
        ref_text=ref_text,
    )

    wavs, sr = model.generate_voice_clone(
        text=texts,
        language=[language] * len(texts),
        voice_clone_prompt=prompt,
        **gen_params,
    )

    paths = []
    for i, w in enumerate(wavs):
        path = f"{output_prefix}_{i}.wav"
        sf.write(path, w, sr)
        paths.append(path)

    return paths
