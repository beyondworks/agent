# Auto-Video: AI 영상 콘텐츠 제작 에이전트 팀

> 설계일: 2026-03-24
> 상태: 승인됨

## 1. 개요

Claude Code 기반 에이전트 팀으로, 일관된 브랜드 아이덴티티를 유지하면서 YouTube 영상 콘텐츠를 자동 제작하는 시스템.

### 핵심 원칙

- **창작/실행 분리**: 창작 판단은 에이전트, 기계적 실행은 Python 스크립트
- **브랜드 일관성**: YAML 브랜드 가이드를 모든 에이전트가 참조
- **체크포인트 워크플로우**: 주요 단계마다 사용자 승인 후 진행

### 기술 스택

| 구성요소 | 도구 |
|---------|------|
| AI 모델 | Gemini 2.5 Flash / 3 Flash / 3 Pro / 3.1 Pro |
| 이미지 생성 | Nano Banana (Gemini) + nano-banana-prompt-translator |
| 영상 생성 | Veo3 |
| TTS | ElevenLabs |
| 합성/렌더링 | MoviePy |
| 배포 채널 | YouTube (Shorts + 롱폼) |
| 실행 환경 | Claude Code 에이전트/스킬 |

## 2. 에이전트 팀 구조

```
┌─────────────────────────────────────────────┐
│          Director (팀장 스킬)                 │
│  /auto-video 진입점                          │
│  Phase 판단 → 에이전트 배정 → 체크포인트 관리   │
└──────────────┬──────────────────────────────┘
               │
    ┌──────────┼──────────────────────┐
    ▼          ▼                      ▼
Phase 1 팀    Phase 2 팀            공통 인프라
```

### Phase 1 에이전트 (브랜드 세팅)

| 에이전트 | 역할 | 모델 |
|---------|------|------|
| brand-architect | 캐릭터 스타일/페르소나 정의. 외형, 성격, 말투, 시각적 키워드 도출 | opus |
| narrative-designer | 캐릭터 서사 구조 설계. 세계관, 갈등, 성장 패턴, 에피소드 공식 | opus |
| topic-strategist | 채널 주제 영역 정의. 카테고리, 서브토픽, 콘텐츠 필러 구조 | sonnet |
| benchmark-analyst | 성공 채널 분석. 조회수/구독자 패턴, 콘텐츠 공식, 체크리스트 도출 | sonnet |

### Phase 2 에이전트 (콘텐츠 제작)

| 에이전트 | 역할 | 모델 |
|---------|------|------|
| researcher | 주제 관련 Top 채널, 뉴스, SNS 정보 수집 및 정리 | sonnet |
| scriptwriter | 리서치 + 브랜드 가이드 기반으로 대본 작성 | opus |
| scene-director | 대본을 씬 단위로 분할, 각 씬의 시각 연출 지시서 작성 | opus |
| image-generator | 씬 지시서 → nano-banana-prompt-translator → Nano Banana API 호출 | sonnet |
| video-generator | 씬 지시서 → Veo3 API로 영상 씬 생성 | sonnet |
| voice-producer | 대본 → ElevenLabs API로 씬별 보이스 생성 | sonnet |
| compositor | MoviePy로 씬 영상/이미지 + 보이스 합성 → 최종 렌더링 | sonnet |

### 역할 분담 원칙

- **창작 에이전트** (brand-architect, narrative-designer, scriptwriter, scene-director): Claude Code 서브에이전트. 브랜드 가이드를 참조하며 창작 판단
- **실행 에이전트** (image-generator, video-generator, voice-producer, compositor): 얇은 에이전트 + Python 스크립트. 에이전트는 파라미터 결정만, 실제 API 호출은 스크립트가 수행
- **리서치 에이전트** (researcher, benchmark-analyst): 웹 검색 + 정보 구조화

## 3. 프로젝트 디렉토리 구조

```
auto-video/
├── brand/                          # Phase 1 산출물 (브랜드 가이드)
│   ├── character.yaml              # 캐릭터 스타일/페르소나
│   ├── narrative.yaml              # 서사 구조/패턴
│   ├── topics.yaml                 # 주제 영역/카테고리
│   └── benchmark.yaml              # 벤치마킹 체크리스트
│
├── projects/                       # Phase 2 콘텐츠 프로젝트
│   └── {YYYY-MM-DD}-{slug}/       # 개별 영상 프로젝트
│       ├── research.md             # 리서치 결과
│       ├── script.md               # 대본
│       ├── scenes/                 # 씬별 산출물
│       │   ├── scene-01/
│       │   │   ├── direction.yaml  # 씬 연출 지시서
│       │   │   ├── visual.png/mp4  # 생성된 이미지/영상
│       │   │   └── voice.mp3       # TTS 보이스
│       │   └── scene-02/
│       ├── output/                 # 최종 렌더링
│       │   ├── final.mp4
│       │   └── thumbnail.png
│       └── metadata.yaml           # 제목, 설명, 태그 (YouTube용)
│
├── scripts/                        # 실행 스크립트 (API 호출/렌더링)
│   ├── gemini-image.py             # Nano Banana 이미지 생성
│   ├── veo3-video.py               # Veo3 영상 생성
│   ├── elevenlabs-tts.py           # ElevenLabs TTS
│   ├── compositor.py               # MoviePy 합성/렌더링
│   └── youtube-metadata.py         # YouTube 메타데이터 생성
│
├── agents/                         # 에이전트 프롬프트 정의
│   ├── director.md                 # 팀장
│   ├── phase1/
│   │   ├── brand-architect.md
│   │   ├── narrative-designer.md
│   │   ├── topic-strategist.md
│   │   └── benchmark-analyst.md
│   └── phase2/
│       ├── researcher.md
│       ├── scriptwriter.md
│       ├── scene-director.md
│       ├── image-generator.md
│       ├── video-generator.md
│       ├── voice-producer.md
│       └── compositor.md
│
├── config/
│   ├── models.yaml                 # Gemini 모델별 용도 매핑
│   └── api-keys.env                # API 키 (.gitignore)
│
└── skills/                         # Claude Code 스킬 진입점
    └── auto-video/
        └── SKILL.md                # /auto-video 스킬 정의
```

## 4. 브랜드 가이드 스키마

### character.yaml

```yaml
persona:
  name: ""
  personality: []          # 성격 키워드 3-5개
  speaking_style: ""       # 말투 특성
  catchphrase: []          # 시그니처 표현

visual:
  art_style: ""            # 2D/3D/실사/커스텀
  color_palette: []        # 주요 색상
  key_elements: []         # 항상 등장하는 시각 요소
  nano_banana_base_prompt: "" # 이미지 생성 기본 프롬프트

consistency_rules:
  always: []               # 항상 지켜야 할 것
  never: []                # 절대 하면 안 되는 것
```

### narrative.yaml

```yaml
worldview:
  setting: ""              # 배경 세계관
  tone: ""                 # 전체 톤 (유머/진지/교육 등)
  core_message: ""         # 채널이 전달하는 핵심 메시지

story_patterns:
  opening_hook: ""         # 오프닝 공식 (첫 3초)
  structure: ""            # 서사 구조 (기승전결/문제-해결 등)
  closing: ""              # 엔딩 공식 (CTA 포함)
  recurring_elements: []   # 매 에피소드 반복 요소

episode_formula:
  short_form:              # 숏폼 (9:16, 1분 이내)
    duration_sec: 60
    scene_count: 3-5
    pacing: "fast"
  long_form:               # 롱폼 (16:9, 3-30분)
    duration_min: 10
    scene_count: 15-30
    pacing: "varied"
```

### topics.yaml

```yaml
main_category: ""          # 대주제
sub_topics: []             # 세부 주제 목록
content_pillars:           # 콘텐츠 기둥 (3-5개)
  - name: ""
    description: ""
    frequency: ""          # weekly/biweekly/monthly
evergreen_topics: []       # 시즌/시기 무관 상시 주제
trending_keywords: []      # 추적할 트렌드 키워드
```

### benchmark.yaml

```yaml
channels:
  - name: ""
    url: ""
    subscribers: ""
    avg_views: ""
    content_style: ""
    success_patterns: []   # 이 채널의 성공 공식

checklist:
  thumbnail:
    - "얼굴/감정 클로즈업"
    - "고대비 색상"
    - "3단어 이하 텍스트"
  title:
    - "호기심 유발 키워드"
    - "숫자 활용"
  first_3_seconds:
    - "갈등/질문 제시"
    - "시각적 충격"
  retention:
    - "30초마다 전환"
    - "예고/떡밥"
```

## 5. 체크포인트 파이프라인

```
사용자: 주제 입력
    │
    ▼
① researcher → research.md
    │
    ▼ --- 체크포인트: 리서치 결과 확인 ---
    │
② scriptwriter → script.md
    │
    ▼ --- 체크포인트: 대본 확인/수정 ---
    │
③ scene-director → scenes/scene-XX/direction.yaml
    │
    ▼ --- 체크포인트: 씬 분할 및 연출 지시서 확인 ---
    │
④ image-generator / video-generator → 씬별 visual 생성 (병렬)
    │
    ▼ --- 체크포인트: 생성된 비주얼 확인 ---
    │
⑤ voice-producer → 씬별 voice.mp3
    │
    ▼ --- 체크포인트: 보이스 확인 ---
    │
⑥ compositor → final.mp4 + thumbnail.png + metadata.yaml
    │
    ▼ --- 체크포인트: 최종 결과물 확인 ---
```

### 체크포인트 동작

- 각 체크포인트에서 Director가 중간 결과물을 사용자에게 제시
- 사용자가 승인하면 다음 단계 진행
- 수정 요청 시 해당 에이전트에 피드백 전달 후 재작업
- 반복 수정 3회 초과 시 사용자에게 방향 재확인

## 6. Gemini 모델 용도 배분

| 작업 | 모델 | 이유 |
|------|------|------|
| 리서치 요약 | Gemini 3 Flash | 빠른 처리, 비용 효율 |
| 대본 작성 | Gemini 3.1 Pro | 높은 창작 품질 필요 |
| 씬 연출 지시서 | Gemini 3 Pro | 시각적 묘사력 |
| 이미지 프롬프트 생성 | Gemini 2.5 Flash | nano-banana-prompt-translator 연계 |
| 이미지 생성 | Nano Banana | Gemini 이미지 생성 모델 |
| 영상 생성 | Veo3 | 영상 전용 |
| YouTube 메타데이터 | Gemini 3 Flash | 정형화된 출력 |

## 7. 성공 지표

- Phase 1 완료 후 4개 브랜드 가이드 YAML 파일 생성됨
- Phase 2에서 주제 입력 → 최종 영상(mp4) 출력까지 파이프라인 정상 동작
- 동일 캐릭터/스타일로 3개 이상 영상 제작 시 시각적 일관성 유지
- 체크포인트에서 사용자 피드백 반영 후 재생성 정상 동작
