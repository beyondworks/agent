# 기술 조사 (구축 전 확인 필요)

## Remotion

- React 기반 프로그래매틱 영상 제작 프레임워크
- `npx create-video@latest` 로 프로젝트 초기화
- 프레임 단위 React 렌더링 → mp4/webm 출력
- **Remotion MCP** 존재 — Claude Code에서 직접 컴포지션 생성/렌더링 가능 여부 확인 필요
- 공식 문서: https://www.remotion.dev/docs

### 확인 사항
- [ ] Remotion MCP 서버 설치 및 사용법
- [ ] 로컬 렌더링 vs 클라우드 렌더링 (Remotion Lambda)
- [ ] 오디오 파일 import 및 타임라인 배치 방법
- [ ] 자막(Subtitle) 동기화 패턴
- [ ] 한글 폰트 번들링 방법

## Qwen3 TTS

- 오픈소스 TTS 모델
- 한국어 지원 여부 및 음질 확인 필요
- 로컬 실행 시 하드웨어 요구사항 (GPU 필요 여부)

### 확인 사항
- [ ] Qwen3 TTS 설치 방법 (pip/conda)
- [ ] 한국어 음성 품질 테스트
- [ ] 대안 TTS: Edge TTS (무료, 클라우드), Coqui TTS (오픈소스)
- [ ] 음성 파일 포맷 및 샘플레이트 (Remotion 호환)

## 유튜브 Transcript 추출

- `youtube-transcript-api` (Python) 또는 `youtube-transcript` (Node.js)
- YouTube Data API v3 (쿼터 제한 있음)

### 확인 사항
- [ ] 자동 생성 자막 vs 수동 자막 추출 차이
- [ ] API 키 없이 가능한 방법 (비공식 라이브러리)
- [ ] 한국어 자막 정확도
