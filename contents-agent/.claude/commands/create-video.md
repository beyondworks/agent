---
name: create-video
description: 영상 콘텐츠 제작 파이프라인 실행. 리서치 → 대본 → 자막 → 보이스 → 씬 → 렌더링 → QA까지 전체 파이프라인을 오케스트레이션한다.
---

# Create Video — Director Skill

영상 콘텐츠 제작 파이프라인의 오케스트레이터. 7개의 전문 서브에이전트를 순차적으로 호출하고, 승인 게이트를 관리하며, 프로젝트 상태를 추적한다.

## 사용법

```
/create-video "주제"
/create-video --style character-animation "주제"
/create-video --character v2-tech "주제"
/create-video --runtime 7 "주제"
/create-video --resume 2026-03-23-claude-code-tips
```

### 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| --style | infographic-motion | 영상 스타일 (config/styles.json 키) |
| --character | character-v1 | 캐릭터 프로필 (profiles/ 파일명) |
| --runtime | 10 | 목표 러닝타임 (분) |
| --format | longform | longform / shortform |
| --resume | (없음) | 중단된 프로젝트 이어서 진행 |

## 설정 파일

실행 전 반드시 읽어야 하는 파일:

| 파일 | 용도 |
|------|------|
| `config/pipeline.json` | 승인 게이트, 기본값, 재시도 정책 |
| `config/styles.json` | 비주얼 스타일 프리셋, 한글 규칙, 발음 변환표 |
| `guides/CHARACTER_AND_CHECKLIST.md` | 캐릭터 톤/화법 + 26항목 성공 체크리스트 |
| `profiles/{character}.json` | 캐릭터 상세 정의 |

## 실행 절차

### 1단계: Init

```
1. 인자 파싱 (주제, --style, --character, --runtime, --format)
2. config/pipeline.json 로드
3. config/styles.json 로드
4. 프로젝트 폴더 생성: projects/YYYY-MM-DD-{slug}/
   - slug = 주제를 영문 kebab-case로 변환 (한글이면 핵심 키워드 영문화)
5. 하위 폴더 생성: research/, script/, subtitles/, voice/, scenes/, output/
6. meta.json 초기화:
```

```json
{
  "projectId": "YYYY-MM-DD-{slug}",
  "topic": "{주제}",
  "format": "{format}",
  "style": "{style}",
  "styleReference": "",
  "character": "{character}",
  "targetRuntime": {runtime * 60},
  "currentStage": "research",
  "stages": {
    "research":  { "status": "pending" },
    "script":    { "status": "pending" },
    "subtitle":  { "status": "pending" },
    "voice":     { "status": "pending" },
    "scenes":    { "status": "pending" },
    "render":    { "status": "pending" },
    "qa":        { "status": "pending" }
  }
}
```

```
7. 디스크 여유 공간 확인 (최소 1GB 경고)
8. "프로젝트 초기화 완료" 출력
```

### 2단계: Research

```
1. meta.json → stages.research.status = "in_progress"
2. Agent 도구로 researcher 에이전트 호출:
   - prompt에 포함할 컨텍스트:
     - 주제: {topic}
     - 벤치마킹 채널: profiles/benchmarks.json 내용
     - 출력 경로: {projectDir}/research/sources.md
3. 완료 확인: research/sources.md 파일 존재 여부
4. 실패 시: retryPolicy 확인 → 최대 2회 재시도 → 실패 시 사용자 보고
5. meta.json → stages.research.status = "completed", completedAt = 현재 시각
```

### 3단계: Script

```
1. meta.json → stages.script.status = "in_progress"
2. Agent 도구로 scriptwriter 에이전트 호출 (model: opus):
   - prompt에 포함할 컨텍스트:
     - 리서치 결과: {projectDir}/research/sources.md 내용
     - 캐릭터 가이드: guides/CHARACTER_AND_CHECKLIST.md 내용
     - 캐릭터 상세: profiles/{character}.json 내용
     - 캐릭터 서사: profiles/character-narrative-v1.md 내용
     - 한글 발음 변환표: config/styles.json의 koreanTextRules
     - 목표 러닝타임: {targetRuntime}초
     - 출력 경로: {projectDir}/script/draft.md
3. 완료 확인: script/draft.md 파일 존재 + 정규 포맷 준수 (## Scene N 구조)
4. meta.json → stages.script.status = "completed"
```

**승인 게이트 (script)**:
```
pipeline.json의 approvalGates.script 확인
→ true이면:
  1. draft.md 요약 제시:
     - 영상 제목
     - 총 글자 수 / 목표 글자 수
     - 씬 수
     - 각 씬의 제목과 Duration
  2. 사용자에게 선택지 제시:
     [승인] → script/draft.md를 script/final.md로 복사
     [수정 요청] → 피드백을 scriptwriter에 전달하여 재생성
     [재생성] → 피드백 없이 재생성
→ false이면: 자동으로 final.md로 확정
```

### 4단계: Subtitle

```
1. meta.json → stages.subtitle.status = "in_progress"
2. Agent 도구로 subtitle-engineer 에이전트 호출:
   - prompt에 포함할 컨텍스트:
     - 대본: {projectDir}/script/final.md 내용
     - 목표 러닝타임: {targetRuntime}초
     - 출력 경로: {projectDir}/subtitles/final.srt
3. 완료 확인: subtitles/final.srt 존재 + SRT 포맷 유효
4. meta.json → stages.subtitle.status = "completed"
```

### 5단계: Voice

```
1. meta.json → stages.voice.status = "in_progress"
2. Agent 도구로 voice-engineer 에이전트 호출:
   - prompt에 포함할 컨텍스트:
     - 대본: {projectDir}/script/final.md 내용
     - 자막: {projectDir}/subtitles/final.srt 내용
     - 클론 소스 경로: voice/김효율.m4a
     - TTS 소스 경로: ~/Desktop/Appbuild/TTStudio_v2/
     - pipeline.json의 koreanPace 설정
     - 출력 경로: {projectDir}/voice/
3. 완료 확인: voice/narration.wav + voice/narration.mp3 존재
4. 실패 시: 최대 2회 재시도
5. meta.json → stages.voice.status = "completed"
```

**승인 게이트 (voice)**:
```
pipeline.json의 approvalGates.voice 확인
→ true이면:
  1. 보이스 정보 제시:
     - narration.mp3 파일 경로 (사용자가 직접 재생)
     - 총 길이 (초)
     - 목표 러닝타임 대비 오차
     - 자막 싱크 검증 결과
  2. 선택지: [승인] / [수정 요청] / [재생성]
```

### 6단계: Scenes

```
1. meta.json → stages.scenes.status = "in_progress"
2. Agent 도구로 scene-designer 에이전트 호출 (model: opus):
   - prompt에 포함할 컨텍스트:
     - 대본: {projectDir}/script/final.md 내용
     - 자막: {projectDir}/subtitles/final.srt 내용
     - 스타일 설정: config/styles.json 내용
     - 레퍼런스 이미지: meta.json의 styleReference 경로 (있으면)
     - 프롬프트 가이드: guides/prompt-guides/ 내 파일 (있으면)
     - 출력 경로: {projectDir}/scenes/
3. 완료 확인: scenes/ 에 씬 파일 존재 + thumbnail.png 존재
4. 실패 시: 최대 2회 재시도
5. meta.json → stages.scenes.status = "completed"
```

**승인 게이트 (scenes)**:
```
pipeline.json의 approvalGates.scenes 확인
→ true이면:
  1. 씬 목록 제시:
     - 각 씬 파일 경로 (사용자가 직접 확인)
     - 썸네일 경로
     - 총 씬 수
  2. 주요 씬 이미지를 Read 도구로 미리보기 (이미지 파일 직접 표시)
  3. 선택지: [승인] / [수정 요청 + 씬 번호 지정] / [전체 재생성]
```

### 7단계: Render

```
1. meta.json → stages.render.status = "in_progress"
2. Agent 도구로 renderer 에이전트 호출:
   - prompt에 포함할 컨텍스트:
     - 씬 폴더: {projectDir}/scenes/ 내 파일 목록
     - 자막: {projectDir}/subtitles/final.srt 내용
     - 보이스: {projectDir}/voice/narration.wav 경로
     - 자막 스타일: config/styles.json의 subtitleStyle
     - 출력 경로: {projectDir}/output/final.mp4
3. 완료 확인: output/final.mp4 존재
4. 실패 시: 최대 2회 재시도
5. meta.json → stages.render.status = "completed"
```

### 8단계: QA

```
1. meta.json → stages.qa.status = "in_progress"
2. Agent 도구로 qa-reviewer 에이전트 호출 (model: opus):
   - prompt에 포함할 컨텍스트:
     - 프로젝트 전체 산출물 경로: {projectDir}/
     - 대본: script/final.md 내용
     - 자막: subtitles/final.srt 내용
     - 씬 목록: scenes/ 파일 목록
     - 보이스 길이 정보
     - 체크리스트: guides/CHARACTER_AND_CHECKLIST.md 내용
     - 출력 경로: {projectDir}/qa-report.md
3. 완료 확인: qa-report.md 존재
4. meta.json → stages.qa.status = "completed"
```

**승인 게이트 (qa)**:
```
pipeline.json의 approvalGates.qa 확인
→ true이면:
  1. QA 결과 요약 제시:
     - 필수 7개 통과 여부
     - 전체 통과율
     - Don't 위반 건수
     - 판정: PASS / FAIL
  2. FAIL인 경우:
     - 수정이 필요한 단계 식별
     - 해당 단계 + 이후 의존 단계 재실행 여부 확인
     [수정 후 재실행] → 해당 단계부터 파이프라인 재시작
     [무시하고 완료] → 사용자 판단으로 완료 처리
  3. PASS인 경우:
     [완료] → Done 상태로 전환
```

### 9단계: Done

```
1. meta.json → currentStage = "done"
2. 최종 결과 요약 출력:
   - 프로젝트 경로
   - 최종 영상: output/final.mp4
   - 썸네일: scenes/thumbnail.png
   - QA 결과: qa-report.md
   - 총 러닝타임
3. "영상 제작 완료" 출력
```

## --resume: 중단된 프로젝트 재개

```
1. projects/{projectId}/meta.json 로드
2. currentStage 확인
3. 해당 단계의 status 확인:
   - "completed" → 다음 단계로 이동
   - "in_progress" 또는 "pending" → 해당 단계부터 재시작
4. 이전 단계의 산출물이 모두 존재하는지 검증
5. 정상이면 해당 단계부터 파이프라인 진행
```

## 재실행 메커니즘

QA FAIL 또는 중간 실패 시:

```
1. 수정이 필요한 단계 식별 (예: scenes)
2. 해당 단계를 "pending"으로 리셋
3. 의존성 있는 이후 단계도 "pending"으로 리셋
   - scenes 수정 → render, qa도 리셋
   - script 수정 → subtitle, voice, scenes, render, qa 모두 리셋
   - voice 수정 → render, qa 리셋 (subtitle은 유지, voice-subtitle 피드백 루프는 voice-engineer 내부 처리)
4. 리셋된 첫 단계부터 파이프라인 재시작
```

## 에러 핸들링

| 에러 | 대응 |
|------|------|
| 에이전트 호출 실패 | retryPolicy 확인 → retryableStages에 포함되면 최대 2회 재시도 |
| 재시도 모두 실패 | 사용자에게 에러 내용 보고 + 수동 개입 요청 |
| 산출물 파일 미생성 | 에이전트 재호출 (1회) |
| 정규 포맷 불일치 | 피드백과 함께 에이전트 재호출 |
| 디스크 부족 | Init에서 사전 경고. 중간 단계에서 발생 시 즉시 중단 + 보고 |

## 공통 컨텍스트

모든 에이전트에 전달하는 공통 규칙:
- 이모지/이모티콘 사용 금지
- 한글 표기 정확성 필수
- 영문 고유명사는 한글 발음으로 변환 (styles.json 변환표 참조)
- 모든 아이콘은 SVG 벡터
- 비주얼 소스 오브 트루스: config/styles.json (character-v1.json의 visual은 참고용)
