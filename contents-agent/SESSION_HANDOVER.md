# Session Handover

## 날짜: 2026-03-23 (세션 2)

## 완료

### 이전 세션 (세션 1)
- 영상 콘텐츠 제작 에이전트 팀 설계 + 구현 완료
- 7개 에이전트 프롬프트, Director SKILL.md, config 파일 등 전체 인프라 구축
- 상세 내용은 세션 1 기록 참조

### 이번 세션: `/create-video` 첫 실행 테스트
- **프로젝트**: `projects/2026-03-23-fireship-agent-benchmark/`
- **주제**: Fireship 채널 에이전트 관련 영상 벤치마킹 → 우리 캐릭터 스타일 3분 16:9 영상

#### 1. Init (완료)
- 프로젝트 디렉토리 + meta.json 생성

#### 2. Research (완료)
- Fireship 에이전트 영상 6건 + 기타 채널 4건 + 뉴스 8건 + SNS 8건 = 총 26건 수집
- 핵심 인사이트 7개 도출
- `research/sources.md` (128줄)

#### 3. Script (완료 + 승인)
- 제목: "2026년, AI 에이전트는 왜 90%가 실패할까"
- 7개 씬, 1,543자, 180초 정확히 맞춤
- `script/draft.md` → `script/final.md` 확정

#### 4. Subtitle (완료)
- 92개 자막, 총 160.2초, 평균 15.5자
- `subtitles/final.srt`

#### 5. Voice (합성 완료 — 승인 대기 중단)
- TTStudio render API 일괄 합성 → 10분 타임아웃 실패
- 개별 블록 합성(synthesize_chunked.py) 방식으로 전환 → 17/17 성공
- 결과: narration.wav (10,094KB / 215.3초), narration.mp3 (1,821KB)
- **문제: 목표 180초 대비 215.3초 (오차 +35.3초, +20%)**
- 승인 게이트에서 세션 종료

## 미완료

### 즉시 필요 (이번 프로젝트)
1. **Voice 오차 해결** — 215.3초 → 180초 목표. 선택지:
   - (A) 이대로 승인 → 자막 타이밍을 실제 음성에 맞춰 재조정
   - (B) TTS 속도 파라미터 조정 후 재합성 (temperature/top_p 변경)
   - (C) 대본 글자 수를 약 1,270자로 축소 후 재합성
2. **Scenes 생성** — scene-designer 에이전트 호출 (Gemini 3 API 필요)
3. **Render** — renderer 에이전트 호출 (렌더 엔진 미확정)
4. **QA** — qa-reviewer 에이전트로 체크리스트 검수

### 인프라 미확정
5. **Renderer 도구 확정** — FFmpeg / Remotion / 기타 비교 테스트
6. **Gemini 3 API 연동** — Nano Banana / Veo 3 프롬프트 가이드 조사
7. **ttsSpeedMultiplier 보정** — 현재 1.85이나 실측 결과 실제 발화가 더 느림. 실측 기반 재계산 필요

### 확장 (MVP 이후)
8. 숏폼 파이프라인
9. 캐릭터 변주 (v2-tech, v3-news)
10. B→A 자동 모드 전환

## 에러/학습

### 이전 세션
- scriptwriter model이 `claude-opus-4-5`로 생성됨 → `opus`로 수정
- styles.json이 비주얼 소스 오브 트루스. character-v1.json의 visual은 참고용
- 색상: 배경 #001C2F, 프라이머리 #06E5AC, 악센트 #4DFFD2

### 이번 세션
- **TTStudio render API 타임아웃**: 17개 블록 일괄 합성 시 `/api/tts/render`가 10분 내 완료 불가. → `/api/tts/synthesize`로 개별 합성 + ffmpeg concat이 안정적
- **TTS 속도 실측치 불일치**: pipeline.json의 ttsSpeedMultiplier 1.85 기준 509자/분이지만, 실제 발화는 약 424자/분 (1520자 / 215.3초 * 60). 보정 계수를 1.54로 수정해야 대본 글자 수가 정확히 맞음
- **synthesize_chunked.py 작성**: `voice/synthesize_chunked.py`에 개별 블록 합성 + ffmpeg 결합 스크립트 완성. 재사용 가능
- **voice_id**: 김효율 클론 보이스 ID = `bfdb8b63-3203-43f5-a16c-f6c9011d4556`

## 다음 세션 시작 시

1. 이 문서 읽고 현재 상태 파악
2. Voice 오차 해결 방향 결정 (A/B/C 중 택 1)
   - 추천: (C) ttsSpeedMultiplier를 1.54로 수정 → 대본 글자 수 재계산(3분 = 약 1,270자) → 대본 축소 → 재합성
   - 또는 (A) 215초 영상으로 승인하고 자막만 재조정
3. Voice 승인 후 Scenes → Render → QA 순서로 진행
4. Scenes 진행 전 Gemini 3 API 키/접근 가능 여부 확인 필요
