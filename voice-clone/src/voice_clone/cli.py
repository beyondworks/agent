"""CLI interface for voice-clone."""

import click

from .engine import (
    generate,
    generate_batch,
    get_template,
    list_templates,
    register_template,
    remove_template,
    update_template_params,
)


@click.group()
@click.version_option()
def main():
    """Qwen3 TTS Voice Cloning CLI

    보이스 템플릿을 등록하고, 어디서든 명령어로 클론 음성을 생성합니다.

    \b
    빠른 시작:
      voice-clone register 효율 --audio ./voice.mp3 --text "참조 오디오 대사"
      voice-clone gen 효율 "생성할 대본 텍스트"
    """


@main.command()
@click.argument("name")
@click.option("--audio", "-a", required=True, help="참조 오디오 파일 경로 (WAV/MP3/M4A)")
@click.option("--text", "-t", required=True, help="참조 오디오의 정확한 대사")
def register(name: str, audio: str, text: str):
    """보이스 템플릿 등록.

    \b
    예시:
      voice-clone register 효율 --audio ./김효율.m4a --text "참조 오디오 대사 전문"
    """
    meta = register_template(name, audio, text)
    click.echo(f"템플릿 '{name}' 등록 완료")
    click.echo(f"  참조 오디오: {meta['ref_audio']}")
    click.echo(f"  참조 텍스트: {meta['ref_text'][:50]}...")


@main.command("list")
def list_cmd():
    """등록된 보이스 템플릿 목록."""
    templates = list_templates()
    if not templates:
        click.echo("등록된 템플릿 없음. `voice-clone register` 로 추가하세요.")
        return
    for t in templates:
        click.echo(f"  {t['name']}")
        click.echo(f"    참조: {t['ref_audio']}")
        click.echo(f"    대사: {t['ref_text'][:60]}...")
        click.echo()


@main.command()
@click.argument("name")
def remove(name: str):
    """보이스 템플릿 삭제."""
    remove_template(name)
    click.echo(f"템플릿 '{name}' 삭제 완료")


@main.command()
@click.argument("name")
@click.argument("text")
@click.option("--lang", "-l", default="Korean", help="언어 (Korean/English/Japanese/Chinese)")
@click.option("--output", "-o", default="output.wav", help="출력 파일 경로")
@click.option("--temperature", type=float, help="생성 온도 (기본 0.7)")
@click.option("--max-tokens", type=int, help="최대 토큰 (기본 4096)")
def gen(name: str, text: str, lang: str, output: str, temperature: float, max_tokens: int):
    """클론 음성 생성.

    \b
    예시:
      voice-clone gen 효율 "안녕하세요, 반갑습니다."
      voice-clone gen 효율 "Hello everyone!" --lang English -o hello.wav
    """
    overrides = {}
    if temperature is not None:
        overrides["temperature"] = temperature
    if max_tokens is not None:
        overrides["max_new_tokens"] = max_tokens

    click.echo(f"'{name}' 템플릿으로 생성 중...")
    path = generate(name, text, language=lang, output=output, **overrides)
    click.echo(f"완료! → {path}")


@main.command()
@click.argument("name")
@click.argument("texts", nargs=-1, required=True)
@click.option("--lang", "-l", default="Korean", help="언어")
@click.option("--prefix", "-p", default="output", help="출력 파일 접두사")
def batch(name: str, texts: tuple, lang: str, prefix: str):
    """여러 문장 배치 생성.

    \b
    예시:
      voice-clone batch 효율 "첫 번째 문장." "두 번째 문장." "세 번째 문장."
    """
    click.echo(f"'{name}' 템플릿으로 {len(texts)}개 문장 생성 중...")
    paths = generate_batch(name, list(texts), language=lang, output_prefix=prefix)
    for p in paths:
        click.echo(f"  → {p}")
    click.echo("완료!")


@main.command()
@click.argument("name")
def info(name: str):
    """템플릿 상세 정보."""
    meta = get_template(name)
    click.echo(f"이름: {meta['name']}")
    click.echo(f"모델: {meta['model_id']}")
    click.echo(f"참조 오디오: {meta['ref_audio']}")
    click.echo(f"참조 텍스트: {meta['ref_text']}")
    click.echo(f"생성 파라미터:")
    for k, v in meta.get("generate_params", {}).items():
        click.echo(f"  {k}: {v}")


if __name__ == "__main__":
    main()
