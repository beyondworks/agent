# voice-clone

Qwen3 TTS 기반 보이스 클론 CLI. 참조 오디오로 보이스 템플릿을 등록하고, 어디서든 명령어 하나로 클론 음성을 생성합니다.

## 설치

```bash
pip install git+https://github.com/yoogeon/voice-clone.git
```

## 빠른 시작

### 1. 보이스 템플릿 등록

```bash
voice-clone register 효율 \
  --audio ./my_voice.mp3 \
  --text "참조 오디오에서 말하는 정확한 대사"
```

- 참조 오디오: WAV/MP3/M4A, 10~20초 권장 (최소 3초)
- 모노, 배경음 없는 깨끗한 음성
- `--text`는 오디오 내용의 **정확한 전사** (품질에 큰 영향)

### 2. 클론 음성 생성

```bash
# 단일 문장
voice-clone gen 효율 "안녕하세요, 반갑습니다." -o output.wav

# 영어
voice-clone gen 효율 "Hello everyone!" --lang English -o hello.wav

# 배치 (여러 문장)
voice-clone batch 효율 "첫 번째." "두 번째." "세 번째."
```

### 3. 관리

```bash
voice-clone list          # 등록된 템플릿 목록
voice-clone info 효율      # 상세 정보
voice-clone remove 효율    # 삭제
```

## 지원 환경

| 환경 | 디바이스 | dtype |
|------|----------|-------|
| NVIDIA GPU | CUDA | bfloat16 |
| Apple Silicon | MPS | float32 |
| CPU | cpu | float32 (느림) |

디바이스는 자동 감지됩니다.

## 최적 파라미터

한국어 끝음("다") 잘림 방지를 위해 기본값이 조정되어 있습니다:

| 파라미터 | 기본값 | Qwen3 원본 | 이유 |
|----------|--------|------------|------|
| `max_new_tokens` | 4096 | 2048 | EOS 전 충분한 코덱 생성 |
| `temperature` | 0.7 | 0.9 | 안정적 종결 |
| `repetition_penalty` | 1.0 | 1.05 | 끝음 토큰 억제 방지 |

CLI에서 오버라이드:

```bash
voice-clone gen 효율 "텍스트" --temperature 0.5 --max-tokens 8192
```

## 지원 언어

Korean, English, Chinese, Japanese, German, French, Russian, Portuguese, Spanish, Italian

## 모델

기본: `Qwen/Qwen3-TTS-12Hz-0.6B-Base` (~4GB VRAM)

## 템플릿 저장 위치

`~/.voice-clone/templates/` — 시스템 전역, 모든 프로젝트에서 공유됩니다.

## 라이선스

MIT
