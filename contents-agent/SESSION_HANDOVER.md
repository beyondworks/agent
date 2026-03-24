# Session Handover

## 날짜: 2026-03-23 (세션 3)

## 완료

### 이전 세션 (세션 1-2)
- 영상 콘텐츠 제작 에이전트 팀 설계 + 구현
- `/create-video` 첫 실행: Research → Script → Subtitle → Voice (TTStudio) 완료
- Voice 오차 발견: 215초 (목표 180초), ttsSpeedMultiplier 1.85→1.54 보정 필요

### 이번 세션

#### 1. Voice 오차 해결 (완료)
- ttsSpeedMultiplier 1.54로 보정, 대본 1,543→1,283자 축소
- TTStudio 재합성: 182.0초 (목표 180초, 오차 +2초)
- scriptwriter.md 공식도 424자/분 기반으로 수정

#### 2. Scenes 이미지 생성 (완료)
- Gemini 3.1 Flash Image Preview API로 7씬 + 썸네일 생성
- API 키: .env에 저장 (GEMINI_API_KEY)

#### 3. FFmpeg vs Remotion 렌더 비교 (완료 → Remotion 채택)
- FFmpeg: 정적 이미지 나열, 품질 매우 낮음
- Remotion: 동일한 정적 이미지 → 차이 없음
- **결론: AI 생성 이미지 대신 코드 기반 동적 씬으로 전환**

#### 4. Remotion 동적 씬 구축 (완료)
- 기존 v8 프로젝트의 애니메이션 컴포넌트 재사용 (BounceIn, BlurReveal, SlideUpFade, GlassCard, TypingCursor, CountUp)
- fireship 전용 테마: `#111111` 배경 + `#FFC505` 골드 악센트
- 7개 씬 React 컴포넌트 완성:
  - Scene01Hook: 40% vs 90% + 카드 + CLI 타이핑
  - Scene02Agent: 챗봇 vs 에이전트 카드 비교 + 판단→실행→보고 플로우
  - Scene03Explosion: 2026 + 3카드 (모델성능/프로토콜/1445%) + SVG 그래프
  - Scene04Reality: 터미널 + 마케팅 vs 실제 비교 다이어그램
  - Scene05Lens: 3도구 카드 + 브리프 구조 [목적→조건→판단기준→결과]
  - Scene06Action: 메모장 타이핑 + 2주→30분 타임라인
  - Scene07Closing: 키워드 수렴 → "설계가 먼저다" + CTA

#### 5. 오디오 싱크 보정 (완료)
- 청크별 ffprobe로 실측 타이밍 추출
- 각 씬 애니메이션 startFrame을 나레이션 키 프레이즈에 맞춤 (0.3-0.5초 앞서 등장)

#### 6. TTS 엔진 비교 (완료 → Voicebox 채택)
- TTStudio (기존): 발음 정확, 끊김/잡음 있음
- voice-clone (Qwen3 0.6B 로컬): 발음 깨짐 심각 → 폐기
- edge-tts (MS Cloud): 안정적이나 AI 티 남, 클론 불가 → 패스
- **Voicebox (jamiepine/voicebox)**: 가장 자연스러움 → 채택
  - 설치: `/Users/yoogeon/Projects/Voicebox.app`
  - 프로필: Leankim (`6d6070e5-d965-43eb-8b8f-401ab9d5504e`)
  - API: `http://127.0.0.1:17493` (로컬, SSE 폴링 방식)
  - 클론 소스: `voice/0323.MP3` (29초 트리밍 버전: `0323-2.MP3`)

#### 7. 전체 3분 영상 렌더 (완료)
- `/tmp/fireship_full_final.mp4` (25MB, CRF 15, PNG 프레임)
- Voicebox 수동 생성 17블록 + 자동 1블록 = 165초
- 7씬 Remotion 동적 컴포넌트 + 오디오 싱크

#### 8. GitHub 커밋 (완료)
- `https://github.com/beyondworks/agent.git` main 브랜치
- `contents-agent/` 폴더에 프로젝트 구조 커밋 (27파일)

## 미완료

### 즉시 필요
1. **영상 QA** — 사용자 최종 피드백 후 수정 사항 반영
2. **자막 재생성** — Voicebox 오디오 기반 정확한 SRT 타이밍
3. **자막 오버레이** — Remotion에 SubtitleTrack 컴포넌트 추가 또는 FFmpeg 후처리

### 품질 개선
4. **씬별 애니메이션 디테일** — 시각 변화 3-5초 규칙 준수 확인, 빈 구간 채움
5. **HeroUI v3 Tailwind 통합** — Remotion에서 Tailwind 클래스가 렌더 안 되는 문제 해결 필요
6. **Renderer 에이전트 확정** — Remotion으로 결정, renderer.md 업데이트

### 인프라
7. **Voicebox API 자동화 안정화** — SSE 폴링 + 에러 핸들링 강화
8. **GitHub 업데이트** — Remotion 씬 코드, Voicebox 설정 등 추가 커밋

### 확장 (MVP 이후)
9. 숏폼 파이프라인
10. 캐릭터 변주 (v2-tech, v3-news)

## 에러/학습

### TTS
- **voice-clone (Qwen3 0.6B)은 한국어 발음이 근본적으로 불안정** — 모델 크기 문제. 로컬 TTS는 최소 1.7B 이상 필요
- **Voicebox (…) 패턴**: 문장 끝에 `(…)` 붙이면 문장 간 연결이 자연스러워짐. 다음 프로젝트부터 적용
- **TTStudio API**: `/api/tts/synthesize` (개별) 안정적, `/api/tts/render` (일괄) 타임아웃. 새 버전은 `/api/voice/generate` + `/health` 엔드포인트
- **TTStudio 서버 불안정**: 대량 합성 중 서버 다운 빈번. Voicebox가 더 안정적

### Remotion
- **Tailwind CSS 클래스가 Remotion Headless Chromium에서 빌드 안 됨** — 인라인 스타일 유지 필수
- **렌더 품질**: `--crf 15 --image-format png`로 고화질 확보 (기본 CRF는 품질 낮음)
- **오디오 싱크**: 글자 수 기반 추정이 아닌 ffprobe 실측 기반으로 프레임 타이밍 설정해야 정확

### 색상 테마
- 최종 테마: 배경 `#111111` + 프라이머리 `#FFC505` (골드)
- theme.ts 한 파일 수정으로 전체 씬 색상 변경 가능

## 다음 세션 시작 시

1. 이 문서 읽고 현재 상태 파악
2. `/tmp/fireship_full_final.mp4` 최종 영상 확인 (또는 사용자 피드백 대기)
3. 피드백 기반 씬별 수정 → 자막 추가 → 최종 렌더
4. Voicebox 서버 (`127.0.0.1:17493`) 실행 상태 확인
5. TTStudio는 필요 시 `/Users/yoogeon/ttstudio/` 에서 수동 시작
