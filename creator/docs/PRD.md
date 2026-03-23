# Creator Agent — Product Requirements Document

> 주제 하나를 입력하면 10~15분 정보성 유튜브 영상을 완전 자동화하는 AI 에이전트
>
> **버전**: v1.0 | **작성일**: 2026-03-21 | **상태**: Phase 1 완료, Phase 2~4 미착수

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의](#2-문제-정의)
3. [타겟 사용자](#3-타겟-사용자)
4. [캐릭터 시스템](#4-캐릭터-시스템)
5. [콘텐츠 전략](#5-콘텐츠-전략)
6. [벤치마킹 분석](#6-벤치마킹-분석)
7. [시스템 아키텍처](#7-시스템-아키텍처)
8. [파이프라인 상세](#8-파이프라인-상세)
9. [디자인 시스템](#9-디자인-시스템)
10. [애니메이션 시스템](#10-애니메이션-시스템)
11. [슬라이드 생성 규칙](#11-슬라이드-생성-규칙)
12. [데이터 스키마](#12-데이터-스키마)
13. [로드맵](#13-로드맵)
14. [성공 지표](#14-성공-지표)
15. [제약 조건 및 금지 사항](#15-제약-조건-및-금지-사항)

---

## 1. 프로젝트 개요

### 한 줄 요약

```
주제 입력 → 리서치 → 대본 생성 → 슬라이드 JSON → Remotion 렌더링 → TTS 음성 → MP4 영상
```

### 핵심 가치

| 항목 | 내용 |
|------|------|
| **What** | AI 정보성 유튜브 영상을 자동으로 생성하는 엔드투엔드 파이프라인 |
| **Why** | 1인 크리에이터가 주 5~7회 업로드를 유지하려면 제작 시간을 극단적으로 줄여야 한다 |
| **Who** | 채널 운영자 본인 (1인 사용) |
| **How** | LLM 대본 생성 + Remotion 모션그래픽 + TTS 음성 합성 |

### 산출물

| 산출물 | 형식 | 경로 |
|--------|------|------|
| 대본 | Markdown | `scripts/{topic}.md` |
| 슬라이드 데이터 | JSON | `leanslide/slides/{topic}.slides.json` |
| 영상 | MP4 (1920×1080, 30fps) | `remotion/out/{topic}.mp4` |
| 음성 | WAV (씬별) | `remotion/src/public/audio/scene-{N}.wav` |

---

## 2. 문제 정의

### 현재 상태 (수동 제작)

```
1인 크리에이터의 영상 1편 제작 과정:

리서치         → 2~3시간 (소스 영상 시청, 팩트 확인)
대본 작성      → 3~4시간 (구조 설계, 문장 다듬기)
슬라이드 제작  → 4~6시간 (디자인, 애니메이션)
음성 녹음      → 1~2시간 (녹음, 편집)
영상 편집      → 2~3시간 (타이밍, 전환, 렌더링)
─────────────────────────────────
합계: 12~18시간 / 편
```

주 5회 업로드 = 주 60~90시간. **1인이 유지할 수 없다.**

### 목표 상태 (자동화 후)

```
주제 입력      → 1분 (사람)
리서치         → 5분 (에이전트)
대본 생성      → 10분 (LLM)
슬라이드 변환  → 1분 (md-to-slides.js)
영상 렌더링    → 5분 (Remotion)
TTS 합성      → 5분 (Qwen3)
QA/수정        → 30분 (사람)
─────────────────────────────────
합계: ~1시간 / 편 (사람 개입 30분)
```

---

## 3. 타겟 사용자

### 채널 시청자 (영상 소비자)

| 페르소나 | 설명 | 핵심 니즈 |
|---------|------|----------|
| **기획자 A** | 스타트업 PM. 기획서는 쓰는데 개발팀 리소스 부족 | AI로 프로토타입을 직접 만들고 싶다 |
| **디자이너 B** | UI/UX 디자이너. Figma까지는 하지만 구현에서 막힘 | 디자인을 실제 서비스로 만드는 벽을 넘고 싶다 |
| **마케터 C** | 이커머스 마케터. 리포트/데이터 취합 반복 | 반복 업무를 자동화하고 싶은데 방법을 모른다 |
| **1인 사업자 D** | 컨설턴트/프리랜서. 아이디어는 있지만 외주 비용 부담 | AI로 직접 만들어서 외주 비용을 없애고 싶다 |

### 공통 특성

- 개발자가 아니다 (코드를 읽지는 못하지만 구조는 이해한다)
- AI 도구에 관심은 있지만 개발자 위주 설명에 진입 장벽을 느낀다
- "왜 이게 필요한지"를 먼저 이해해야 행동한다

---

## 4. 캐릭터 시스템

### 4.1 페르소나 정의

```
profiles/character-v1.json      ← 캐릭터 스타일 스펙 (화법, 구조, 제목 패턴)
profiles/character-narrative-v1.md ← 캐릭터 서사 (연대기, 관점, 시청자 관계)
```

**한 줄 정의**: "브랜드를 만들던 사람이, AI로 제품을 만들기 시작하면서 깨달은 것들을 정리하는 채널"

### 4.2 배경 서사

```
1막: 브랜드 디렉터 7년  → "좋은 건 만드는 게 아니라 설계하는 거다"
2막: 이커머스 기획자 3년 → "설계만으로는 부족하다. 실행하고, 측정하고, 고쳐야 한다"
3막: 독립 컨설팅 2년    → "머릿속에 있는 걸 바로 만들 수 있으면 좋겠다"
4막: AI를 만남          → "설계를 고치니까 결과가 달라졌다"
5막: 1인 AI 빌더       → "나 같은 사람이 더 있을 거다. 그 사람들한테 보여주자"
```

### 4.3 핵심 역할: 해석자

이 캐릭터는 뉴스를 전달하는 사람이 아니라 **해석하는 사람**이다.

| 해석 차원 | 질문 | 예시 |
|----------|------|------|
| **Why** | 이 기술 발전이 왜 이루어지는가 | "다섯 곳이 같은 주에 출시한 건 우연이 아닙니다. 시각화가 차별화 포인트가 아니게 됐다는 뜻입니다." |
| **How (가속)** | 어떻게 이렇게 빨라졌는가 | "오픈소스 모델이 따라잡으면서, 독점 기능의 유통기한이 2주로 줄었습니다." |
| **How (확장)** | 이걸 어떻게 확장하면 좋겠는가 | "시각화 기능 자체보다, 이걸 기획서 자동 생성에 연결하면 가치가 달라집니다." |
| **What next** | 앞으로 어떤 자세로 배워야 하는가 | "도구를 외우지 마세요. 구조를 이해하면 도구가 바뀌어도 적응할 수 있습니다." |

### 4.4 톤 & 화법

**톤**: 확신 있되 오만하지 않음. 에너지 moderate-high. 문장은 짧게.

**화법 원칙**:
- 한 문장에 한 아이디어
- 기술 용어가 나오면 1문장 이내로 맥락 부착
- 비유는 기획/브랜딩/이커머스 실무에서 끌어옴
- 마무리에 "오늘 당장 해볼 수 있는 것 하나" 필수
- 검증되지 않은 통계를 팩트처럼 말하지 않음 → "제 경험상", "제가 봤을 때"로 한정

**비유 변환표** (기획자 렌즈):

| 기술 개념 | 기획자 언어 |
|----------|-----------|
| DB | 재고 창고 |
| API | 주문 전달 경로 |
| 배포 | 매장 오픈 |
| 디버깅 | 요구사항(브리프) 다시 점검 |
| 프롬프트 엔지니어링 | 좋은 브리프를 쓰는 것 |
| CI/CD | 기획서 넘기고 2주 기다리던 것 → 30분으로 |

**금지 사항**:

```
 원본 크리에이터의 고유 표현 직접 사용
 근거 없는 위기감 조성 ("도태됩니다", "해고됩니다" 류)
 불특정 다수를 깎아내리며 우월감 만들기
 개발자를 폄하하거나 개발 직군을 깎아내리기
 "코딩 없이도 됩니다"라고 쉬운 것처럼 말하기
 검증 안 된 통계를 팩트처럼 말하기
 감탄사/추임새를 서면 대본에 그대로 넣기
```

### 4.5 영상 구조

```
후킹 (15초)  → 결론 또는 역설을 먼저 던짐. '왜?'를 유발
문제 정의 (1분) → 시청자가 공감하는 상황 묘사
본론 (5~8분)  → 번호 매기기(첫째/둘째/셋째) × (원리 → 비유 → 실제 사례)
정리 (30초)   → 핵심 메시지 한 문장. 3줄 이내 요약
행동 제시 (15초) → "오늘 당장 해볼 수 있는 것 하나" + 다음 영상 예고 + CTA
```

**제목 패턴**:

```
 "AI한테 '알아서 해줘'라고 하면 안 되는 이유"          (단정형 선언 + 근거 암시)
 "기획서를 잘 쓰는 사람이 바이브코딩도 잘합니다"       (역설적 연결)
 "외주 2주 걸리던 걸 AI로 30분 만에 만든 과정"         (구체적 대비)
```

```
 "아직도 ~쓰세요?" (의문형 낚시)
 "~는 죽었습니다" (근거 없는 공포)
 "100배 차이" (과도한 숫자 과장)
 "아무도 모르는" (무지 프레이밍)
```

### 4.6 러닝타임 스펙

| 항목 | 값 |
|------|-----|
| 타겟 | 7~12분 |
| 기본 | 10분 이하. 원리 설명 필요 시 12분 허용 |
| 한국어 속도 | 분당 275자 |
| 7분 | ~1,925자 |
| 12분 | ~3,300자 |

---

## 5. 콘텐츠 전략

### 5.1 도메인

**AI 실무 활용** — 바이브코딩, 자동화, AI 도구를 **기획자의 관점에서 해석**

### 5.2 주제 분포

| 카테고리 | 비중 | 예시 |
|---------|------|------|
| AI 도구 비교/해석 | 35% | "AI 도구가 다 비슷해졌을 때 선택 기준" |
| AI 도입 전략 | 25% | "AI 잘 쓰는 팀 vs 망하는 팀의 차이" |
| AI 개발/기술 (기획자 관점) | 20% | "Claude Code를 기획자가 쓰면 이렇게 됩니다" |
| 바이브코딩 | 15% | "기획서로 앱을 만드는 과정 전부 공개" |
| 업계 트렌드 | 5% | "이번 주 AI 뉴스에서 기획자가 봐야 할 것" |

### 5.3 콘텐츠 생성 원칙

1. **팩트 검증 필수**: 원본 Transcript에 없는 정보 사용 금지. 모든 주장에 출처 라인 번호 기록.
2. **해석 레이어 추가**: 뉴스 전달에 그치지 않고, Why/How/What next를 기획자 관점에서 해석.
3. **1영상 = 1주제**: 가지치기하지 않는다.
4. **행동 가능한 마무리**: "오늘 당장 해볼 수 있는 것 하나"로 끝낸다.

### 5.4 제작 완료 콘텐츠

| # | 제목 | 소스 | 길이 | 상태 |
|---|------|------|------|------|
| 001 | AI 도구가 다 비슷해졌을 때, 기획자가 선택하는 기준 | Matt Wolfe (2026-03-13) | 14분, 12씬, 3,845자 | v7 렌더링 완료 |
| 001-5min | 위 대본의 5분 압축 버전 | 동일 | 5분, 5씬 | v7 렌더링 완료 |

---

## 6. 벤치마킹 분석

### 6.1 캐릭터 베이스 채널

캐릭터의 화법과 구조적 DNA를 가져온 채널. **표현을 베끼는 게 아니라 구조적 특성만 흡수**.

| 채널 | 비중 | 가져온 것 | 가져오지 않는 것 |
|------|------|----------|----------------|
| **메이커 에반** (25.8K) | 60% | 후킹 속도, 밀도, 전개 구조, 주 6~7회 업로드 리듬 | 고유 어미/캐치프레이즈, 개발자 중심 시각 |
| **코드깎는노인** | 40% | 원리 설명력, 비유 전개, 철학적 깊이 | 개발자 타겟, 기술 용어 밀도 |

### 6.2 Must Watch 해외 채널

콘텐츠 주제, 포맷, 비즈니스 모델 참고.

| 채널 | 구독자 | 핵심 강점 | Creator Agent에 적용할 점 |
|------|--------|----------|--------------------------|
| **Liam Ottley** | 42만 | AI 자동화 에이전시 창시자. 인사이트 밀도 극상 | 에이전시/수익화 관점의 AI 해석. 비즈니스 모델 = 유튜브→유료 프로그램 퍼널 |
| **Nick Saraev** | 5만 | Make/n8n 자동화 퀄리티가 미쳤음 | 실전 자동화 워크플로우를 기획자 언어로 번역하는 콘텐츠 |
| **Jeff Su** | 102만 | 초보자 눈높이 + 편집이 맛있음 | 편집 리듬과 시각 변화 밀도 참고. 3~5초마다 화면 전환 |
| **Stephen G. Pope** | 5만 | 수준 높은 자동화 시나리오. 고수 필수 | 복잡한 워크플로우를 단계별로 풀어내는 구조 참고 |
| **Eugene Kadzin** | 7천 | 에이전시 고객 미팅을 실제로 보여줌 | "남이 안 보여주는 걸 보여준다"는 차별화 전략 참고 |

### 6.3 콘텐츠/포맷 참고 채널

| 채널 | 참고 요소 |
|------|----------|
| Matt Wolfe | AI 뉴스 라운드업 포맷 (script-001의 소스) |
| Fireship (4.12M) | 100초 설명 포맷, 편집 속도, 디자인 스타일 |
| Theo (t3.gg) | 개발자 뉴스 해설 구조 |
| Greg Isenberg | 트렌드→사업 기회 뽑아내는 해석력 |
| Tina Huang | 비개발자향 AI 콘텐츠 톤 |
| Riley Brown | 비개발자 바이브코딩 포지셔닝 |

### 6.4 국내 채널

| 채널 | 구독자 | 참고 요소 |
|------|--------|----------|
| 김효율의 AI 개발단 (@lean_kim) | 3K | "AI로 기획~배포까지 혼자 끝내기" — Creator Agent와 타겟 유사 |

### 6.5 성공 채널 체크리스트 (26개 항목)

이 체크리스트는 벤치마킹 채널들의 공통 성공 요인을 추출한 것이다. Creator Agent 콘텐츠가 이 기준을 충족하는지 매 영상마다 점검한다.

#### A. 포지셔닝 (4항목)

- [ ] **A1. 니치를 한 문장으로 소유한다** — "기획자를 위한 AI 실무 해석 채널"
- [ ] **A2. 타겟이 구체적이다** — 기획자/디자이너/마케터/1인 사업자 (개발자 X)
- [ ] **A3. 본인이 실제로 그 일을 하고 있다** — 직접 AI로 만들고, 실패하고, 고친 1인칭 경험
- [ ] **A4. 비개발자도 진입할 수 있는 입구가 있다** — 기술 용어에 1문장 맥락 부착

#### B. 콘텐츠 구조 (5항목)

- [ ] **B5. 결과물이 영상 안에서 보인다** — 시연/스크린샷/다이어그램이 말을 대체
- [ ] **B6. 구조가 예측 가능하다** — 후킹→번호 매기기→정리→행동 제시 패턴 고정
- [ ] **B7. 단계별로 따라할 수 있다** — 각 항목에 "실제로는 이렇게 된다" 포함
- [ ] **B8. 숫자/결과로 후킹한다** — 구체적 대비 (2주→30분, 5곳이 같은 주에)
- [ ] **B9. 한 영상 = 한 주제** — 가지치기하지 않는다

#### C. 신뢰 (4항목)

- [ ] **C10. 실적/경험을 드러낸다** — 12년 설계 경력, 직접 만든 결과물
- [ ] **C11. 실패담을 먼저 꺼낸다** — "처음 AI로 만든 건 쓸 수가 없었어요"
- [ ] **C12. 증명한다** — 주장하면 영상 안에서 보여준다
- [ ] **C13. 출처를 밝힌다** — 모든 팩트에 Transcript 라인 번호 기록

#### D. 편집/비주얼 (4항목)

- [ ] **D14. 3~5초마다 시각 변화** — 1문장=1시각 변화 원칙
- [ ] **D15. 빈 화면 0%** — 텍스트, 아이콘, 차트, 로고가 항상 존재
- [ ] **D16. 썸네일이 3초 안에 읽힌다** — 큰 글자 1~2단어 + 고대비
- [ ] **D17. 제목과 썸네일이 보완 관계** — 제목=주장, 썸네일=감정/결과

#### E. 비즈니스 모델 (3항목)

- [ ] **E18. 콘텐츠가 본업의 퍼널이다** — 유튜브→컨설팅/코스/커뮤니티
- [ ] **E19. 커뮤니티/코스가 있다** — (Phase 5에서 구축 예정)
- [ ] **E20. 무료 콘텐츠가 유료급이다** — 영상 하나만 봐도 실행 가능

#### F. 일관성 (3항목)

- [ ] **F21. 업로드 주기가 예측 가능하다** — 목표: 주 3~5회
- [ ] **F22. 주제가 흔들리지 않는다** — AI 실무 활용 한 우물
- [ ] **F23. 3개월 이상 꾸준히 올렸다** — 초기 성장 인내

#### G. 차별화 (3항목)

- [ ] **G24. 남이 안 보여주는 걸 보여준다** — 기획자가 AI를 쓰는 실제 과정 공개
- [ ] **G25. 카테고리를 만들었다** — "기획자의 AI 해석"이라는 포지션
- [ ] **G26. 해석이 있다** — 뉴스 전달이 아니라 Why/How/What next 제시

---

## 7. 시스템 아키텍처

### 7.1 전체 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                    Creator Agent Pipeline                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [입력] 주제 (텍스트)                                         │
│     │                                                         │
│     ▼                                                         │
│  ┌──────────────────┐                                         │
│  │ Phase 1: 리서치   │ ← Firecrawl/웹 검색                   │
│  │ (소스 영상 탐색)   │ ← YouTube Transcript 추출              │
│  └────────┬─────────┘                                         │
│           ▼                                                   │
│  ┌──────────────────┐                                         │
│  │ Phase 2: 대본     │ ← LLM (character-v1.json 참조)         │
│  │ 에이전트           │ ← 팩트 검증 체크리스트 자동 생성        │
│  │                    │ → scripts/{topic}.md                   │
│  └────────┬─────────┘                                         │
│           ▼                                                   │
│  ┌──────────────────┐                                         │
│  │ Phase 3: 슬라이드 │ ← md-to-slides.js                      │
│  │ 변환              │ ← 레이아웃 30종 + 애니메이션 7종         │
│  │                    │ → slides/{topic}.slides.json            │
│  └────────┬─────────┘                                         │
│           ▼                                                   │
│  ┌──────────────────┐                                         │
│  │ Phase 4: 렌더링   │ ← Remotion (1920×1080, 30fps)          │
│  │                    │ ← 디자인 시스템 (storybook-ds 재구현)   │
│  │                    │ → out/{topic}.mp4                       │
│  └────────┬─────────┘                                         │
│           ▼                                                   │
│  ┌──────────────────┐                                         │
│  │ Phase 5: TTS      │ ← Qwen3 TTS 로컬                      │
│  │ 음성 합성          │ → public/audio/scene-{N}.wav           │
│  └────────┬─────────┘                                         │
│           ▼                                                   │
│  ┌──────────────────┐                                         │
│  │ Phase 6: 합성     │ ← 영상 + 음성 + 자막 타이밍 동기화     │
│  │ & 최종 출력        │ → out/{topic}-final.mp4                │
│  └──────────────────┘                                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 기술 스택

| 레이어 | 기술 | 버전/비고 |
|--------|------|----------|
| 런타임 | Node.js | v20+ |
| 언어 | TypeScript | strict mode |
| 영상 렌더링 | Remotion | 프레임 단위 React 렌더링 |
| TTS | Qwen3 TTS | 로컬 실행 (예정) |
| 디자인 시스템 | Storybook (참조용) + Remotion (실제 구현) | storybook-ds/ |
| 대본 생성 | LLM + character-v1.json | Claude/GPT |
| 리서치 | Firecrawl + YouTube Transcript | 웹 크롤링 |
| 폰트 | Inter + Pretendard Variable + JetBrains Mono | 산세리프 + 코드 |

### 7.3 디렉토리 구조

```
Creator/
├── CLAUDE.md                          ← 프로젝트 규칙
├── docs/
│   └── PRD.md                         ← 이 문서
├── profiles/
│   ├── character-v1.json              ← 캐릭터 스타일 스펙
│   ├── character-narrative-v1.md      ← 캐릭터 서사
│   ├── maker-evan.json                ← 벤치마크 원본 분석
│   └── benchmarks.json                ← 벤치마킹 채널 목록
├── scripts/
│   ├── script-001-ai-tools-converge.md ← 대본 (14분)
│   └── script-001-5min.md             ← 대본 (5분 압축)
├── leanslide/
│   ├── md-to-slides.js                ← 대본 → 슬라이드 JSON 변환기
│   ├── slides/                        ← 생성된 슬라이드 JSON
│   ├── assets/logos/
│   │   └── registry.json              ← 로고 레지스트리 (SVG만)
│   └── remotion-slides/               ← 레이아웃 30종 (Remotion 컴포넌트)
│       └── src/
│           ├── tokens.ts              ← 디자인 토큰
│           ├── Root.tsx
│           ├── SlideVideo.tsx
│           ├── animations/            ← 애니메이션 7종
│           └── layouts/               ← 레이아웃 30종
├── remotion/
│   └── src/
│       ├── Root.tsx                    ← Composition 정의
│       ├── PureScript001.tsx           ← 순수 Remotion 비교 버전
│       ├── themes/slide.ts            ← 테마 토큰
│       ├── data/subtitles.ts          ← 자막 타임스탬프
│       ├── scenes/                    ← 씬별 컴포넌트 (Scene01~05)
│       ├── components/                ← 재사용 컴포넌트
│       │   ├── magic/                 ← 모션그래픽 효과
│       │   └── ...
│       └── public/audio/              ← TTS 음성 파일
├── storybook-ds/                      ← 디자인 시스템 (참조용)
│   └── src/
│       ├── components/                ← SlideBase, GlassCard 등
│       └── docs/                      ← 타이포, 컬러, 간격 등 가이드
├── tts/                               ← TTS 모듈 (예정)
├── style-analyzer/                    ← 스타일 분석 모듈 (예정)
└── .firecrawl/research/               ← 리서치 캐시
```

---

## 8. 파이프라인 상세

### 8.1 대본 생성 (Phase 1 — 완료)

**입력**: 주제 텍스트 + 소스 영상 Transcript

**처리**:
1. 소스 영상에서 Transcript 추출 (Firecrawl)
2. LLM에 character-v1.json + character-narrative-v1.md를 시스템 프롬프트로 주입
3. 대본 생성 (씬별 Markdown)
4. 팩트 검증 체크리스트 자동 생성 (주장 ↔ Transcript 라인 매핑)

**출력**: `scripts/{topic}.md`

**대본 구조**:

```markdown
# 대본 — {제목}

> 출처 / 팩트 검증 상태 / 캐릭터 / 타겟 러닝타임

## 씬 N — {씬 제목}
**레이아웃:** {30종 중 하나}
**러닝타임:** {시작} ~ {끝} (약 {N}자)

### 대본
{본문}

### 슬라이드 지시
{레이아웃별 시각 요소 지정}

---

## 팩트 검증 체크리스트
| # | 대본 내 주장 | Transcript 위치 | 검증 |
```

### 8.2 슬라이드 변환 (Phase 2 — 완료)

**입력**: `scripts/{topic}.md`

**처리**: `md-to-slides.js`가 대본의 슬라이드 지시를 파싱하여 slides.json 생성

**출력**: `leanslide/slides/{topic}.slides.json`

```bash
node leanslide/md-to-slides.js ./scripts/{topic}.md
```

### 8.3 영상 렌더링 (Phase 3 — 완료)

**입력**: `slides/{topic}.slides.json`

**처리**: Remotion이 JSON을 읽어 레이아웃 30종 + 애니메이션 7종으로 렌더링

**출력**: `remotion/out/{topic}.mp4` (1920×1080, 30fps)

```bash
npx remotion render SlideVideo out/{topic}.mp4 \
  --props=./leanslide/slides/{topic}.slides.json
```

### 8.4 TTS 음성 합성 (Phase 4 — 예정)

**입력**: 대본 텍스트 (씬별)

**처리**: Qwen3 TTS 로컬 실행 → 씬별 WAV 생성

**출력**: `remotion/src/public/audio/scene-{N}.wav`

**요구사항**:
- 씬별 분리 (타이밍 동기화를 위해)
- 속도 조절: 기본 1.0x, 필요 시 1.05x (ffmpeg atempo)
- 속도 변경 시 모든 타임스탬프 보정 필수 (자막, Nail, 컴포넌트)

### 8.5 스타일 분석 (Phase 5 — 예정)

**입력**: 유튜브 채널 URL

**처리**:
1. 채널 영상 목록 수집
2. 상위 N개 Transcript 추출
3. LLM으로 크리에이터 스타일 프로파일 추출 (화법, 구조, 주제 분포)
4. 프로파일 기반 테마 자동 생성

**출력**: `profiles/{creator-id}.json`

---

## 9. 디자인 시스템

### 9.1 참조 파일

디자인 판단이 필요할 때 반드시 먼저 읽어야 하는 파일:

```
storybook-ds/src/docs/Typography.stories.tsx      → 폰트 위계
storybook-ds/src/docs/ColorPalette.stories.tsx    → 컬러 시스템
storybook-ds/src/docs/Spacing.stories.tsx         → 간격 규칙
storybook-ds/src/docs/ComponentRules.stories.tsx  → 컴포넌트 원칙
storybook-ds/src/docs/UxGuidelines.stories.tsx    → UX 판단 기준
storybook-ds/src/docs/LayoutSystem.stories.tsx    → 레이아웃 패턴
storybook-ds/src/docs/LayoutVariations.stories.tsx→ 레이아웃 변형
```

### 9.2 컬러 토큰

```
기본 테마 (slides.json의 meta.theme으로 오버라이드 가능):

accent:  '#6ee7b7'   ← 주요 강조, 긍정 (에메랄드)
accent2: '#818cf8'   ← 보조 강조, 정보 (인디고)
accent3: '#fb923c'   ← 에너지, 액션, 경고 (오렌지)
bg:      '#0a0a0f'   ← 배경
surface: '#111118'   ← 카드/패널 배경
text:    '#f1f5f9'   ← 본문
muted:   '#64748b'   ← 보조 텍스트

Remotion 전용 (remotion/src/themes/slide.ts):

bg:      '#0B0E14'
bgLight: '#141820'
accent:  '#CCFF00'   ← 라임
pink:    '#FF71CE'
```

### 9.3 타이포그래피 (1920×1080 기준)

| Tier | 용도 | 크기 | Weight | 기타 |
|------|------|------|--------|------|
| T1 | 메인 타이틀 | 72px | 900 | letter-spacing -0.03em |
| T2 | 소제목 | 32px | 700 | |
| T3 | 본문 | 18px | 400 | line-height 1.7 |
| T4 | 레이블 | 14px | 700 | letter-spacing 0.18em, uppercase |
| T5 | 캡션 | 13px | 600 | color: muted |

### 9.4 간격 (8pt 그리드)

```
xs: 8px   sm: 16px   md: 24px   lg: 32px   xl: 48px   2xl: 64px

컴포넌트 내부 패딩: 최소 24px
섹션 간격: 최소 40px
좌우 여백: 6%
```

### 9.5 Storybook → Remotion 매핑

storybook-ds의 컴포넌트를 직접 import하지 않는다. **시각 패턴만 참고하여 Remotion에서 재구현한다.**

| storybook-ds | Remotion 구현체 | 사용 상황 |
|---|---|---|
| SlideBase | 각 layout 최외곽 div | 모든 슬라이드 |
| GlassCard | CardPop.tsx | process, list 카드 |
| GradientText | titleAccent em 태그 | 모든 타이틀 강조 |
| GradientDivider | 섹션 구분선 | 슬라이드 내 분리 |
| NumberBadge | step-num | process 단계 번호 |
| SectionTag | label | 슬라이드 상단 레이블 |
| CliPrompt | TerminalSlide 내부 | 터미널 출력 |
| PromptBlock | highlight, quote | 핵심 문장 강조 |
| Badge | pill, step-tag | 키워드 태그 |

### 9.6 절대 금지

```
 하드코딩 색상값 (반드시 토큰 사용)
 이모지/이모티콘 (lucide-react SVG만 사용)
 GSAP을 Remotion 컴포넌트 안에서 사용
 storybook-ds 컴포넌트 직접 import
 로고를 SVG 코드로 직접 그리기
 웹 검색으로 로고 이미지 URL 가져오기
 비슷하게 생긴 아이콘으로 대체하기
 텍스트로 로고 표현하기
```

### 9.7 로고 사용 규칙

```
 leanslide/assets/logos/registry.json에서만 로고 참조
 registry에 없는 툴 → 로고 없이 텍스트 레이블만 표시
 registry에 없으면 메시지 출력:
   "⚠️ [툴명] 로고가 registry에 없습니다.
    assets/logos/에 SVG 추가 후 registry.json에 등록해주세요."
```

---

## 10. 애니메이션 시스템

### 10.1 기본 원칙

- **모든 애니메이션은 `useCurrentFrame()` 기반**. GSAP 사용 금지.
- Framer Motion 기반 라이브러리(animate-ui, Magic UI 등)는 Remotion 비호환. **시각 패턴만 참고, interpolate로 재구현.**
- React hooks는 **early return 전에 호출 필수** (Remotion #300 에러 방지).

### 10.2 애니메이션 컴포넌트 7종

`leanslide/remotion-slides/src/animations/`

| 컴포넌트 | 연결 레이아웃 | 효과 |
|---|---|---|
| RadarScan | concept, diagram | 원형 스캔 회전 + 노드 페이드인 |
| CircleProgress | highlight, chapter | SVG stroke-dashoffset + 중앙 pop |
| CardPop | process, list, example | 그림자 레이어 + 슬라이드업 |
| BentoGrid | list, stats-grid, pros-cons | 그리드 순차 등장 |
| CountUp | stats-grid, highlight | 숫자 롤링 + bounce |
| DotsLoader | transition | 3점 순차 scale |
| StrokeProgress | process, timeline, flow | 가로 진행 + glow |

### 10.3 모션그래픽 효과 (Magic UI 재구현)

`remotion/src/components/magic/`

| 컴포넌트 | 효과 | 상태 |
|---|---|---|
| SparklesText | 반짝이는 별 SVG 텍스트 | 사용 중 |
| FloatingParticles | 배경 플로팅 파티클 | 사용 중 |
| WordReveal | 점진적 텍스트 드러남 | 사용 중 |
| TypingText | 타이핑 효과 | 대기 |
| BorderBeam | 테두리 빔 효과 | 대기 |

### 10.4 useCurrentFrame 헬퍼

```typescript
fadeIn(frame, start, duration=15)       // 0→1 opacity
slideUp(frame, start, duration=18)      // 20px→0 translateY
staggerIn(frame, index, start, stagger=5) // 인덱스별 순차 등장
drawLine(frame, start, duration=20)     // SVG stroke 그리기
popIn(frame, start, duration=12)        // 0→1.05→1 scale
```

### 10.5 GSAP → Remotion 변환표

```
0.5s duration  →  15 frames (30fps 기준)
0.6s duration  →  18 frames
0.13s stagger  →  4 frames
power3.out     →  Easing.out(Easing.cubic)
back.out(1.7)  →  Easing.out(Easing.back(1.7))
```

---

## 11. 슬라이드 생성 규칙

### 11.1 레이아웃 30종

`leanslide/remotion-slides/src/layouts/`

#### 오프닝/전환 (5종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| title | TitleSlide.tsx | 강의 오프닝 | 4초 |
| chapter | ChapterSlide.tsx | 챕터 전환 (번호 + 제목) | 3초 |
| transition | TransitionSlide.tsx | 섹션 전환 (DotsLoader) | 2초 |
| teaser | TeaserSlide.tsx | 다음 내용 예고 | 3초 |
| recap | RecapSlide.tsx | 중간 요약 | 5초 |

#### 개념 설명 (6종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| concept | ConceptSlide.tsx | 개념 + RadarScan | 6초 |
| definition | DefinitionSlide.tsx | 용어 정의 (좌: 단어, 우: 설명) | 5초 |
| analogy | AnalogySlide.tsx | 비유 설명 (아이콘 2개 대응) | 5초 |
| highlight | HighlightSlide.tsx | 핵심 문장 1개 강조 | 4초 |
| quote | QuoteSlide.tsx | 인용구 전체 화면 | 4초 |
| fullscreen-text | FullscreenTextSlide.tsx | 임팩트 한 줄 | 3초 |

#### 스토리텔링 (4종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| problem | ProblemSlide.tsx | 문제 제기 (accent3 강조) | 5초 |
| solution | SolutionSlide.tsx | 해결책 제시 (accent 강조) | 5초 |
| example | ExampleSlide.tsx | 실제 사례 | 6초 |
| before-after | BeforeAfterSlide.tsx | 전후 비교 | 6초 |

#### 구조/프로세스 (5종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| process | ProcessSlide.tsx | 단계별 (최대 4단계) | 7초 |
| timeline | TimelineSlide.tsx | 시간 흐름 | 6초 |
| flow | FlowSlide.tsx | 화살표 흐름도 | 6초 |
| architecture | ArchitectureSlide.tsx | 시스템 구조도 | 7초 |
| diagram | DiagramSlide.tsx | 관계도 (노드-엣지) | 6초 |

#### 나열/비교 (5종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| list | ListSlide.tsx | 항목 나열 BentoGrid | 5초 |
| pros-cons | ProsConsSlide.tsx | 장단점 | 6초 |
| comparison | ComparisonSlide.tsx | A vs B | 6초 |
| table | TableSlide.tsx | 비교표 | 6초 |
| stats-grid | StatsGridSlide.tsx | 수치 CountUp | 6초 |

#### 코드/기술 (3종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| code | CodeSlide.tsx | 코드 + 설명 | 7초 |
| code-compare | CodeCompareSlide.tsx | 전후 코드 비교 | 7초 |
| terminal | TerminalSlide.tsx | 터미널 출력 | 6초 |

#### 마무리 (2종)

| layout | 파일 | 설명 | 기본 duration |
|--------|------|------|--------------|
| closing | ClosingSlide.tsx | 요약 + CTA | 5초 |
| next-episode | NextEpisodeSlide.tsx | 다음 영상 예고 | 4초 |

### 11.2 슬라이드 생성 사고 프로세스

md-to-slides.js가 대본을 변환할 때 반드시 이 순서로 판단한다.

#### Step 1. 영상 전체 구조 설계

10~15분 영상 기준 (30~50장):

```
오프닝        : title × 1
챕터 구분     : chapter × 2~3
개념 설명     : concept, definition, analogy 혼합
핵심 강조     : highlight, quote, fullscreen-text (전체의 20% 이하)
문제/해결     : problem → solution 쌍으로
프로세스      : process, flow, timeline 상황에 맞게
나열/비교     : list, comparison, stats-grid
코드/기술     : code, terminal (기술 주제면)
중간 전환     : transition, recap 중간중간
마무리        : recap → closing → next-episode
```

#### Step 2. 감정-레이아웃 매핑

| 감정 | 레이아웃 | animation.style | 아이콘 계열 |
|------|----------|-----------------|-------------|
| 경이로움/가능성 | concept | radar | star, zap |
| 긴장감/문제 | problem | fade | alert-triangle |
| 논리/구조 | process, flow | stroke | layers, git-branch |
| 속도/효율 | process | stroke | zap, rocket |
| 신뢰/안정 | list | bento | shield, check-circle |
| 비교/선택 | comparison | slide-left | split |
| 수치/성과 | stats-grid | count-up | trending-up |
| 흥미/호기심 | concept, analogy | radar | search, eye |
| 마무리/행동 | closing | fade | arrow-right, play |

#### Step 3. 아이콘 선택 — 명사가 아닌 동사

```
 "데이터베이스" → database
 핵심 동작이 "조회" → search
 핵심 동작이 "저장" → save
 핵심 동작이 "연결" → link
 핵심 동작이 "분석" → bar-chart
 핵심 동작이 "자동화" → refresh-cw
 핵심 동작이 "보호" → shield
```

#### Step 4. 애니메이션 — 콘텐츠의 물리적 특성

```
위→아래 흐름 (순서, 단계)     → stagger-up + stroke
갑자기 등장 (임팩트, 강조)    → fade
퍼져나가는 것 (네트워크)      → radar + pop
좌우 대립 (비교, 대조)        → slide-left
쌓이는 것 (누적, 성장)        → count-up + stroke
그리드 등장 (나열, 특징)      → bento
```

#### Step 5. 전체 리듬 규칙

```
 같은 레이아웃 연속 2회 금지
 highlight/quote/fullscreen-text 전체의 20% 이하 (희소성 = 임팩트)
 problem 다음엔 반드시 solution
 process 바로 다음 list 금지 (둘 다 나열형)
 chapter 슬라이드로 주요 섹션 구분
 8~10장마다 transition 또는 recap으로 호흡 조절
 마지막 3장: recap → closing → next-episode
```

---

## 12. 데이터 스키마

### 12.1 slides.json

```jsonc
{
  "meta": {
    "title": "string",                    // 영상 제목
    "theme": {
      "accent":  "#6ee7b7",               // 오버라이드 가능
      "accent2": "#818cf8",
      "accent3": "#fb923c",
      "bg":      "#0a0a0f"
    },
    "font": "Pretendard",
    "totalSlides": 30,                     // number
    "estimatedDuration": 600               // 초 단위
  },
  "slides": [
    {
      "id": 1,                             // 1-based
      "layout": "title",                   // 레이아웃 30종 중 하나
      "duration": 4,                       // 초
      "content": {
        // 레이아웃별로 다름. 아래 12.2 참조.
      },
      "animation": {
        "entrance": "stagger-up",          // stagger-up | fade | slide-left | pop
        "style": "radar",                  // radar | circle-progress | card-pop | bento | count-up | dots | stroke
        "staggerDelay": 4                  // 프레임 단위
      }
    }
  ]
}
```

### 12.2 레이아웃별 content 스키마

**title**:
```jsonc
{ "title": "string", "subtitle": "string", "label": "string" }
```

**concept**:
```jsonc
{
  "title": "string",
  "description": "string",
  "icon": "string",          // lucide-react 아이콘명
  "nodes": [                 // RadarScan 노드
    { "label": "string", "icon": "string" }
  ]
}
```

**list**:
```jsonc
{
  "title": "string",
  "items": [
    { "title": "string", "description": "string", "icon": "string" }
  ]
}
```

**comparison**:
```jsonc
{
  "title": "string",
  "left": { "label": "string", "points": ["string"] },
  "right": { "label": "string", "points": ["string"] }
}
```

**stats-grid**:
```jsonc
{
  "title": "string",
  "stats": [
    { "value": "number | string", "label": "string", "suffix": "string" }
  ]
}
```

**code**:
```jsonc
{
  "title": "string",
  "language": "string",
  "code": "string",
  "description": "string"
}
```

**highlight / quote**:
```jsonc
{
  "text": "string",
  "attribution": "string"   // quote에서 인용 출처
}
```

**process**:
```jsonc
{
  "title": "string",
  "steps": [
    { "number": 1, "title": "string", "description": "string", "icon": "string" }
  ]
}
```

(나머지 레이아웃도 동일한 패턴. 각 레이아웃 파일의 Props 타입 참조.)

### 12.3 character-v1.json 스키마 요약

```jsonc
{
  "meta": { "characterId", "version", "basedOn", "background" },
  "voice": { "formality", "tone", "energy", "doList[]", "dontList[]" },
  "structure": { "opening", "body", "closing" },
  "titlePatterns": { "primary", "examples[]", "avoid[]" },
  "characterTraits": { "identity", "authoritySource", "uniqueAngle", "interpreterRole", "humility", "humor", "relationship" },
  "visual": { "colorPalette", "darkMode" },
  "content": { "targetAudience", "domain", "depthLevel", "videoLength" },
  "scriptGuidelines": { "perScene", "totalRuntime", "koreanPace" }
}
```

---

## 13. 로드맵

### Phase 1: 슬라이드 파이프라인 — 완료

| 항목 | 상태 | 비고 |
|------|------|------|
| 레이아웃 30종 | 완료 | leanslide/remotion-slides/src/layouts/ |
| 애니메이션 7종 | 완료 | leanslide/remotion-slides/src/animations/ |
| md → JSON 변환기 | 완료 | md-to-slides.js |
| Remotion 렌더링 | 완료 | 1920×1080, 30fps |
| 디자인 시스템 | 완료 | storybook-ds/ (참조) + Remotion (실제) |
| 모션그래픽 효과 | 완료 | Magic UI 재구현 5종 (3종 사용 중, 2종 대기) |
| 대본 생성 에이전트 | 완료 | character-v1.json 기반 |
| 팩트 검증 시스템 | 완료 | Transcript 라인 매핑 |
| 씬 간 전환 | 완료 | 크로스페이드 0.5초 + ProgressBar |
| 자막 시스템 | 완료 | ffmpeg 1.05x 보정 포함 |
| 산출물 | 완료 | script-001 v7 (8.4MB) + Pure 비교본 (5.4MB) |

### Phase 2: 스타일 분석 — 미착수

| 항목 | 설명 |
|------|------|
| YouTube Transcript 크롤러 | 채널별 상위 N개 영상 Transcript 자동 수집 |
| 스타일 프로파일러 | LLM 기반 화법/구조/주제 패턴 추출 |
| 테마 생성기 | 프로파일 → 컬러/폰트/레이아웃 선호도 자동 생성 |
| 벤치마크 자동화 | benchmarks.json의 채널들 주기적 분석 |

### Phase 3: TTS 연동 — 미착수

| 항목 | 설명 |
|------|------|
| Qwen3 TTS 로컬 세팅 | Docker 또는 conda 환경 |
| 씬별 음성 생성 | 대본 씬 분할 → 개별 WAV |
| 속도/피치 보정 | ffmpeg atempo + 타임스탬프 일괄 보정 |
| Remotion 타임라인 배치 | 음성 길이에 따른 씬 duration 자동 조정 |

### Phase 4: 엔드투엔드 자동화 — 미착수

| 항목 | 설명 |
|------|------|
| 단일 CLI | `creator-agent run "주제"` → MP4 출력 |
| 파이프라인 오케스트레이션 | 리서치→대본→슬라이드→TTS→렌더링 자동 연결 |
| QA 체크포인트 | 각 단계 완료 후 자동 검증 (빈 화면 비율, 글자 수, 팩트 체크) |
| 에러 복구 | 실패 단계부터 재실행 |

### Phase 5: 채널 운영 (장기) — 미착수

| 항목 | 설명 |
|------|------|
| 썸네일 자동 생성 | 제목 + 키 비주얼 → 썸네일 이미지 |
| 업로드 자동화 | YouTube API 연동 |
| 커뮤니티/코스 퍼널 | 벤치마크 E18~E20 실현 |
| A/B 테스트 | 제목/썸네일 변형 실험 |

---

## 14. 성공 지표

### 14.1 제작 효율

| 지표 | 현재 (수동) | 목표 (자동) | 측정 방법 |
|------|-----------|-----------|----------|
| 영상 1편 제작 시간 | 12~18시간 | ~1시간 (사람 30분) | 파이프라인 로그 |
| 주간 업로드 수 | 0~1편 | 3~5편 | YouTube Studio |
| 빈 화면 비율 | N/A | 5% 이하 | 프레임 샘플링 자동 검사 |
| 팩트 검증 통과율 | N/A | 100% | 체크리스트 자동 생성 |

### 14.2 콘텐츠 품질

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 평균 시청 지속률 | 40% 이상 | YouTube Analytics |
| 클릭률 (CTR) | 5% 이상 | YouTube Analytics |
| 댓글 참여율 | 영상당 10개 이상 | YouTube Studio |
| 성공 체크리스트 충족 | 26개 중 20개 이상 | 6.5 체크리스트 수동 점검 |

### 14.3 채널 성장

| 지표 | 3개월 | 6개월 | 12개월 |
|------|-------|-------|--------|
| 구독자 | 1,000 | 5,000 | 20,000 |
| 월간 조회수 | 10,000 | 50,000 | 200,000 |
| 영상 수 | 40~60편 | 100~150편 | 200~300편 |

---

## 15. 제약 조건 및 금지 사항

### 15.1 기술적 제약

| 제약 | 이유 | 대안 |
|------|------|------|
| GSAP 사용 금지 | Remotion의 프레임 단위 렌더링과 호환 불가 | useCurrentFrame() + interpolate |
| Framer Motion 사용 금지 | Remotion 비호환 | 시각 패턴만 참고, interpolate 재구현 |
| CSS `color-mix` 사용 주의 | Remotion Chromium에서 불안정 | opacity 기반 대체 |
| storybook-ds 직접 import 금지 | Remotion과 빌드 환경 분리 | 시각 패턴만 참고하여 재구현 |
| React hooks early return 전 호출 필수 | Remotion #300 에러 방지 | useMemo, useState 등 모든 hooks를 조건부 return 전에 배치 |

### 15.2 콘텐츠 제약

| 제약 | 이유 |
|------|------|
| Transcript에 없는 정보 사용 금지 | 팩트 검증 불가능한 정보 유포 방지 |
| 원본 크리에이터 고유 표현 사용 금지 | 독자적 캐릭터 구축을 위해 |
| 검증 안 된 통계/비율 팩트 취급 금지 | 신뢰도 유지 |

### 15.3 디자인 제약

| 제약 | 이유 |
|------|------|
| 하드코딩 색상 금지 | 테마 변경 시 전체 깨짐 방지 |
| 이모지/이모티콘 사용 금지 | lucide-react SVG로 통일 |
| 로고 직접 그리기/웹 검색 금지 | registry.json으로 관리 일원화 |

### 15.4 학습된 교훈 (이전 세션에서 발견)

| 교훈 | 상세 |
|------|------|
| 대칭 split 레이아웃 | 카드 크기 유지 + gap 조절로 컬럼 시작점 정렬 |
| 슬라이드는 웹이 아니다 | 감정 배치, 못 박기, 기능 절제. 대본 먼저, 컴포넌트 나중 |
| 테마-Showcase 동기화 | 테마 토큰 변경 시 Showcase 값도 동기화 필수 |
| ffmpeg 속도 변경 후 | 모든 타임스탬프 ÷ 보정 비율. 자막, Nail, 컴포넌트 전부 |

---

## 부록 A: 실행 명령어 Quick Reference

```bash
# 대본 → 슬라이드 JSON
node leanslide/md-to-slides.js ./scripts/{topic}.md

# 슬라이드 → MP4 렌더링
npx remotion render SlideVideo out/{topic}.mp4 \
  --props=./leanslide/slides/{topic}.slides.json

# Remotion Studio 프리뷰
npx remotion studio

# Storybook 디자인 시스템 확인
cd storybook-ds && pnpm storybook
```

## 부록 B: 파일 참조 맵

```
캐릭터를 이해하려면  → profiles/character-v1.json + character-narrative-v1.md
벤치마크를 보려면    → profiles/benchmarks.json + profiles/maker-evan.json
대본 예시를 보려면   → scripts/script-001-ai-tools-converge.md
디자인 규칙을 보려면 → storybook-ds/src/docs/*.stories.tsx
레이아웃을 보려면    → leanslide/remotion-slides/src/layouts/
애니메이션을 보려면  → leanslide/remotion-slides/src/animations/
토큰을 보려면       → leanslide/remotion-slides/src/tokens.ts
렌더링 결과를 보려면 → remotion/out/script-001-v7.mp4
```
