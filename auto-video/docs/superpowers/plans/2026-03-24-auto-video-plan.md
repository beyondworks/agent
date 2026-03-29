# Auto-Video 에이전트 팀 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Claude Code 기반 영상 콘텐츠 제작 에이전트 팀 구축 — 브랜드 세팅부터 최종 렌더링까지 파이프라인 완성

**Architecture:** Director 스킬이 팀장 역할로 Phase 1(브랜드 세팅) / Phase 2(콘텐츠 제작) 에이전트들을 오케스트레이션. 창작 판단은 Claude Code 서브에이전트, API 호출/렌더링은 Python 스크립트가 담당. 체크포인트 방식으로 주요 단계마다 사용자 승인.

**Tech Stack:** Gemini API (2.5 Flash/3 Flash/3 Pro/3.1 Pro), Nano Banana (이미지), Veo3 (영상), ElevenLabs (TTS), MoviePy (합성), Python 3.10+

**Spec:** `docs/superpowers/specs/2026-03-24-auto-video-design.md`

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `pyproject.toml`
- Create: `.gitignore`
- Create: `config/models.yaml`
- Create: `config/api-keys.env.example`
- Create: `brand/character.yaml` (빈 템플릿)
- Create: `brand/narrative.yaml` (빈 템플릿)
- Create: `brand/topics.yaml` (빈 템플릿)
- Create: `brand/benchmark.yaml` (빈 템플릿)

- [ ] **Step 1: git 초기화**

```bash
cd /Users/yoogeon/Agents/auto-video
git init
```

- [ ] **Step 2: pyproject.toml 생성**

```toml
[project]
name = "auto-video"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    "google-genai>=1.0.0",
    "elevenlabs>=1.0.0",
    "moviepy>=2.0.0",
    "pyyaml>=6.0",
    "httpx>=0.27.0",
    "pillow>=10.0.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "pytest-asyncio>=0.23"]
```

- [ ] **Step 3: .gitignore 생성**

```
config/api-keys.env
__pycache__/
*.pyc
.env
projects/*/scenes/*/visual.*
projects/*/scenes/*/voice.*
projects/*/output/
.DS_Store
.omc/
```

- [ ] **Step 4: config/models.yaml 생성**

Gemini 모델별 용도 매핑 설정 파일.

```yaml
models:
  research: "gemini-3-flash"
  script: "gemini-3.1-pro"
  scene_direction: "gemini-3-pro"
  image_prompt: "gemini-2.5-flash"
  image_generation: "nano-banana"
  video_generation: "veo-3"
  metadata: "gemini-3-flash"

api:
  gemini_base_url: "https://generativelanguage.googleapis.com"
  elevenlabs_base_url: "https://api.elevenlabs.io"
```

- [ ] **Step 5: config/api-keys.env.example 생성**

```env
GEMINI_API_KEY=your-gemini-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

- [ ] **Step 6: brand/ 디렉토리에 4개 YAML 템플릿 생성**

`character.yaml`, `narrative.yaml`, `topics.yaml`, `benchmark.yaml` — 스펙 문서 섹션 4의 스키마대로 빈 필드 포함.

- [ ] **Step 7: 디렉토리 구조 생성**

```bash
mkdir -p scripts agents/phase1 agents/phase2 skills/auto-video projects brand config
```

- [ ] **Step 8: 의존성 설치 및 커밋**

```bash
pip install -e ".[dev]"
git add -A
git commit -m "feat: 프로젝트 스캐폴딩 — 디렉토리 구조, 의존성, 설정 파일"
```

---

## Task 2: Gemini API 유틸리티 모듈

**Files:**
- Create: `scripts/gemini_client.py`
- Create: `tests/test_gemini_client.py`

공통 Gemini API 클라이언트. 모든 Gemini 관련 스크립트가 이 모듈을 사용.

- [ ] **Step 1: 테스트 작성**

```python
# tests/test_gemini_client.py
import pytest
from scripts.gemini_client import GeminiClient

def test_client_loads_config():
    """config/models.yaml에서 모델 매핑을 로드하는지 확인"""
    client = GeminiClient(config_path="config/models.yaml")
    assert client.get_model("research") == "gemini-3-flash"
    assert client.get_model("script") == "gemini-3.1-pro"

def test_client_requires_api_key():
    """API 키 없으면 명확한 에러"""
    with pytest.raises(ValueError, match="GEMINI_API_KEY"):
        GeminiClient(config_path="config/models.yaml", require_key=True)
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pytest tests/test_gemini_client.py -v
```
Expected: FAIL — `scripts.gemini_client` 모듈 없음

- [ ] **Step 3: gemini_client.py 구현**

google-genai SDK를 사용하여:
- `config/models.yaml` 로드
- 모델 이름 매핑 (`get_model(purpose)`)
- 텍스트 생성 (`generate_text(purpose, prompt)`)
- 이미지 생성 (`generate_image(prompt, output_path)`)
- API 키는 환경변수 `GEMINI_API_KEY`에서 로드

- [ ] **Step 4: 테스트 통과 확인**

```bash
pytest tests/test_gemini_client.py -v
```

- [ ] **Step 5: 커밋**

```bash
git add scripts/gemini_client.py tests/test_gemini_client.py
git commit -m "feat: Gemini API 클라이언트 — 모델 매핑, 텍스트/이미지 생성"
```

---

## Task 3: Nano Banana 이미지 생성 스크립트

**Files:**
- Create: `scripts/gemini_image.py`
- Create: `tests/test_gemini_image.py`

씬 연출 지시서(direction.yaml)를 읽고 → nano-banana-prompt-translator 스킬 형식으로 프롬프트 변환 → Gemini 이미지 생성 API 호출 → PNG 저장.

- [ ] **Step 1: 테스트 작성**

```python
# tests/test_gemini_image.py
import pytest
from scripts.gemini_image import build_image_prompt, save_image

def test_build_prompt_from_direction():
    """direction.yaml 내용으로 이미지 프롬프트 생성"""
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

def test_save_image_creates_file(tmp_path):
    """이미지 바이트를 파일로 저장"""
    fake_bytes = b'\x89PNG\r\n\x1a\n' + b'\x00' * 100
    output = tmp_path / "visual.png"
    save_image(fake_bytes, str(output))
    assert output.exists()
```

- [ ] **Step 2: 테스트 실패 확인**

- [ ] **Step 3: gemini_image.py 구현**

- `build_image_prompt(direction, base_prompt)`: direction.yaml + character.yaml의 `nano_banana_base_prompt`를 결합하여 최적화된 프롬프트 생성
- `generate_scene_image(direction_path, character_yaml_path, output_path)`: 전체 파이프라인 (방향 로드 → 프롬프트 빌드 → API 호출 → 저장)
- `save_image(image_bytes, output_path)`: 바이트를 PNG로 저장
- CLI 진입점: `python scripts/gemini_image.py --direction scenes/scene-01/direction.yaml --output scenes/scene-01/visual.png`

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

```bash
pytest tests/test_gemini_image.py -v
git add scripts/gemini_image.py tests/test_gemini_image.py
git commit -m "feat: Nano Banana 이미지 생성 — 프롬프트 빌드 + API 호출 + 저장"
```

---

## Task 4: Veo3 영상 생성 스크립트

**Files:**
- Create: `scripts/veo3_video.py`
- Create: `tests/test_veo3_video.py`

씬 연출 지시서 → Veo3 API로 영상 생성 → MP4 저장. Veo3는 Gemini API를 통해 접근.

- [ ] **Step 1: Veo3 API 문서 확인**

Gemini API의 Veo3 영상 생성 엔드포인트 확인. `google-genai` SDK의 비디오 생성 메서드 조사.

- [ ] **Step 2: 테스트 작성**

```python
# tests/test_veo3_video.py
import pytest
from scripts.veo3_video import build_video_prompt

def test_build_video_prompt_from_direction():
    direction = {
        "scene_number": 1,
        "visual_description": "로봇이 천천히 고개를 돌린다",
        "duration_sec": 5,
        "camera_movement": "slow pan right",
    }
    prompt = build_video_prompt(direction)
    assert "로봇" in prompt
    assert "slow pan" in prompt.lower() or "천천히" in prompt
```

- [ ] **Step 3: veo3_video.py 구현**

- `build_video_prompt(direction)`: 씬 지시서에서 영상 프롬프트 생성
- `generate_scene_video(direction_path, output_path)`: 전체 파이프라인
- CLI: `python scripts/veo3_video.py --direction scenes/scene-01/direction.yaml --output scenes/scene-01/visual.mp4`

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

```bash
pytest tests/test_veo3_video.py -v
git add scripts/veo3_video.py tests/test_veo3_video.py
git commit -m "feat: Veo3 영상 생성 — 프롬프트 빌드 + API 호출 + MP4 저장"
```

---

## Task 5: ElevenLabs TTS 스크립트

**Files:**
- Create: `scripts/elevenlabs_tts.py`
- Create: `tests/test_elevenlabs_tts.py`

대본 텍스트 → ElevenLabs API → MP3 저장. 씬별 분할된 대본 텍스트를 입력받음.

- [ ] **Step 1: 테스트 작성**

```python
# tests/test_elevenlabs_tts.py
import pytest
from scripts.elevenlabs_tts import split_script_to_scenes, save_audio

def test_split_script_extracts_scene_text():
    script = "## Scene 1\n안녕하세요.\n## Scene 2\n반갑습니다."
    scenes = split_script_to_scenes(script)
    assert len(scenes) == 2
    assert "안녕하세요" in scenes[0]

def test_save_audio_creates_file(tmp_path):
    fake_audio = b'\xff\xfb\x90\x00' + b'\x00' * 100
    output = tmp_path / "voice.mp3"
    save_audio(fake_audio, str(output))
    assert output.exists()
```

- [ ] **Step 2: 테스트 실패 확인**

- [ ] **Step 3: elevenlabs_tts.py 구현**

- `split_script_to_scenes(script_text)`: 대본을 씬 번호 기준으로 분할
- `generate_voice(text, voice_id, output_path)`: ElevenLabs API 호출 → MP3 저장
- `generate_all_voices(script_path, scenes_dir, voice_id)`: 전체 씬 일괄 생성
- CLI: `python scripts/elevenlabs_tts.py --script script.md --scenes-dir scenes/ --voice-id <id>`

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

```bash
pytest tests/test_elevenlabs_tts.py -v
git add scripts/elevenlabs_tts.py tests/test_elevenlabs_tts.py
git commit -m "feat: ElevenLabs TTS — 씬별 보이스 생성 + MP3 저장"
```

---

## Task 6: MoviePy 합성/렌더링 스크립트

**Files:**
- Create: `scripts/compositor.py`
- Create: `tests/test_compositor.py`

씬별 비주얼(이미지/영상) + 보이스(MP3) → 최종 MP4 합성. 이미지 씬은 보이스 길이만큼 정지 영상으로 변환.

- [ ] **Step 1: 테스트 작성**

```python
# tests/test_compositor.py
import pytest
from scripts.compositor import detect_scene_type, build_timeline

def test_detect_image_scene():
    assert detect_scene_type("scene-01/visual.png") == "image"
    assert detect_scene_type("scene-01/visual.mp4") == "video"

def test_build_timeline_order():
    scenes = [
        {"visual": "scene-01/visual.png", "voice": "scene-01/voice.mp3"},
        {"visual": "scene-02/visual.mp4", "voice": "scene-02/voice.mp3"},
    ]
    timeline = build_timeline(scenes)
    assert len(timeline) == 2
    assert timeline[0]["index"] == 0
    assert timeline[1]["index"] == 1
```

- [ ] **Step 2: 테스트 실패 확인**

- [ ] **Step 3: compositor.py 구현**

- `detect_scene_type(path)`: 이미지/영상 판별
- `image_to_clip(image_path, duration)`: 이미지를 지정 시간 정지 클립으로 변환
- `build_timeline(scenes)`: 씬 목록에서 타임라인 구성
- `render(project_dir, output_path, format)`: 전체 합성 → MP4 출력
  - format: "short" (9:16, 1분) / "long" (16:9)
- CLI: `python scripts/compositor.py --project projects/2026-03-24-test/ --format long`

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

```bash
pytest tests/test_compositor.py -v
git add scripts/compositor.py tests/test_compositor.py
git commit -m "feat: MoviePy 합성 — 씬 연결 + 오디오 오버레이 + 렌더링"
```

---

## Task 7: YouTube 메타데이터 생성 스크립트

**Files:**
- Create: `scripts/youtube_metadata.py`
- Create: `tests/test_youtube_metadata.py`

대본 + 브랜드 가이드 → Gemini API로 YouTube 제목/설명/태그 생성 → metadata.yaml 저장.

- [ ] **Step 1: 테스트 작성**

```python
# tests/test_youtube_metadata.py
import pytest
from scripts.youtube_metadata import validate_metadata

def test_validate_metadata_structure():
    metadata = {
        "title": "테스트 영상",
        "description": "설명입니다",
        "tags": ["태그1", "태그2"],
    }
    assert validate_metadata(metadata) is True

def test_validate_rejects_empty_title():
    metadata = {"title": "", "description": "설명", "tags": []}
    assert validate_metadata(metadata) is False
```

- [ ] **Step 2: 테스트 실패 확인**

- [ ] **Step 3: youtube_metadata.py 구현**

- `generate_metadata(script_path, brand_dir, gemini_client)`: Gemini 3 Flash로 메타데이터 생성
- `validate_metadata(metadata)`: 필수 필드 검증
- CLI: `python scripts/youtube_metadata.py --script script.md --brand brand/ --output metadata.yaml`

- [ ] **Step 4: 테스트 통과 확인 및 커밋**

```bash
pytest tests/test_youtube_metadata.py -v
git add scripts/youtube_metadata.py tests/test_youtube_metadata.py
git commit -m "feat: YouTube 메타데이터 — Gemini로 제목/설명/태그 자동 생성"
```

---

## Task 8: Phase 1 에이전트 프롬프트 (브랜드 세팅)

**Files:**
- Create: `agents/phase1/brand-architect.md`
- Create: `agents/phase1/narrative-designer.md`
- Create: `agents/phase1/topic-strategist.md`
- Create: `agents/phase1/benchmark-analyst.md`

각 에이전트 프롬프트에 포함할 내용:
- 역할 정의 및 전문 영역
- 입력/출력 형식 (YAML 스키마)
- 참조할 브랜드 가이드 파일 경로
- 품질 기준 및 체크리스트
- 사용자와의 상호작용 패턴 (질문, 제안, 승인 요청)

- [ ] **Step 1: brand-architect.md 작성**

캐릭터 스타일/페르소나 설정 전문 에이전트. 사용자와 대화하며 `character.yaml`을 채워나감.
- 입력: 사용자의 채널 방향, 레퍼런스
- 출력: `brand/character.yaml` 완성
- Nano Banana 기본 프롬프트 도출 포함

- [ ] **Step 2: narrative-designer.md 작성**

서사 구조/패턴 설계 에이전트. `character.yaml` 참조하며 `narrative.yaml` 생성.
- 입력: `brand/character.yaml` + 사용자 방향
- 출력: `brand/narrative.yaml` 완성
- 에피소드 공식 (숏폼/롱폼) 설계 포함

- [ ] **Step 3: topic-strategist.md 작성**

주제 영역 정의 에이전트. 채널 포지셔닝과 콘텐츠 기둥 설계.
- 입력: `brand/character.yaml`, `brand/narrative.yaml` + 사용자 관심 영역
- 출력: `brand/topics.yaml` 완성

- [ ] **Step 4: benchmark-analyst.md 작성**

성공 채널 분석 에이전트. 웹 검색으로 벤치마킹 대상 발굴.
- 입력: `brand/topics.yaml` + 사용자 지정 채널
- 출력: `brand/benchmark.yaml` 완성
- 썸네일/제목/첫3초/리텐션 체크리스트 포함

- [ ] **Step 5: 커밋**

```bash
git add agents/phase1/
git commit -m "feat: Phase 1 에이전트 프롬프트 — 브랜드 세팅 4종"
```

---

## Task 9: Phase 2 에이전트 프롬프트 (콘텐츠 제작)

**Files:**
- Create: `agents/phase2/researcher.md`
- Create: `agents/phase2/scriptwriter.md`
- Create: `agents/phase2/scene-director.md`
- Create: `agents/phase2/image-generator.md`
- Create: `agents/phase2/video-generator.md`
- Create: `agents/phase2/voice-producer.md`
- Create: `agents/phase2/compositor.md`

- [ ] **Step 1: researcher.md 작성**

리서치 에이전트. 주제에 대한 Top 채널, 뉴스, SNS 정보 수집.
- 입력: 주제 키워드 + `brand/topics.yaml`
- 출력: `projects/{slug}/research.md`
- 웹 검색 도구 활용 (WebSearch, WebFetch)
- 정보를 구조화하여 scriptwriter가 바로 활용 가능한 형태로 정리

- [ ] **Step 2: scriptwriter.md 작성**

대본 작성 에이전트. 리서치 + 브랜드 가이드 기반.
- 입력: `research.md` + `brand/` 전체 (character, narrative, topics, benchmark)
- 출력: `projects/{slug}/script.md`
- 씬 구분 마크다운 형식 (`## Scene 1`, `## Scene 2` ...)
- 숏폼/롱폼 에피소드 공식 준수
- 벤치마킹 체크리스트 반영

- [ ] **Step 3: scene-director.md 작성**

씬 연출 에이전트. 대본의 각 씬을 시각 연출 지시서로 변환.
- 입력: `script.md` + `brand/character.yaml`
- 출력: `scenes/scene-XX/direction.yaml` (각 씬)
- direction.yaml 스키마:
  ```yaml
  scene_number: 1
  visual_description: ""     # 시각적 묘사
  visual_type: "image|video" # 이미지 or 영상
  duration_sec: 5            # 영상인 경우 길이
  camera_movement: ""        # 카메라 무빙 (영상용)
  mood: ""                   # 분위기
  dialogue: ""               # 해당 씬 대사 텍스트
  style_override: null       # 스타일 오버라이드 (없으면 기본)
  ```
- 캐릭터 일관성 유지를 위한 시각 키워드 주입

- [ ] **Step 4: image-generator.md 작성**

이미지 생성 실행 에이전트. direction.yaml → gemini_image.py 호출.
- 입력: `scenes/scene-XX/direction.yaml` (visual_type == "image")
- 출력: `scenes/scene-XX/visual.png`
- nano-banana-prompt-translator 스킬 연계
- `scripts/gemini_image.py` 실행 위임

- [ ] **Step 5: video-generator.md 작성**

영상 생성 실행 에이전트. direction.yaml → veo3_video.py 호출.
- 입력: `scenes/scene-XX/direction.yaml` (visual_type == "video")
- 출력: `scenes/scene-XX/visual.mp4`
- `scripts/veo3_video.py` 실행 위임

- [ ] **Step 6: voice-producer.md 작성**

보이스 생성 실행 에이전트. 씬별 대사 → elevenlabs_tts.py 호출.
- 입력: `script.md` + 씬 번호
- 출력: `scenes/scene-XX/voice.mp3`
- `scripts/elevenlabs_tts.py` 실행 위임
- 음성 설정 (voice_id, stability, similarity_boost 등)

- [ ] **Step 7: compositor.md 작성**

합성 실행 에이전트. 전체 씬 비주얼 + 보이스 → compositor.py 호출.
- 입력: `projects/{slug}/` 전체 디렉토리
- 출력: `projects/{slug}/output/final.mp4`, `thumbnail.png`, `metadata.yaml`
- `scripts/compositor.py` + `scripts/youtube_metadata.py` 실행 위임

- [ ] **Step 8: 커밋**

```bash
git add agents/phase2/
git commit -m "feat: Phase 2 에이전트 프롬프트 — 콘텐츠 제작 7종"
```

---

## Task 10: Director 에이전트 프롬프트

**Files:**
- Create: `agents/director.md`

팀장 에이전트. 전체 워크플로우를 오케스트레이션.

- [ ] **Step 1: director.md 작성**

Director 프롬프트에 포함할 내용:

**Phase 판단 로직:**
- `brand/` 디렉토리에 4개 YAML이 비어있으면 → Phase 1
- 4개 YAML이 채워져 있으면 → Phase 2 진입 가능
- 사용자가 명시적으로 Phase 지정 시 해당 Phase 실행

**Phase 1 오케스트레이션:**
```
brand-architect → (승인) → narrative-designer → (승인) → topic-strategist → (승인) → benchmark-analyst → (승인) → Phase 1 완료
```

**Phase 2 오케스트레이션:**
```
사용자 주제 입력 → 콘텐츠 유형/영상 스타일 선택
→ researcher → (체크포인트)
→ scriptwriter → (체크포인트)
→ scene-director → (체크포인트)
→ image-generator + video-generator (병렬) → (체크포인트)
→ voice-producer → (체크포인트)
→ compositor → (체크포인트)
→ 완료
```

**체크포인트 로직:**
- 각 단계 완료 시 결과물 요약을 사용자에게 표시
- "승인/수정/재생성" 선택지 제공
- 수정 요청 시 피드백을 해당 에이전트에 전달
- 3회 수정 초과 시 방향 재확인

**에이전트 호출 방식:**
- 창작 에이전트: `Agent` 도구로 서브에이전트 생성, 에이전트 프롬프트 파일을 읽어서 prompt에 주입
- 실행 에이전트: `Agent` 도구 + `Bash`로 Python 스크립트 실행

- [ ] **Step 2: 커밋**

```bash
git add agents/director.md
git commit -m "feat: Director 에이전트 — 팀장 오케스트레이션 로직"
```

---

## Task 11: /auto-video 스킬 진입점

**Files:**
- Create: `skills/auto-video/SKILL.md`

Claude Code 스킬로 등록. `/auto-video` 명령으로 Director를 실행.

- [ ] **Step 1: SKILL.md 작성**

```markdown
---
name: auto-video
description: AI 영상 콘텐츠 제작 에이전트 팀. Phase 1(브랜드 세팅) + Phase 2(콘텐츠 제작) 파이프라인.
---

[Director 에이전트 프롬프트 전체 내용 또는 참조]
```

- Director 에이전트가 `agents/director.md`를 읽고 실행
- 사용자 명령 파싱: `/auto-video` (자동 Phase 판단), `/auto-video brand` (Phase 1 강제), `/auto-video create "주제"` (Phase 2 강제)

- [ ] **Step 2: Claude Code 스킬 등록 확인**

스킬 파일이 올바른 위치에 있는지 확인. 필요시 `settings.json`에 스킬 경로 추가.

- [ ] **Step 3: 커밋**

```bash
git add skills/auto-video/
git commit -m "feat: /auto-video 스킬 진입점 — Director 오케스트레이션 시작"
```

---

## Task 12: 통합 테스트 및 검증

- [ ] **Step 1: 전체 테스트 실행**

```bash
pytest tests/ -v
```

- [ ] **Step 2: Phase 1 드라이런**

`/auto-video brand` 실행하여 Director → Phase 1 에이전트 순차 호출 확인. brand/ YAML 파일이 채워지는지 검증.

- [ ] **Step 3: Phase 2 드라이런**

더미 brand/ 데이터로 `/auto-video create "테스트 주제"` 실행. 각 체크포인트 정상 동작 확인.

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: 통합 테스트 및 검증 완료"
```

---

## 실행 순서 요약

| 순서 | Task | 의존성 | 병렬 가능 |
|------|------|--------|----------|
| 1 | 프로젝트 스캐폴딩 | 없음 | - |
| 2 | Gemini 클라이언트 | Task 1 | - |
| 3 | Nano Banana 이미지 | Task 2 | Task 3,4,5 병렬 |
| 4 | Veo3 영상 | Task 2 | Task 3,4,5 병렬 |
| 5 | ElevenLabs TTS | Task 1 | Task 3,4,5 병렬 |
| 6 | MoviePy 합성 | Task 1 | Task 6,7 병렬 |
| 7 | YouTube 메타데이터 | Task 2 | Task 6,7 병렬 |
| 8 | Phase 1 에이전트 | Task 1 | Task 8,9 병렬 |
| 9 | Phase 2 에이전트 | Task 3,4,5,6,7 | Task 8,9 병렬 |
| 10 | Director | Task 8,9 | - |
| 11 | 스킬 진입점 | Task 10 | - |
| 12 | 통합 테스트 | Task 11 | - |
