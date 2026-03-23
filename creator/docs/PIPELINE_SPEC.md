# 파이프라인 상세 스펙

## 1단계: 스타일 분석

### 입력
- 유튜브 채널 URL 또는 영상 URL (1~3개)
- (선택) SNS 프로필 URL

### 처리
1. 유튜브 영상 자막(transcript) 추출
   - `youtube-transcript` 또는 YouTube Data API
   - 최소 3개 영상의 자막 수집 (스타일 패턴 안정화)
2. 텍스트 분석 (LLM)
   - 말투 패턴: 존댓말/반말, 문장 종결어, 특징적 표현
   - 전개 구조: 도입 방식, 논리 흐름, 마무리 패턴
   - 콘텐츠 밀도: 비유 빈도, 예시 사용량, 시각 자료 언급
   - 감정 톤: 차분한/열정적, 유머 수준, 권위적/친근
3. 비주얼 스타일 분석 (썸네일/영상 스크린샷)
   - 주요 컬러 팔레트
   - 자막 스타일
   - 레이아웃 선호 (미니멀/화려)

### 출력
- `profiles/{creator-id}.json` — 스타일 프로파일

---

## 2단계: 대본 생성

### 입력
- 스타일 프로파일 JSON
- 주제 (한 줄 설명)
- (선택) 러닝타임 목표, 참고 자료 URL

### 처리
1. 주제 리서치 (웹 검색 또는 제공된 자료 기반)
2. 아웃라인 생성 (5~8개 씬)
3. 씬별 대본 작성 (스타일 프로파일 적용)
4. 분량 검증

### 씬 데이터 구조
```typescript
interface Scene {
  id: string;               // "scene-01"
  title: string;            // 씬 제목 (내부용)
  duration: number;         // 예상 초
  narration: string;        // 나레이션 텍스트 (TTS 입력)
  subtitle: string[];       // 자막 텍스트 (줄 단위 분할)
  visual: {
    template: TemplateType; // 사용할 Remotion 템플릿
    props: Record<string, any>; // 템플릿에 전달할 데이터
  };
  transition?: TransitionType; // 다음 씬 전환 효과
}

type TemplateType =
  | 'title'          // 제목 슬라이드
  | 'text-image'     // 텍스트 + 이미지
  | 'comparison'     // 비교표 (2열)
  | 'flow'           // 순서도/프로세스
  | 'quote'          // 인용/핵심 문구
  | 'stats'          // 통계/숫자 강조
  | 'code'           // 코드 블록
  | 'list'           // 불릿 리스트
  | 'transition'     // 전환 화면 (섹션 구분)

type TransitionType = 'fade' | 'slide' | 'wipe' | 'none';
```

### 분량 검증 기준
- 한국어 나레이션 속도: 분당 275자
- 목표: 10~15분 (2,750~4,125자)
- 씬당 평균 60~120초

### 출력
- `scripts/{content-id}/scenes.json` — 씬 배열
- `scripts/{content-id}/narration.txt` — 전체 나레이션 (검수용)

---

## 3단계: 영상 제작 (Remotion)

### 입력
- `scenes.json`
- 스타일 프로파일 (테마 컬러/폰트)

### 처리
1. 씬별 Remotion Composition 생성
2. 테마 적용 (프로파일 기반 컬러/폰트)
3. 자막 레이어 추가
4. 전환 효과 적용

### Remotion 구조
```
src/
├── compositions/
│   └── ContentVideo.tsx      ← 메인 컴포지션 (씬 조립)
├── templates/
│   ├── TitleTemplate.tsx
│   ├── TextImageTemplate.tsx
│   ├── ComparisonTemplate.tsx
│   ├── FlowTemplate.tsx
│   ├── QuoteTemplate.tsx
│   ├── StatsTemplate.tsx
│   ├── CodeTemplate.tsx
│   ├── ListTemplate.tsx
│   └── TransitionTemplate.tsx
├── components/
│   ├── Subtitle.tsx          ← 자막 컴포넌트
│   ├── Background.tsx        ← 배경 (테마 기반)
│   └── ProgressBar.tsx       ← 진행 표시 (선택)
├── theme/
│   └── ThemeProvider.tsx     ← 프로파일 → 테마 변환
└── utils/
    └── timeline.ts           ← 씬 → 프레임 변환
```

---

## 4단계: TTS (Qwen3)

### 입력
- 씬별 나레이션 텍스트

### 처리
1. 씬별로 Qwen3 TTS 호출
2. 음성 파일 생성 (wav)
3. 실제 음성 길이 측정
4. scenes.json의 duration을 실제 음성 길이로 보정

### 출력
- `output/{content-id}/audio/scene-{nn}.wav`
- 보정된 `scenes-timed.json`

---

## 5단계: 합성

### 입력
- 보정된 `scenes-timed.json`
- 음성 파일들
- Remotion 프로젝트

### 처리
1. 음성 파일을 Remotion 타임라인에 배치
2. `npx remotion render` 실행
3. 최종 mp4 출력

### 출력
- `output/{content-id}/final.mp4`
- `output/{content-id}/metadata.json` (러닝타임, 씬 수, 생성일시)
