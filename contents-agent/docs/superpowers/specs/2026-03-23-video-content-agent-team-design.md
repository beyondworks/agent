# Video Content Agent Team — Design Spec

> 영상 콘텐츠 제작 에이전트 팀 설계 문서
> 작성일: 2026-03-23

---

## 1. 개요

### 1.1 목표

Claude Code 스킬/에이전트 시스템 기반으로, 일관되고 지속적인 유튜브 영상 콘텐츠를 제작하는 에이전트 팀을 구축한다. 팀장 에이전트(Director)가 전체 파이프라인을 지휘하고, 7개의 전문 서브에이전트가 각 단계를 담당한다.

### 1.2 핵심 결정사항

| 항목 | 결정 |
|------|------|
| 실행 환경 | Claude Code 스킬/에이전트 시스템 |
| 아키텍처 | 스킬 체인 — 단일 오케스트레이터 + 서브에이전트 |
| 승인 모드 | B(단계별 승인) → 검증 후 A(완전 자동) 전환 |
| 콘텐츠 우선순위 | 롱폼(7~12분) 우선, 숏폼은 이후 확장 |
| 영상 스타일 | 1순위 인포그래픽/모션 + 레퍼런스 기반, 2순위 캐릭터 애니메이션 |
| 이미지 생성 | Gemini 3 API (Nano Banana) |
| 영상 생성 | Gemini 3 API (Veo 3) |
| TTS | Qwen3 TTS 1.7B (소스: ~/Desktop/Appbuild/TTStudio_v2/, 클론: 김효율.m4a) |
| 영상 합성 | TBD (3가지 테스트 후 결정). 구현 단계에서 FFmpeg/Remotion/기타 비교 후 확정 |
| 영상 해상도 | 롱폼: 16:9, 1080p~4K. 숏폼(확장 시): 9:16, 1080p~4K |

### 1.3 기존 자산

- `~/Agents/Creator/profiles/` — character-v1.json, character-narrative-v1.md, benchmarks.json, maker-evan.json
- `~/Agents/contents-creator/CHARACTER_AND_CHECKLIST.md` — 캐릭터 스타일 + 26항목 성공 체크리스트
- `~/Desktop/Appbuild/TTStudio_v2/` — Qwen3 TTS 1.7B 소스 코드 (모델/추론 코드 재활용, 앱 자체는 사용하지 않음)

### 1.4 비주얼 소스 오브 트루스

styles.json이 영상 제작의 비주얼 기준이다. character-v1.json의 visual 섹션은 초기 참고 자료일 뿐, 실제 영상 제작 시에는 styles.json의 값을 사용한다. 색상 팔레트: 배경 `#001C2F`, 프라이머리 `#06E5AC` (네이비/민트 + 글래스모피즘).

---

## 2. 디렉토리 구조

```
contents-agent/
├── skills/
│   └── create-video/
│       └── SKILL.md                ← 메인 스킬 (오케스트레이터)
│
├── agents/
│   ├── director.md                 ← 팀장: 파이프라인 제어 + 승인 게이트
│   ├── researcher.md               ← 1단계: 정보 수집
│   ├── scriptwriter.md             ← 2단계: 대본 생성
│   ├── subtitle-engineer.md        ← 3단계: 자막 + 타이밍
│   ├── voice-engineer.md           ← 4단계: TTStudio 연동 보이스 생성
│   ├── scene-designer.md           ← 5단계: 이미지/영상 씬 생성
│   ├── renderer.md                 ← 6단계: 영상 합성
│   └── qa-reviewer.md              ← 7단계: 26항목 체크리스트 QA
│
├── profiles/
│   ├── character-v1.json
│   ├── character-narrative-v1.md
│   ├── benchmarks.json
│   └── maker-evan.json
│
├── guides/
│   ├── CHARACTER_AND_CHECKLIST.md
│   ├── style-references/           ← 레퍼런스 이미지/영상 스타일
│   ├── prompt-guides/              ← Nano Banana / Veo 3 공식 프롬프트 가이드
│   ├── topic-templates/            ← 주제별 대본 템플릿
│   └── assets/
│       ├── icons/                  ← SVG 벡터 아이콘 (Iconify, lobehub)
│       └── sources.md              ← 아이콘 다운로드 출처 기록
│
├── projects/
│   └── YYYY-MM-DD-{slug}/
│       ├── meta.json               ← 상태 머신 (단계, 설정, 진행 상태)
│       ├── research/
│       │   └── sources.md
│       ├── script/
│       │   ├── draft.md
│       │   └── final.md
│       ├── subtitles/
│       │   └── final.srt
│       ├── voice/
│       │   ├── narration.wav        ← TTS 원본 (WAV)
│       │   ├── narration.mp3        ← 변환본 (렌더링용)
│       │   └── scene-NNN.wav        ← 씬별 분할 (Renderer 요구 시)
│       ├── scenes/
│       │   ├── scene-001.png (또는 .mp4)
│       │   └── ...
│       └── output/
│           └── final.mp4
│
└── config/
    ├── pipeline.json               ← 승인 게이트, API 설정, 기본값
    └── styles.json                 ← 영상 스타일 프리셋
```

---

## 3. 파이프라인 흐름

### 3.1 상태 흐름

```
[init] → [research] → [script] → [approval?] → [subtitle] → [voice] → [approval?] → [scenes] → [approval?] → [render] → [qa] → [approval?] → [done]
```

### 3.2 meta.json 구조

```json
{
  "projectId": "2026-03-23-claude-code-tips",
  "topic": "Claude Code를 기획자가 쓰면 이렇게 됩니다",
  "format": "longform",
  "style": "infographic-motion",
  "styleReference": "guides/style-references/ref-example.png",
  "character": "character-v1",
  "targetRuntime": 600,
  "currentStage": "script",
  "stages": {
    "research":  { "status": "completed", "completedAt": "2026-03-23T10:00:00" },
    "script":    { "status": "in_progress" },
    "subtitle":  { "status": "pending" },
    "voice":     { "status": "pending" },
    "scenes":    { "status": "pending" },
    "render":    { "status": "pending" },
    "qa":        { "status": "pending" }
  }
}
```

### 3.3 재실행 메커니즘

QA 미통과 또는 중간 단계 실패 시:

1. Director가 해당 단계를 `pending`으로 리셋
2. 해당 에이전트만 재실행
3. 의존성 있는 이후 단계도 순차 재실행
4. 의존성 없는 이전 단계는 유지

예: 씬 수정 시 → scenes, render, qa 재실행. script, subtitle, voice는 유지.

### 3.4 voice→subtitle 피드백 루프

Voice 생성 후 실제 음성 길이가 자막 타이밍과 불일치할 수 있다. 이 역방향 의존성 처리:

1. Voice Engineer가 음성 생성 후 실제 길이 측정
2. 자막 타이밍과 비교하여 오차가 0.5초 초과인 구간 식별
3. Voice Engineer가 자막 타이밍 미세 조정 권한을 가짐 (subtitles/final.srt 직접 수정)
4. 대본 내용은 변경 불가 — 타이밍만 조정
5. 최대 2회 반복 (voice 재생성 → 타이밍 재조정). 2회 초과 시 Director가 사용자에게 보고

### 3.5 에러 핸들링

| 에러 유형 | 대응 |
|-----------|------|
| API 호출 실패 (Gemini 3) | retryPolicy에 따라 최대 2회 재시도. 실패 시 Director가 사용자에게 보고 |
| TTS 생성 실패 | 최대 2회 재시도. 실패 시 사용자 보고 |
| 생성 품질 미달 (QA 미통과) | 해당 단계 에이전트 재실행 (3.3 메커니즘) |
| 디스크 부족 | Director가 사전 체크 후 경고 |

### 3.6 승인 게이트 UX

B모드(단계별 승인)에서 승인 요청 방식:

1. Director가 해당 단계 산출물 경로를 터미널에 출력
2. 산출물 요약 제시 (대본: 주요 구조/분량, 보이스: 길이/품질, 씬: 주요 이미지 미리보기)
3. 사용자에게 선택지 제시: `[승인]` / `[수정 요청 + 피드백]` / `[재생성]`
4. 수정 요청 시: 피드백을 해당 에이전트에 전달하여 재실행

---

## 4. 에이전트 상세

### 4.1 Director (팀장)

- **역할**: 파이프라인 오케스트레이션. 프로젝트 폴더 생성, 단계별 에이전트 호출, 승인 게이트 관리, 실패 시 재시도 판단
- **입력**: 주제, 콘텐츠 유형, 스타일 선택
- **출력**: meta.json 상태 업데이트
- **책임**: CHARACTER_AND_CHECKLIST.md를 모든 에이전트에 컨텍스트로 전달
- **구현 방식**: SKILL.md가 Director 역할. 각 서브에이전트는 Agent 도구(`subagent_type`)로 호출. 단계 간 상태는 meta.json + 프로젝트 폴더 내 산출물 파일로 전달. 승인 게이트에서는 사용자에게 결과를 제시하고 응답을 대기

### 4.2 Researcher (리서치)

- **역할**: 주제에 대한 Top 채널/콘텐츠/뉴스/SNS 정보 수집
- **입력**: 주제, benchmarks.json
- **출력**: `research/sources.md` (수집 정보 + 출처 + 핵심 인사이트)
- **도구**: WebSearch, WebFetch (유튜브 트랜스크립트, 블로그, 뉴스, SNS)
- **병렬 실행**: 뉴스 + 유튜브 + SNS 검색을 동시 진행

### 4.3 Scriptwriter (대본)

- **역할**: 리서치 결과 기반, 캐릭터 톤/구조에 맞는 대본 생성
- **입력**: sources.md, CHARACTER_AND_CHECKLIST.md, character-v1.json
- **출력**: `script/draft.md` → 승인 후 `script/final.md`

**필수 규칙:**
- 기승전결 구조 필수
  - 기(후킹 15초): 역설적 선언
  - 승(문제 정의 + 본론 전반): 공감 → 번호 매기기 전개
  - 전(본론 후반): 캐릭터 고유 관점 해석 (기획자 렌즈) **(중요)**
  - 결(정리 + 행동 제시): 핵심 한 문장 + 오늘 당장 해볼 것
- TTS 보정 계수 적용 (4.9절 글자 수 계산 공식 참조)
- 씬 단위: 핵심 주장 → 근거 → 비유 → 전환, 씬당 최대 90초
- Do 리스트 8개 / Don't 리스트 11개 준수
- 팩트 검증: transcript에 없는 정보 사용 금지, 출처 라인 번호 기록
- 영문 고유명사 → 한글 발음 변환 (styles.json 변환표 적용)
- 이모지/이모티콘 사용 금지

**대본 출력 포맷 (`script/final.md`):**

```markdown
# {영상 제목}

- 목표 러닝타임: {N}분
- 총 글자 수: {N}자
- 씬 수: {N}개

---

## Scene 1: {씬 제목}
### Duration: {seconds}초
### Narration
{나레이션 텍스트. 영문 고유명사는 한글 발음으로 변환 완료.}
### Visual Direction
{이 씬에서 보여줄 시각 요소 지시. 어떤 그래픽/텍스트/애니메이션이 등장하는지.}

---

## Scene 2: {씬 제목}
### Duration: {seconds}초
### Narration
...
### Visual Direction
...
```

모든 후속 에이전트(Subtitle Engineer, Voice Engineer, Scene Designer)는 이 포맷을 파싱하여 사용한다. `## Scene N` 구분자, `### Narration`과 `### Visual Direction` 헤더는 변경 불가.

### 4.4 Subtitle Engineer (자막)

- **역할**: 대본에서 자막 파일 생성 + 타이밍 계산
- **입력**: script/final.md, 러닝타임 설정
- **출력**: `subtitles/final.srt`

**필수 규칙:**
- 1줄 쓰기만 허용 (2줄 자막 금지)
- TTS 속도 기반 타이밍 계산 (분당 275자 x 1.85 보정)
- 유튜브 스타일 하단 자막 포맷

### 4.5 Voice Engineer (보이스)

- **역할**: Qwen3 TTS 1.7B 모델로 클론 보이스 생성
- **입력**: script/final.md, subtitles/final.srt
- **출력**: `voice/narration.wav` (원본) + `voice/narration.mp3` (변환본). 씬별 분할은 Renderer 요구 시 생성
- **TTS 소스**: `~/Desktop/Appbuild/TTStudio_v2/` 내 Qwen3 TTS 1.7B 모델/추론 코드를 재활용. TTStudio 앱 자체를 실행하는 것이 아니라, 모델과 추론 파이프라인 소스를 참조하여 보이스 생성 스크립트를 구성
- **클론 소스**: `~/Agents/contents-creator/voice/김효율.m4a` (프로젝트 초기 설정 시 `voice/` 폴더로 복사)

**필수 규칙:**
- 한국어 끝음 끊김 방지 — '다', '요', '까' 등 종성(ㄷ, ㅇ, ㄲ) 보존
- 문장 간 흐름 연결 자연스럽게 (끊김 없이)
- 자막 외 잡음/트래시보이스 제거
- 영문 고유명사는 한글 발음으로 발화 (대본 단계에서 선처리됨)
- 생성 후 실제 음성 길이 vs 자막 타이밍 비교 → 불일치 시 자막 타이밍 재조정 (3.4절 피드백 루프 참조)
- WAV → MP3 변환은 Voice Engineer가 수행 (ffmpeg 등)

### 4.6 Scene Designer (씬)

- **역할**: 대본 맥락에 맞는 이미지/영상 씬 생성
- **입력**: script/final.md, subtitles/final.srt, styles.json, 레퍼런스 이미지
- **출력**: `scenes/scene-NNN.png` 또는 `.mp4` + `scenes/thumbnail.png` (썸네일)
- **도구**: Gemini 3 API (Nano Banana: 이미지, Veo 3: 영상)

**필수 규칙:**
- 최종 영상 러닝타임 = 목표 러닝타임 (대본 길이가 아닌 영상 기준)
- 정적 이미지 금지 — 나레이션 싱크 애니메이션 필수
  - 허용: 타이핑 모션 시간차, 프로세스 시간차 등장, 영상 클립, 요소 시간차 등장
  - 금지: 단순 줌인/줌아웃만으로 '동적' 처리
- 3~5초마다 시각 변화 (체크리스트 D14)
- 빈 화면 0% (체크리스트 D15)
- 한글 표기 정확성 필수 — 이미지 내 한글은 정확한 한국어로 표기
- 이모지/이모티콘 사용 금지
- 모든 아이콘은 SVG 벡터 사용
- AI 도구/서비스 로고: Iconify, lobehub에서 SVG 다운로드 → `guides/assets/icons/`에 저장
- 레퍼런스 이미지 분석 → 색상/레이아웃/타이포 스타일 추출 → 프롬프트 반영
- Nano Banana / Veo 3 공식 프롬프트 가이드 참조하여 최적화 프롬프트 생성 **(중요)**. 구현 단계에서 공식 가이드를 조사하여 `guides/prompt-guides/` 에 정리
- 스타일 일관성 유지 (동일 색상 팔레트, 폰트 스타일, 레이아웃 패턴)
- 출력 해상도: 롱폼 16:9 최소 1920x1080 ~ 3840x2160(4K). 숏폼 9:16 최소 1080x1920
- 출력 포맷: 이미지 PNG, 영상 MP4 (H.264)
- 썸네일 생성: 대본 제목 + 핵심 비주얼을 조합하여 `scenes/thumbnail.png` 생성. 체크리스트 D16(3초 안에 읽힘) + D17(제목과 보완 관계) 준수. 큰 글자 1~2단어 + 고대비

### 4.7 Renderer (렌더링)

- **역할**: 영상 + 자막 + 보이스 합성
- **입력**: scenes/, subtitles/final.srt, voice/narration.wav (또는 .mp3)
- **출력**: `output/final.mp4`
- **도구**: TBD — 구현 단계에서 FFmpeg / Remotion / 기타 3가지를 비교 테스트 후 확정

**MVP 입출력 사양 (도구 확정 전 기준):**
- 입력 씬: PNG(1920x1080+) 또는 MP4(H.264)
- 입력 오디오: WAV 또는 MP3
- 입력 자막: SRT
- 출력: MP4 (H.264, AAC 오디오)
- 해상도: 1920x1080 (1080p) 기본, 4K 옵션
- 프레임레이트: 30fps
- 자막 렌더링: SRT burn-in (하드서브)

**필수 규칙:**
- 자막: 유튜브 스타일 하단 배치, 1줄, `#000000cc` 배경, 폰트 색상 `#f1f1f1`
- 보이스-자막 최종 싱크 검증 (오차 0.5초 이내)

### 4.8 QA Reviewer

- **역할**: 26항목 체크리스트 + Don't 11항목 + 팩트 검증 자동 점검
- **입력**: 프로젝트 전체 산출물, CHARACTER_AND_CHECKLIST.md
- **출력**: `qa-report.md` (항목별 pass/fail + 수정 제안)

**점검 순서:**
1. 필수 7개 통과 여부 → 1개라도 미통과 시 해당 단계 에이전트에 수정 요청
2. 나머지 19개 중 15개 이상 통과 (전체 22개+, 85%)
3. Don't 리스트 11개 위반 여부
4. 팩트 검증 체크리스트
5. 10초 이상 정적 화면 여부 (씬 타이밍 기반 추정)

### 4.9 글자 수 계산 공식 (TTS 보정)

자연 발화 속도는 분당 275자이나, TTS는 자연 발화보다 빠르다. 목표 러닝타임을 맞추려면 대본 글자 수를 늘려야 한다.

```
TTS 실제 발화 속도 = 275자/분 × 1.85 = 약 509자/분
→ 대본 글자 수 = 목표 러닝타임(분) × 509

예시:
  7분 영상 = 7 × 509 = 약 3,563자
 10분 영상 = 10 × 509 = 약 5,090자
 12분 영상 = 12 × 509 = 약 6,108자

자막 1개 표시 시간 = 자막 글자 수 ÷ 509 × 60초
예: 20자 자막 = 20 ÷ 509 × 60 = 약 2.4초
```

1.85는 초기 추정값이다. 실제 TTS 생성 후 Voice Engineer가 측정하여 보정 계수를 조정할 수 있으며, 조정된 값은 pipeline.json의 `ttsSpeedMultiplier`에 반영한다.

**필수 7개 요약:**
- A1: 니치를 한 문장으로 소유한다
- A3: 본인이 실제로 그 일을 하고 있다
- B5: 결과물이 영상 안에서 보인다
- B9: 한 영상 = 한 주제
- D14: 3~5초마다 시각 변화
- F22: 주제가 흔들리지 않는다
- G26: 해석이 있다

---

## 5. 설정

### 5.1 pipeline.json

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

### 5.2 styles.json

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

---

## 6. 확장 설계

### 6.1 숏폼 확장

롱폼 파이프라인 안정화 후 두 가지 경로:

**경로 1: 롱폼에서 추출**
- 대본에서 가장 임팩트 있는 60초 구간 식별
- 9:16 비율로 씬 재구성
- 자막 크기/위치 숏폼용 재조정

**경로 2: 독립 숏폼**
- `/create-video --format short "주제"` 명령
- 숏폼용 대본 구조: 후킹 3초 → 핵심 45초 → CTA 12초
- 나머지 파이프라인 동일, 러닝타임/비율만 오버라이드

### 6.2 캐릭터 변주

```
profiles/
  ├── character-v1.json          ← 기본 (기획자 AI 해석)
  ├── character-v2-tech.json     ← 변주: 기술 딥다이브
  └── character-v3-news.json     ← 변주: 위클리 뉴스
```

- `/create-video --character v2-tech "주제"` 로 캐릭터 지정
- 동일 스키마, voice/tone/structure 값만 다름
- CHARACTER_AND_CHECKLIST.md는 공통 체크리스트로 유지

### 6.3 B→A 자동 모드 전환 기준

**전환 조건 (모두 충족 시):**
1. 동일 스타일로 5편 이상 제작 완료
2. 최근 3편 연속 QA 필수 7개 항목 전부 통과
3. 최근 3편 연속 승인 게이트에서 수정 요청 0회
4. 사용자가 명시적으로 자동 모드 전환 승인

**단계적 전환:**
- Phase 1: script만 승인 유지, 나머지 자동
- Phase 2: 전체 자동, QA에서만 승인
- Phase 3: 완전 자동 (QA 미통과 시에만 알림)

---

## 7. 공통 규칙

### 7.1 콘텐츠 규칙
- 이모지/이모티콘 사용 금지 (대본, 자막, 씬 이미지 전체)
- 모든 아이콘은 SVG 벡터
- AI 도구/서비스 로고: Iconify → lobehub 순서로 SVG 다운로드

### 7.2 비주얼 규칙
- 배경: `#001C2F`, 프라이머리: `#06E5AC`
- MUI 다크모드 스타일
- CLI/터미널 애니메이션 적극 사용
- 절제된 글래스모피즘 (과하지 않게)

### 7.3 한국어 규칙
- 이미지 내 한글: 정확한 한국어로 표기
- 영문 고유명사: 한글 발음으로 변환 (변환표 관리)
- TTS 끝음 보존: 다/요/까 등 종성 끊기지 않도록
- 분당 275자, TTS 보정 계수 1.85

### 7.4 캐릭터 규칙
- 모든 콘텐츠는 CHARACTER_AND_CHECKLIST.md를 단일 소스로 참조
- 캐릭터 고유 관점(기획자 렌즈) 해석 필수
- Do 리스트 8개 / Don't 리스트 11개 준수
- 팩트 검증: transcript에 없는 정보 사용 금지

---

## 8. 성공 지표

| 지표 | 기준 |
|------|------|
| QA 필수 7개 통과율 | 100% (1개라도 미통과 시 수정) |
| QA 전체 26개 통과율 | 85% 이상 (22개+, 필수 7개 포함) |
| Don't 리스트 위반 | 0건 |
| 보이스-자막 싱크 오차 | 0.5초 이내 |
| 정적 화면 10초+ | 0개 |
| 목표 러닝타임 오차 | +-30초 이내 |
