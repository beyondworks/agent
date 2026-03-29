# Session Handover

## 날짜: 2026-03-29 (세션 8)

## 완료

### CapCut 프로젝트 자동 생성 도구
- `scripts/capcut-project-gen.py` 개발 완료
- CapCut draft_info.json 역공학 (tracks, segments, materials 구조 전체 파악)
- 핵심 발견: CapCut은 macOS 샌드박스 앱 → 프로젝트 Resources/에 파일 복사 필수
- text material의 content JSON은 외부 생성 시 파싱 안 됨 → SRT 임포트 방식으로 전환

### TTS 자동화 파이프라인
- `scripts/tts-generate.py` 개발 완료
- Voicebox 내부 API 발견 (포트 자동 탐지, /generate 비동기 + SSE 폴링)
- GPT-SoVITS 서버 설정 완료 (v4 모델, localhost:9880)
  - torchaudio 2.5.1 다운그레이드로 torchcodec 호환성 해결
  - 제로샷 클로닝 품질은 사용자 기준 미달 (Voicebox가 현재 최선)

### EP.2 슬래시 커맨드
- seg-34 캡처 완료 + 34개 전체 합본 (ep2-slash-commands.mp4, 6:30)
- TTS 청크 파일 65개 생성 완료
- 대본 승인 완료

### EP.3 에이전트와 MCP
- **리서치 완료**: 에이전트 시스템, MCP 프로토콜, 실전 사례 (3개 병렬 에이전트)
- **대본 완성 + 승인**: 9개 씬, ~3,500자
  - 비전문가용 비유 적용 (사장/팀장/팀원, 만능 어댑터, 채용)
  - "제 관점에서" 기획자 시점 해석 포함
  - 팩트체크 완료 (Agent Teams 실험적, MCP 서버 미검증 — 둘 다 사실)
- **TTS 생성 완료**: 120개 청크 (50자 이하), 총 369.8초 (6분 10초)
- **HTML 시각화 18개 생성**: 9씬 × 2 분할, 3개 에이전트 병렬 제작
- **캡처 완료**: 18개 세그먼트, 오디오 파형 기준 duration (363.4초)
- **CapCut 프로젝트 생성**: EP3-에이전트와MCP-v3 (비디오 18개 + 오디오 9개)
- SRT 자막 생성 완료 (CapCut에서 직접 임포트 필요)

### 새 도구/설정
- `vb-clean` alias 등록 (~/.zshrc) — Voicebox 일괄 정리
- GPT-SoVITS API 서버 세팅 (/Users/yoogeon/Projects/rvc-boss/)

### 메모리 4개 추가/수정
- `feedback_capcut_project_gen.md` — CapCut 프로젝트 자동 생성
- `feedback_voicebox_api.md` — Voicebox REST API 자동화
- `feedback_srt_style.md` — SRT 호흡 단위 분리 (평균 15자/2.2초)
- `feedback_tts_manual_workflow.md` — 수정: 50자 이하 청크, (...) 싱글

## 미완료

### EP.3 관련
1. **음성 품질 확인** — 사용자가 CapCut에서 보이스 확인 후 피드백 필요 ('다' 끊김 여부)
2. **SRT 임포트** — CapCut에서 voice/subtitles.srt 수동 임포트
3. **자막 편집** — 사용자가 호흡 단위로 SRT 재편집 (EP.2처럼 150개 수준)
4. **보이스 싱크 조정** — CapCut에서 비디오/오디오 미세 싱크 조정

### EP.2 관련
5. **보이스 녹음 + 싱크** — 대본 승인 완료, 보이스 미착수

### 시리즈
6. EP.4: 실전 세팅 가이드 (CLAUDE.md, 에이전트 조합) — 미착수
7. EP.5~7 제작

### 기존 이관
8. 메이킹 영상 대본 승인 + 제작
9. 썸네일 Gemini 프롬프트 템플릿화

## 에러/학습

### CapCut 프로젝트 생성
- **text material content JSON 외부 생성 불가** — CapCut이 내부 생성한 것만 파싱. SRT 임포트로 우회
- **샌드박스 파일 접근** — ~/Movies/CapCut/ 외부 파일은 "파일에 액세스할 수 없음". Resources/에 복사 필수

### TTS 자동화
- **청크 50자 이하 필수** — 길면 TTS가 중간 내용 누락 (대본 손실 원인)
- **(...) 싱글만 사용** — 트리플은 불필요, 메모리 오류였음
- **silencedetect 트리밍 금지** — 자연스러운 여운까지 잘라서 러닝타임 축소 + 끊김
- **Voicebox API vs 수동의 차이는 검수 유무** — 같은 API, 같은 파라미터. 수동이 나은 이유는 듣고 재생성하기 때문

### GPT-SoVITS
- **torchaudio 2.10.0 torchcodec 필수 의존** → 2.5.1 다운그레이드로 해결
- **제로샷 클로닝 품질 미달** — prompt_text 필수, v4 모델 사용해도 Voicebox 대비 부족
- **ref_audio 경로에 공백 불가** — /tmp/로 복사 후 사용

## 다음 세션 시작 시

1. 이 문서 읽고 현재 상태 파악
2. **EP.3 CapCut 프로젝트 확인** — `EP3-에이전트와MCP-v3`에서 보이스 품질 + 영상 싱크 확인
3. 사용자 피드백에 따라 보이스 재생성 또는 수동 녹음 전환
4. SRT 임포트 + 자막 편집 지원

### 프로젝트 경로
- EP.3: `projects/2026-03-28-claude-code-ep3-agents-mcp/`
- EP.3 대본: `projects/2026-03-28-claude-code-ep3-agents-mcp/script/draft.md`
- EP.3 TTS 청크: `projects/2026-03-28-claude-code-ep3-agents-mcp/script/tts-chunks.md` (120개, 50자 이하)
- EP.3 음성: `projects/2026-03-28-claude-code-ep3-agents-mcp/voice/` (120 청크 + 9 씬 + full)
- EP.3 SRT: `projects/2026-03-28-claude-code-ep3-agents-mcp/voice/subtitles.srt`
- EP.3 HTML v2: `projects/2026-03-28-claude-code-ep3-agents-mcp/scenes-v2/` (18개)
- EP.3 비디오 v2: `projects/2026-03-28-claude-code-ep3-agents-mcp/output-v2/` (18개 + 합본)
- EP.3 CapCut config: `projects/2026-03-28-claude-code-ep3-agents-mcp/capcut-config-v3.json`
- CapCut 프로젝트: `EP3-에이전트와MCP-v3`
- 도구: `scripts/capcut-project-gen.py`, `scripts/tts-generate.py`
- GPT-SoVITS: `/Users/yoogeon/Projects/rvc-boss/` (포트 9880, v4 모델)
