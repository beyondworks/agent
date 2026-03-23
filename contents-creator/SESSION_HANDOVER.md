# Session Handover

## 날짜: 2026-03-23 (오후 세션)

## 프로젝트 개요
VideoForge — AI 기반 영상 콘텐츠 제작 자동화 플랫폼
- Turborepo 모노레포: apps/web (Next.js 16) + apps/worker + packages/shared
- Supabase (PostgreSQL + Auth + Storage) + Gemini 3.1 Pro (대본) + Gemini Flash Image (이미지) + Veo 3.1 (영상) + Google Cloud TTS (음성) + Remotion (렌더링)

## 완료 (이번 세션 11개 커밋)

### 렌더링 파이프라인 수정
- render route: dev 서버 cwd가 `apps/web`일 때 스크립트 경로 해석 실패 수정 (`existsSync` 폴백)
- render-video.mjs: `__dirname` 기준 entryPoint 해석 (cwd 무관)
- render route: `scene_number` 기준 중복 씬 제거 로직 추가
- render route: `child.on('close')` 에서 `createClient()` → `createAdminClient()` (쿠키 없는 컨텍스트에서 Storage 업로드 실패 수정)
- export page: 응답 파싱 버그 수정 (`json.data.jobId` → `json.jobId`)
- export page: 비디오 URL 키 수정 (`url` → `videoUrl`)
- render route: Storage 업로드 실패 시 명시적 에러 핸들링 + 로그
- 비트레이트: `videoBitrate: '1500K'` (CRF+videoBitrate 동시 사용 충돌 수정)

### TTS 음성 합성 통합
- render-video.mjs에서 렌더 전 Google TTS API 직접 호출
- 씬별 오디오를 base64 data URL로 씬 props에 주입
- Scene.tsx: 씬별 `<Audio>` 컴포넌트 추가
- TTS 후 오디오 길이 추정 → 씬 길이 자동 확장 (오디오 + 1초 여유)
- Google/로컬(클론) 이중 라우팅 지원

### 자막 개선
- 긴 나레이션을 ~28자 단위로 문장/구 분할
- 오디오 길이 기준 자막 타이밍 분배 (씬 길이가 아닌)
- 세그먼트 전환 시 페이드인 + 슬라이드업 애니메이션
- 오디오 종료 후 자막 자동 숨김

### 시간차 애니메이션 (롱폼용)
- 이미지: 블러→선명 진입 + 스케일 + 슬라이드 + 느린 줌
- 키워드: 나레이션에서 숫자/핵심어 추출, spring 애니메이션 팝업
- 오버레이: 비네트 펄스 + 빛 스윕 효과
- 씬 번호 기반 방향/각도 교차로 반복감 방지

### 진행상황 실시간 표시
- render-video.mjs: `[PROGRESS]` JSON 메시지 stdout 출력 (단계별)
- render route: stdout 파싱 → 2초 간격 DB job 업데이트
- RenderProgress: 터미널 스타일 상태 메시지 + 진행률 바 + 단계 표시

### 편집 페이지
- 나레이션 편집 기능 추가 (NarrationEditor: textarea + blur 자동저장)
- scenes PATCH API: narration, duration_sec 필드 추가

### DB 정리
- stale scene_generation job → completed 처리
- 중복 씬 12개 삭제 (49행 → 37행)

## 미완료

### 🔴 Supabase Storage 업로드 크기 제한
- **현재**: 37개 씬 전체 렌더 시 ~100MB (64MB 제한 초과)
- **원인**: TTS로 씬 길이 확장 → 7.8분 영상, 1500kbps = ~100MB
- **다음 단계**: (1) 비트레이트를 800K로 낮추거나, (2) Supabase Pro 업그레이드 (250MB 제한), (3) ffmpeg 후처리 2-pass 인코딩으로 목표 크기 맞춤

### 🔴 자막-보이스 싱크 정밀도
- **현재**: MP3 base64 크기 기반 오디오 길이 추정 (오차 있음)
- **개선안**: Google TTS API의 timepoint 기능으로 워드레벨 타임스탬프 획득, 자막을 실제 발화 타이밍에 맞춤

### 🟡 숏폼 영상 — Veo 3.1 동적 이미지
- **전략 결정**: 롱폼=Remotion 애니메이션, 숏폼=Veo 3.1 영상
- **미구현**: Veo 3.1 이미지→영상 변환 파이프라인
- **다음 단계**: 씬별 Veo API 호출 → 영상 클립 → Remotion 합성

### 🟡 내보내기 페이지 추가 개선
- Remotion Player 미리보기 추가
- 파일 정보 표시 (해상도, FPS, 크기, 길이)
- 다운로드 버튼 → 로컬 파일 or Storage URL 분기

### 🟡 김효율 보이스 커스텀
- instruction 파라미터 추가됨, 에너지 프롬프트 설정 완료
- 속도/피치 후처리 미구현
- 감정 프리셋 → instruction 매핑 확장 가능

### 🟢 후순위
- Auto-QC 대시보드
- BGM Audio Ducking
- 동적 타이포그래피
- Worker Docker 배포

## 에러/학습

| 문제 | 원인 | 해결 |
|---|---|---|
| render route 500 | `existsSync` import 누락 | fs import에 추가 |
| dev 서버 cwd ≠ workspace root | `pnpm --filter web dev` → cwd=apps/web | existsSync 폴백 + __dirname 사용 |
| Storage 업로드 조용한 실패 | child.on('close')에서 createClient() → cookies() 미사용 | createAdminClient() (서비스 역할 키) |
| 비디오 URL 404 | 업로드 실패했지만 getPublicUrl()이 URL 생성 | 업로드 에러 체크 후 job failed 처리 |
| CRF+videoBitrate 충돌 | FFmpeg에서 동시 사용 불가 | videoBitrate만 사용 |
| 100MB > 64MB 제한 | TTS로 7.8분 영상, 1500kbps | 비트레이트 더 낮추거나 Pro 업그레이드 필요 |
| 씬 1~12 중복 | 씬 생성 job 재실행으로 이중 삽입 | DB에서 수동 삭제 + render route에 중복 제거 로직 |

## 환경 정보

| 항목 | 값 |
|---|---|
| Dev URL | http://localhost:4000 |
| TTS 서버 | http://127.0.0.1:8000 (TTStudio, 수동 시작 필요) |
| 테스트 계정 | test@test.com / test1234!! |
| Supabase 프로젝트 | xsjovkusodmqijvyopoe |
| Google API Key | .env.local (Gemini + Cloud TTS 공용) |
| 김효율 voice_id | bfdb8b63-3203-43f5-a16c-f6c9011d4556 |
| 커밋 수 | 50개 (이전 39 + 이번 11) |
| 30초 샘플 | /tmp/render-30s.mp4 (3씬, TTS+애니메이션) |

## 다음 세션 시작 시

1. 30초 샘플(`/tmp/render-30s.mp4`) 품질 피드백 반영
2. Storage 업로드 크기 문제 해결 (비트레이트 조정 or Supabase Pro)
3. 자막-보이스 싱크 정밀도 개선 (timepoint API)
4. 숏폼 Veo 3.1 파이프라인 구현
