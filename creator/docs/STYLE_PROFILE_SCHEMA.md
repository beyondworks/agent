# 스타일 프로파일 JSON 스키마

## 개요
크리에이터 1명당 1개의 프로파일을 생성하며, 대본 생성과 영상 테마에 모두 사용된다.

## 스키마

```typescript
interface StyleProfile {
  meta: {
    creatorId: string;        // "tech-youtuber-a"
    creatorName: string;      // 표시명
    sourceUrls: string[];     // 분석에 사용한 URL
    analyzedAt: string;       // ISO 8601
    sampleCount: number;      // 분석한 영상/포스트 수
  };

  voice: {
    formality: 'formal' | 'casual' | 'mixed';  // 존댓말/반말/혼용
    endings: string[];          // 자주 쓰는 문장 종결어 ["~입니다", "~거든요", "~잖아요"]
    fillers: string[];          // 말버릇/추임새 ["자,", "근데", "사실은"]
    catchphrases: string[];     // 특징적 표현 ["결론부터 말씀드리면", "이게 핵심이에요"]
    humor: 'none' | 'subtle' | 'frequent';
    energy: 'calm' | 'moderate' | 'high';
    sentenceLength: 'short' | 'medium' | 'long';  // 평균 문장 길이
  };

  structure: {
    openingPattern: string;     // 도입 패턴 설명 ("질문으로 시작 → 문제 제기 → 해결 예고")
    bodyPattern: string;        // 본문 전개 ("개념 → 사례 → 비교 → 정리" 등)
    closingPattern: string;     // 마무리 패턴 ("핵심 3줄 요약 → CTA")
    usesAnalogy: boolean;       // 비유 사용 여부
    analogyStyle?: string;      // 비유 스타일 ("일상생활", "게임", "요리" 등)
    exampleDensity: 'low' | 'medium' | 'high';  // 예시 사용 빈도
  };

  visual: {
    colorPalette: {
      primary: string;          // hex "#1a1a2e"
      secondary: string;
      accent: string;
      background: string;
      text: string;
      subtitleBg?: string;      // 자막 배경색
    };
    fontStyle: 'sans' | 'serif' | 'mono' | 'display';
    layout: 'minimal' | 'balanced' | 'rich';  // 시각 요소 밀도
    darkMode: boolean;
  };

  content: {
    targetAudience: string;     // "코딩 입문자", "마케팅 실무자" 등
    domain: string;             // "테크", "마케팅", "자기계발" 등
    depthLevel: 'intro' | 'intermediate' | 'advanced';
    ctaStyle?: string;          // CTA 패턴 ("구독/좋아요", "댓글로 의견", "링크 확인")
  };
}
```

## 예시

```json
{
  "meta": {
    "creatorId": "example-tech",
    "creatorName": "예시 테크 크리에이터",
    "sourceUrls": ["https://youtube.com/watch?v=xxx"],
    "analyzedAt": "2026-03-18T00:00:00Z",
    "sampleCount": 3
  },
  "voice": {
    "formality": "mixed",
    "endings": ["~거든요", "~입니다", "~해보세요"],
    "fillers": ["자,", "근데 사실", "여기서 중요한 건"],
    "catchphrases": ["이게 진짜 핵심이에요", "한 번 볼게요"],
    "humor": "subtle",
    "energy": "moderate",
    "sentenceLength": "medium"
  },
  "structure": {
    "openingPattern": "충격적 사실/질문 → 왜 중요한지 → 이번 영상에서 다룰 내용",
    "bodyPattern": "개념 설명 → 실제 화면 시연 → Before/After 비교",
    "closingPattern": "핵심 3줄 요약 → 다음 영상 예고 → 구독 CTA",
    "usesAnalogy": true,
    "analogyStyle": "일상생활 + 게임",
    "exampleDensity": "high"
  },
  "visual": {
    "colorPalette": {
      "primary": "#0f172a",
      "secondary": "#1e293b",
      "accent": "#3b82f6",
      "background": "#020617",
      "text": "#f8fafc",
      "subtitleBg": "#000000cc"
    },
    "fontStyle": "sans",
    "layout": "balanced",
    "darkMode": true
  },
  "content": {
    "targetAudience": "코딩 입문자",
    "domain": "테크",
    "depthLevel": "intro",
    "ctaStyle": "구독 + 댓글로 질문"
  }
}
```
