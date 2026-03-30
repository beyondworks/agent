# Session Handover

## 날짜: 2026-03-30 (세션 9)

## 완료

### 영상 제작 스킬 패키지 구축
- `/create-video` — 전체 파이프라인 오케스트레이터 (7단계: 리서치→대본→TTS→시각화→캡처→CapCut)
- `/ttstudio-voice` — 업데이트: Voicebox 내부 API (동적 포트 탐지, /generate 비동기+SSE)
- `/capcut-project` — 신규: CapCut 프로젝트 자동 생성 (draft_info.json 역공학)
- `/video-capture` — 신규: HTML→Playwright 캡처→MP4 변환
- `setup.sh` — 의존성 전체 자동 설치 (ffmpeg, Node, Python, Playwright, Voicebox, CapCut 확인)
- 설치 테스트 통과 (전 항목 ✓)

### EP.3 보이스 재생성 (120청크, 50자 이하)
- tts-chunks.md 50자 이하로 재분할 (50개→120개)
- Voicebox API로 120청크 TTS 생성 완료 (369.8초, 6분 10초)
- (...) 싱글 트레일링으로 복원 (트리플은 오류였음)
- silencedetect 트리밍 제거 (자연스러운 여운 보존)

### EP.3 비디오 v2 재캡처
- 18개 세그먼트, 오디오 파형 기준 duration으로 재캡처 (363.4초)
- CapCut 프로젝트 v3 생성 (비디오 18개 + 오디오 9개)

### GPT-SoVITS 테스트
- v4 모델 + prompt_text 적용하여 3단락 생성
- 결과: 목소리/말투 품질 미달 → Voicebox 유지 결정

### 유틸리티
- `vb-clean` alias 업데이트: DB 정리 + WAV 삭제 + 캐시 삭제 + 앱 재시작
- Voicebox DB/캐시 정리 여러 차례 실행

### 커밋/푸시
- `b0d62ff` feat/claude-march-video 브랜치에 푸시 완료

## 미완료

### EP.3 관련
1. **보이스 품질 확인** — CapCut에서 120청크 보이스 청취 + '다' 끊김 여부 확인
2. **SRT 수동 임포트** — voice/subtitles.srt을 CapCut에서 임포트
3. **자막 호흡 단위 재편집** — 자동 생성 SRT(120개)을 사용자가 호흡 단위(~300개)로 편집
4. **비디오/오디오 싱크 미세 조정** — CapCut에서 수동

### EP.2 관련
5. **보이스 녹음 + 싱크** — 대본 승인 완료, 보이스 미착수

### 시리즈
6. EP.4: 실전 세팅 가이드 (CLAUDE.md, 에이전트 조합) — 미착수
7. EP.5~7 제작

### 기존 이관
8. 메이킹 영상 대본 승인 + 제작
9. 썸네일 Gemini 프롬프트 템플릿화

## 에러/학습

### TTS 품질 핵심 규칙 (확정)
- **50자 이하 필수** — 길면 TTS가 중간 내용 누락
- **(...) 싱글만** — 트리플은 잘못된 메모리였음. 사용자가 수동 시 1개만 사용
- **silencedetect 트리밍 금지** — 자연스러운 여운까지 잘라서 러닝타임 축소+끊김
- **비디오 duration = 오디오 파형 기준** — 대본 예상 시간이 아님

### CapCut 자막
- text material content JSON은 외부 생성 불가 — SRT 수동 임포트가 유일한 방법
- OrderedDict + compact JSON 시도했으나 실패

### GPT-SoVITS
- torchaudio 2.10.0 → 2.5.1 다운그레이드로 torchcodec 문제 해결
- 제로샷 클로닝: prompt_text 필수, 빈 문자열이면 할아버지 목소리
- v4 모델에서도 Voicebox 대비 품질 부족 → 파인튜닝 없이는 사용 불가

## 다음 세션 시작 시

1. 이 문서 읽고 현재 상태 파악
2. **EP.3 CapCut 프로젝트 확인** — `EP3-에이전트와MCP-v3`에서 보이스 품질 확인
3. 괜찮으면 SRT 임포트 + 자막 편집 → 최종 영상 완성
4. 끊기면 해당 청크만 Voicebox에서 재생성

### 프로젝트 경로
- EP.3: `projects/2026-03-28-claude-code-ep3-agents-mcp/`
- EP.3 대본: `.../script/draft.md`
- EP.3 TTS 청크 (v2): `.../script/tts-chunks.md` (120개, 50자 이하)
- EP.3 음성: `.../voice/` (120 청크 + 9 씬 + full-voice.wav)
- EP.3 SRT: `.../voice/subtitles.srt`
- EP.3 HTML v2: `.../scenes-v2/` (18개)
- EP.3 비디오 v2: `.../output-v2/` (18개 + 합본)
- EP.3 CapCut: `EP3-에이전트와MCP-v3`

### 스킬 패키지
- `~/.claude/skills/create-video/` (SKILL.md + setup.sh)
- `~/.claude/skills/ttstudio-voice/SKILL.md`
- `~/.claude/skills/capcut-project/SKILL.md`
- `~/.claude/skills/video-capture/SKILL.md`

### 도구
- `scripts/capcut-project-gen.py` — CapCut 프로젝트 자동 생성
- `scripts/tts-generate.py` — Voicebox API TTS 배치 생성
- `vb-clean` alias — Voicebox 정리 + 재시작
- GPT-SoVITS: `/Users/yoogeon/Projects/rvc-boss/` (포트 9880, v4)
