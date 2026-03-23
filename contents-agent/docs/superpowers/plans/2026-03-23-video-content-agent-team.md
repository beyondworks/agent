# Video Content Agent Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Claude Code 기반 영상 콘텐츠 제작 에이전트 팀 구축 - 오케스트레이터 스킬 + 7개 서브에이전트 프롬프트 + 설정 파일

**Architecture:** 단일 SKILL.md(Director)가 Agent 도구로 7개 서브에이전트를 순차 호출하는 스킬 체인. 상태는 meta.json으로 추적하고, pipeline.json의 approvalGates로 승인 게이트를 제어한다.

**Tech Stack:** Claude Code Skills/Agents (Markdown prompts), JSON config, Bash (ffmpeg, 파일 복사)

**Spec:** `docs/superpowers/specs/2026-03-23-video-content-agent-team-design.md`

---

## File Map

### 생성할 파일

| 파일 | 책임 |
|------|------|
| `config/pipeline.json` | 파이프라인 설정 (승인 게이트, 기본값, 재시도 정책) |
| `config/styles.json` | 영상 스타일 프리셋 (색상, 모션 규칙, 자막 스타일, 한글 규칙) |
| `agents/researcher.md` | 리서치 에이전트 프롬프트 |
| `agents/scriptwriter.md` | 대본 에이전트 프롬프트 |
| `agents/subtitle-engineer.md` | 자막 에이전트 프롬프트 |
| `agents/voice-engineer.md` | 보이스 에이전트 프롬프트 |
| `agents/scene-designer.md` | 씬 디자인 에이전트 프롬프트 |
| `agents/renderer.md` | 렌더링 에이전트 프롬프트 |
| `agents/qa-reviewer.md` | QA 에이전트 프롬프트 |
| `skills/create-video/SKILL.md` | 오케스트레이터 스킬 (Director 역할). 스펙의 `agents/director.md`는 별도 파일로 두지 않고 SKILL.md에 통합. SKILL.md가 파이프라인 제어 + 승인 게이트 + 에이전트 호출을 모두 담당 |
| `guides/assets/sources.md` | 아이콘 출처 기록 |

### 복사할 파일 (기존 자산)

| 원본 | 대상 |
|------|------|
| `~/Agents/Creator/profiles/character-v1.json` | `profiles/character-v1.json` |
| `~/Agents/Creator/profiles/character-narrative-v1.md` | `profiles/character-narrative-v1.md` |
| `~/Agents/Creator/profiles/benchmarks.json` | `profiles/benchmarks.json` |
| `~/Agents/Creator/profiles/maker-evan.json` | `profiles/maker-evan.json` |
| `~/Agents/contents-creator/CHARACTER_AND_CHECKLIST.md` | `guides/CHARACTER_AND_CHECKLIST.md` |
| `~/Agents/contents-creator/voice/김효율.m4a` | `voice/김효율.m4a` |

### 생성할 디렉토리 (빈 폴더)

```
guides/style-references/
guides/prompt-guides/
guides/topic-templates/
guides/assets/icons/
projects/
voice/
```

---

## Task 1: 프로젝트 스캐폴딩 + 기존 자산 복사

**Files:**
- Create: 디렉토리 구조 전체
- Copy: profiles/, guides/, voice/ 내 기존 자산

- [ ] **Step 1: 디렉토리 구조 생성**

```bash
cd "/Users/yoogeon/Agents/contents agent"
mkdir -p skills/create-video agents profiles guides/style-references guides/prompt-guides guides/topic-templates guides/assets/icons config projects voice
```

- [ ] **Step 2: 기존 프로필 파일 복사**

```bash
cp ~/Agents/Creator/profiles/character-v1.json profiles/
cp ~/Agents/Creator/profiles/character-narrative-v1.md profiles/
cp ~/Agents/Creator/profiles/benchmarks.json profiles/
cp ~/Agents/Creator/profiles/maker-evan.json profiles/
```

- [ ] **Step 3: 캐릭터 가이드 + 보이스 클론 소스 복사**

```bash
cp ~/Agents/contents-creator/CHARACTER_AND_CHECKLIST.md guides/
cp ~/Agents/contents-creator/voice/김효율.m4a voice/
```

- [ ] **Step 4: 아이콘 출처 파일 생성**

`guides/assets/sources.md` 생성:
```markdown
# Asset Sources

AI 도구/서비스 로고 SVG 파일의 다운로드 출처를 기록한다.
검색 순서: Iconify → lobehub

| 파일명 | 출처 | 다운로드일 |
|--------|------|-----------|
| (씬 생성 시 추가) | | |
```

- [ ] **Step 5: 디렉토리 구조 검증**

```bash
cd "/Users/yoogeon/Agents/contents agent"
find . -not -path './.omc/*' -not -path './docs/*' | sort
```

Expected: skills/, agents/, profiles/ (4 files), guides/ (1 file + 4 subdirs), config/, projects/, voice/ (1 file)

---

## Task 2: 설정 파일 생성 (pipeline.json + styles.json)

**Files:**
- Create: `config/pipeline.json`
- Create: `config/styles.json`

- [ ] **Step 1: pipeline.json 생성**

`config/pipeline.json` — 스펙 5.1절의 내용을 그대로 작성:
```json
{
  "version": "1.0",
  "mode": "approval",
  "approvalGates": {
    "research": false,
    "script": true,
    "subtitle": false,
    "voice": true,
    "scenes": true,
    "render": false,
    "qa": true
  },
  "defaults": {
    "format": "longform",
    "style": "infographic-motion",
    "character": "character-v1",
    "targetRuntime": 600,
    "language": "ko",
    "ttsModel": "qwen3-1.7b",
    "ttsCloneSource": "김효율.m4a",
    "imageModel": "gemini3-nano-banana",
    "videoModel": "gemini3-veo3",
    "renderEngine": "tbd"
  },
  "koreanPace": {
    "charsPerMinute": 275,
    "ttsSpeedMultiplier": 1.85
  },
  "retryPolicy": {
    "maxRetries": 2,
    "retryableStages": ["research", "voice", "scenes", "render"]
  }
}
```

- [ ] **Step 2: styles.json 생성**

`config/styles.json`:
```json
{
  "styles": {
    "infographic-motion": {
      "description": "MUI 다크모드 + CLI 애니메이션 + 절제된 글래스모피즘",
      "colorPalette": {
        "background": "#001C2F",
        "primary": "#06E5AC",
        "secondary": "#16213e",
        "accent": "#4DFFD2",
        "text": "#f1f1f1",
        "subtitleBg": "#000000cc"
      },
      "fontStyle": "sans",
      "darkMode": true,
      "visualStyle": [
        "MUI 다크모드 컴포넌트 스타일",
        "CLI/터미널 애니메이션",
        "절제된 글래스모피즘 (과하지 않게)"
      ],
      "motionRules": [
        "3~5초마다 시각 변화",
        "나레이션 싱크 애니메이션 (타이핑, 프로세스 시간차, 등장 모션)",
        "단순 줌인/줌아웃만으로 동적 처리 금지",
        "빈 화면 0%"
      ],
      "iconRules": [
        "모든 아이콘은 SVG 벡터",
        "AI 도구/서비스 로고: Iconify, lobehub에서 SVG 다운로드",
        "이모지/이모티콘 사용 금지"
      ],
      "referenceImages": [],
      "promptGuide": "nano-banana-official"
    },
    "character-animation": {
      "description": "고정 캐릭터 아바타 + 설명 모션",
      "colorPalette": {
        "_note": "infographic-motion과 동일한 팔레트 사용",
        "background": "#001C2F",
        "primary": "#06E5AC",
        "secondary": "#16213e",
        "accent": "#4DFFD2",
        "text": "#f1f1f1",
        "subtitleBg": "#000000cc"
      },
      "characterAssets": [],
      "motionRules": [
        "캐릭터 표정/제스처 변화로 감정 전달",
        "배경 전환으로 주제 변화 표현"
      ],
      "referenceImages": [],
      "promptGuide": "veo3-official"
    }
  },
  "subtitleStyle": {
    "position": "bottom",
    "maxLines": 1,
    "fontSize": "large",
    "background": "#000000cc",
    "fontColor": "#f1f1f1",
    "style": "youtube-standard"
  },
  "koreanTextRules": {
    "accuracy": "한글 표기 정확성 필수",
    "noEmoji": true,
    "englishProperNouns": {
      "rule": "한글 발음으로 변환",
      "examples": {
        "Claude Code": "클로드코드",
        "ChatGPT": "챗지피티",
        "Roll Back": "롤빽",
        "Cursor": "커서",
        "Vercel": "버쎌",
        "GitHub": "깃허브",
        "Copilot": "코파일럿"
      },
      "note": "신규 고유명사는 대본 생성 시 발음 변환표에 추가"
    }
  }
}
```

- [ ] **Step 3: JSON 유효성 검증**

```bash
python3 -c "import json; json.load(open('config/pipeline.json')); print('pipeline.json OK')"
python3 -c "import json; json.load(open('config/styles.json')); print('styles.json OK')"
```

Expected: 두 파일 모두 OK

---

## Task 3: Researcher 에이전트 프롬프트

**Files:**
- Create: `agents/researcher.md`

- [ ] **Step 1: researcher.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 주제에 대한 Top 채널/콘텐츠/뉴스/SNS 정보 수집
- 입력: 주제 문자열, `benchmarks.json` 내용
- 출력: `research/sources.md` 포맷 정의
- 도구: WebSearch, WebFetch 사용 지시
- 병렬 실행: 뉴스 + 유튜브 + SNS 동시 검색
- 출력 포맷: 수집 정보 + 출처 URL + 핵심 인사이트 + Transcript 라인 번호
- 팩트 검증: 출처 없는 정보 사용 금지

프롬프트 구조:
```markdown
---
name: researcher
description: 영상 콘텐츠 주제에 대한 리서치 정보 수집
model: sonnet
---

# Researcher Agent

## 역할
...

## 입력
...

## 출력 포맷 (research/sources.md)
...

## 실행 규칙
...

## 검색 전략
...
```

- [ ] **Step 2: 프롬프트에서 benchmarks.json 채널 목록 참조 확인**

benchmarks.json의 채널 리스트 (메이커 에반, 코드깎는노인, Liam Ottley 등)가 검색 대상으로 포함되는지 확인.

---

## Task 4: Scriptwriter 에이전트 프롬프트

**Files:**
- Create: `agents/scriptwriter.md`

- [ ] **Step 1: scriptwriter.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 리서치 기반 캐릭터 톤/구조 대본 생성
- 입력: `research/sources.md`, `CHARACTER_AND_CHECKLIST.md`, `character-v1.json`
- 출력: `script/draft.md` (스펙 4.3절 정규 포맷: `## Scene N` / `### Duration` / `### Narration` / `### Visual Direction`)
- 기승전결 구조 필수 (기/승/전/결 각 파트 설명)
- 캐릭터 고유 관점 해석 필수 (기획자 렌즈 변환표 전문 포함)
- TTS 보정 공식 포함 (509자/분, 목표 러닝타임 x 509)
- Do 리스트 8개 / Don't 리스트 11개 전문 포함
- 영문 고유명사 → 한글 발음 변환표 포함
- 이모지/이모티콘 금지
- 팩트 검증 규칙
- 씬 단위 구조 (핵심 주장 → 근거 → 비유 → 전환, 최대 90초)

프롬프트 구조:
```markdown
---
name: scriptwriter
description: 캐릭터 톤/구조에 맞는 영상 대본 생성
model: opus
---

# Scriptwriter Agent

## 역할
...

## 입력 파일
...

## 출력 포맷 (script/draft.md)
(스펙 4.3절 정규 포맷 그대로)

## 기승전결 구조
...

## 캐릭터 고유 관점 (기획자 렌즈)
(character-v1.json의 perspective, interpreterRole 전문)

## TTS 보정 글자 수 계산
...

## Do 리스트
...

## Don't 리스트
...

## 영문 고유명사 발음 변환표
...
```

주의: Scriptwriter는 가장 복잡한 에이전트. character-v1.json과 CHARACTER_AND_CHECKLIST.md의 핵심 규칙을 프롬프트에 직접 포함하되, 원본 파일도 Read하도록 지시.

---

## Task 5: Subtitle Engineer 에이전트 프롬프트

**Files:**
- Create: `agents/subtitle-engineer.md`

- [ ] **Step 1: subtitle-engineer.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 대본 → SRT 자막 파일 생성 + 타이밍 계산
- 입력: `script/final.md` (정규 포맷)
- 출력: `subtitles/final.srt`
- 파싱 규칙: `## Scene N` 구분자, `### Narration` 텍스트 추출
- 타이밍 계산: `자막 글자 수 / 509 * 60 = 표시 시간(초)`. 누적하여 시작/끝 시간 산출
- 1줄 쓰기 규칙: 한 자막에 최대 1줄. 긴 문장은 의미 단위로 분할
- SRT 포맷 예시 포함

```
1
00:00:00,000 --> 00:00:02,400
설계를 고치니까 결과가 달라졌습니다

2
00:00:02,400 --> 00:00:04,700
...
```

---

## Task 6: Voice Engineer 에이전트 프롬프트

**Files:**
- Create: `agents/voice-engineer.md`

- [ ] **Step 1: voice-engineer.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: Qwen3 TTS 1.7B로 클론 보이스 생성
- 입력: `script/final.md`, `subtitles/final.srt`
- 출력: `voice/narration.wav` (원본) + `voice/narration.mp3` (변환)
- TTS 소스: `~/Desktop/Appbuild/TTStudio_v2/` 내 모델/추론 코드 참조
- 클론 소스: `voice/김효율.m4a`
- 한국어 끝음 보존 규칙 (다/요/까 종성 ㄷ/ㅇ/ㄲ)
- 문장 간 흐름 연결
- 잡음/트래시보이스 제거
- WAV→MP3 변환 (ffmpeg)
- 자막 싱크 검증: 실제 음성 길이 vs SRT 타이밍 비교
- 피드백 루프: 오차 0.5초 초과 시 SRT 타이밍 직접 수정 (최대 2회)

주의: TTStudio 소스 구조를 탐색하여 모델 로드/추론 방법을 파악해야 한다. 프롬프트에 `~/Desktop/Appbuild/TTStudio_v2/` 탐색 지시 포함.

---

## Task 7: Scene Designer 에이전트 프롬프트

**Files:**
- Create: `agents/scene-designer.md`

- [ ] **Step 1: scene-designer.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 대본 맥락에 맞는 이미지/영상 씬 + 썸네일 생성
- 입력: `script/final.md`, `subtitles/final.srt`, `config/styles.json`, 레퍼런스 이미지
- 출력: `scenes/scene-NNN.png` 또는 `.mp4` + `scenes/thumbnail.png`
- 도구: Gemini 3 API (Nano Banana 이미지, Veo 3 영상)
- 비주얼 스타일 규칙 (styles.json에서 로드):
  - 배경 #001C2F, 프라이머리 #06E5AC, 악센트 #4DFFD2
  - MUI 다크모드 + CLI 애니메이션 + 절제된 글래스모피즘
- 모션 규칙:
  - 3~5초마다 시각 변화
  - 정적 이미지 금지 (줌인/줌아웃만 금지)
  - 허용: 타이핑 모션, 프로세스 시간차, 요소 등장 모션
- 한글 표기 정확성
- SVG 벡터 아이콘 (Iconify, lobehub에서 다운로드)
- 이모지/이모티콘 금지
- 해상도: 1920x1080+, PNG/MP4(H.264)
- 레퍼런스 이미지 분석 → 스타일 추출 → 프롬프트 반영
- 썸네일: D16(3초 읽힘) + D17(제목과 보완)
- Nano Banana / Veo 3 프롬프트 가이드 참조 지시 (`guides/prompt-guides/` 확인, 없으면 조사 후 생성)

---

## Task 8: Renderer 에이전트 프롬프트

**Files:**
- Create: `agents/renderer.md`

- [ ] **Step 1: renderer.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 영상 + 자막 + 보이스 합성
- 입력: `scenes/`, `subtitles/final.srt`, `voice/narration.wav`
- 출력: `output/final.mp4`
- 도구: TBD (초기 MVP는 FFmpeg 기반)
- MVP 입출력 사양:
  - 입력: PNG/MP4(씬), WAV/MP3(오디오), SRT(자막)
  - 출력: MP4 (H.264, AAC, 30fps)
  - 해상도: 1920x1080 기본
  - 자막: SRT burn-in, 하단 배치, #000000cc 배경, #f1f1f1 폰트
- 보이스-자막 싱크 검증 (0.5초 이내)
- FFmpeg 기본 명령어 예시 포함 (씬 시퀀스 + 오디오 + 자막 합성)

---

## Task 9: QA Reviewer 에이전트 프롬프트

**Files:**
- Create: `agents/qa-reviewer.md`

- [ ] **Step 1: qa-reviewer.md 작성**

프롬프트에 포함할 핵심 요소:
- 역할: 26항목 체크리스트 + Don't 11항목 + 팩트 검증
- 입력: 프로젝트 전체 산출물, CHARACTER_AND_CHECKLIST.md
- 출력: `qa-report.md` (항목별 pass/fail + 수정 제안)
- 26항목 체크리스트 전문 포함 (CHARACTER_AND_CHECKLIST.md 섹션 10)
- 필수 7개 별도 강조 (A1, A3, B5, B9, D14, F22, G26)
- Don't 리스트 11개 전문 포함
- 점검 순서:
  1. 필수 7개 → 1개라도 미통과 시 수정 요청
  2. 나머지 19개 중 15개+ (전체 22개+, 85%)
  3. Don't 위반 확인
  4. 팩트 검증
  5. 정적 화면 10초+ 확인
- 출력 포맷:

```markdown
# QA Report — {프로젝트명}

## 결과 요약
- 필수 7개: {N}/7 통과
- 전체 26개: {N}/26 통과 ({N}%)
- Don't 위반: {N}건
- 판정: PASS / FAIL

## 상세 결과
### A. 포지셔닝
| # | 항목 | 결과 | 비고 |
|---|------|------|------|
| A1 | ... | PASS/FAIL | ... |
...

## 수정 제안
1. ...
```

---

## Task 10: Director 오케스트레이터 스킬 (SKILL.md)

**Files:**
- Create: `skills/create-video/SKILL.md`

**의존성:** Task 2~9 완료 후 진행 (모든 config + 에이전트 프롬프트 필요)

- [ ] **Step 1: SKILL.md 작성**

이 파일이 전체 파이프라인의 핵심. `/create-video "주제"` 명령으로 실행된다.

프롬프트에 포함할 핵심 요소:

```markdown
---
name: create-video
description: 영상 콘텐츠 제작 파이프라인 실행
---

# Create Video — Director Skill

## 사용법
/create-video "주제"
/create-video --style character-animation "주제"
/create-video --character v2-tech "주제"
/create-video --runtime 7 "주제"
```

Director 로직:
1. **Init**: 인자 파싱 → pipeline.json 로드 → 프로젝트 폴더 생성 (`projects/YYYY-MM-DD-{slug}/`) → meta.json 초기화
2. **Research**: Agent 도구로 researcher 호출 → sources.md 확인 → meta.json 업데이트
3. **Script**: Agent 도구로 scriptwriter 호출 (CHARACTER_AND_CHECKLIST.md + character-v1.json 컨텍스트 전달) → draft.md 생성
4. **Approval Gate (script)**: pipeline.json 확인 → 승인 게이트 ON이면 사용자에게 대본 요약 + 승인 요청 → 승인 시 final.md로 확정
5. **Subtitle**: Agent 도구로 subtitle-engineer 호출 → final.srt 생성
6. **Voice**: Agent 도구로 voice-engineer 호출 → narration.wav/mp3 생성 → 싱크 검증
7. **Approval Gate (voice)**: 승인 게이트 확인
8. **Scenes**: Agent 도구로 scene-designer 호출 → 씬 이미지/영상 + 썸네일 생성
9. **Approval Gate (scenes)**: 승인 게이트 확인
10. **Render**: Agent 도구로 renderer 호출 → final.mp4 생성
11. **QA**: Agent 도구로 qa-reviewer 호출 → qa-report.md 생성
12. **Approval Gate (qa)**: QA 결과 제시 → PASS면 완료, FAIL이면 수정 단계 식별 → 재실행
13. **Done**: meta.json → done 상태

에러 핸들링:
- 각 단계 실패 시 retryPolicy 확인 → 재시도 또는 사용자 보고
- QA FAIL 시 수정 필요 단계 식별 → 해당 단계 + 이후 단계 재실행

승인 게이트 UX:
- 산출물 경로 출력
- 요약 제시
- 선택지: [승인] / [수정 요청 + 피드백] / [재생성]

---

## Task 11: 통합 검증 (Dry Run)

**의존성:** Task 1~10 완료 후 진행

- [ ] **Step 1: 파일 구조 최종 검증**

```bash
cd "/Users/yoogeon/Agents/contents agent"
echo "=== Config ===" && cat config/pipeline.json | python3 -c "import sys,json; json.load(sys.stdin); print('OK')"
echo "=== Styles ===" && cat config/styles.json | python3 -c "import sys,json; json.load(sys.stdin); print('OK')"
echo "=== Profiles ===" && ls profiles/
echo "=== Guides ===" && ls guides/
echo "=== Agents ===" && ls agents/
echo "=== Skills ===" && ls skills/create-video/
echo "=== Voice ===" && ls voice/
```

- [ ] **Step 2: 에이전트 프롬프트 필수 요소 체크**

각 에이전트 파일에 다음이 포함되어 있는지 확인:
- frontmatter (name, description)
- 역할 정의
- 입력/출력 명시
- 핵심 규칙

```bash
cd "/Users/yoogeon/Agents/contents agent"
for f in agents/*.md; do
  echo "--- $f ---"
  head -5 "$f"
  echo ""
done
```

- [ ] **Step 3: SKILL.md에서 모든 에이전트 참조 확인**

```bash
grep -o 'agents/[a-z-]*\.md' skills/create-video/SKILL.md | sort
```

Expected: 7개 에이전트 파일 모두 참조

- [ ] **Step 4: 샘플 프로젝트 폴더 구조 생성 테스트**

Director가 생성할 프로젝트 폴더 구조를 수동으로 만들어 검증:

```bash
mkdir -p "projects/2026-03-23-test-dry-run"/{research,script,subtitles,voice,scenes,output}
```

- [ ] **Step 5: meta.json 샘플 생성 + 검증**

```bash
cat > "projects/2026-03-23-test-dry-run/meta.json" << 'EOF'
{
  "projectId": "2026-03-23-test-dry-run",
  "topic": "테스트 주제",
  "format": "longform",
  "style": "infographic-motion",
  "styleReference": "",
  "character": "character-v1",
  "targetRuntime": 600,
  "currentStage": "init",
  "stages": {
    "research": {"status": "pending"},
    "script": {"status": "pending"},
    "subtitle": {"status": "pending"},
    "voice": {"status": "pending"},
    "scenes": {"status": "pending"},
    "render": {"status": "pending"},
    "qa": {"status": "pending"}
  }
}
EOF
python3 -c "import json; json.load(open('projects/2026-03-23-test-dry-run/meta.json')); print('meta.json OK')"
```

- [ ] **Step 6: 테스트 폴더 정리**

```bash
rm -rf "projects/2026-03-23-test-dry-run"
```

---

## 실행 순서 요약

```
Phase 1 — Foundation
  Task 1: 스캐폴딩 + 자산 복사
  Task 2: 설정 파일 (pipeline.json, styles.json)

Phase 2 — Agent Prompts (병렬 실행 가능)
  Task 3: Researcher
  Task 4: Scriptwriter
  Task 5: Subtitle Engineer
  Task 6: Voice Engineer
  Task 7: Scene Designer
  Task 8: Renderer
  Task 9: QA Reviewer

Phase 3 — Orchestrator (Task 2~9 완료 후)
  Task 10: Director SKILL.md

Phase 4 — Verification (Task 1~10 완료 후)
  Task 11: 통합 검증
```

Task 3~9는 서로 독립적이므로 병렬 실행 가능. Task 10은 모든 에이전트가 완성된 후 작성. Task 11은 전체 완료 후 검증.
