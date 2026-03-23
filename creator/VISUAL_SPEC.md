# Visual Style Guide — Creator Agent Remotion
> 참조 영상: "AI로 만든 웹사이트, 3초면 티납니다" 스타일 기반
> 버전: 1.0 | 작성일: 2026-03-21

---

## 1. 디자인 시스템

### 컬러 스킴
```typescript
export const VISUAL_THEME = {
  // 배경
  bg:          '#0a0a0a',       // Deep Black
  bgSecondary: '#111111',       // 카드/패널 배경
  bgTertiary:  '#1a1a1a',       // 내부 요소

  // 포인트 컬러
  accent:      '#00ff88',       // Neon Green (메인 포인트)
  accentDim:   '#00cc66',       // 눌린 상태
  accentGlow:  'rgba(0,255,136,0.15)', // 글로우 효과

  // 텍스트
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted:   '#555555',

  // 상태 컬러
  danger:      '#ff4444',       // 경고/금지 (X 표시)
  success:     '#00ff88',       // 성공/체크
  warning:     '#ffaa00',       // 주의

  // 그라디언트
  gradientPurple: 'linear-gradient(135deg, #6b21a8, #a855f7)', // 카드 배경
  gradientGreen:  'linear-gradient(135deg, #00ff88, #00cc66)',
};
```

### 타이포그래피
```typescript
export const TYPOGRAPHY = {
  // 1920x1080 기준
  display:  { size: 80, weight: 900, letterSpacing: '-0.04em' },
  headline: { size: 56, weight: 800, letterSpacing: '-0.03em' },
  title:    { size: 40, weight: 700, letterSpacing: '-0.02em' },
  body:     { size: 24, weight: 400, lineHeight: 1.6 },
  caption:  { size: 18, weight: 400, color: '#aaaaaa' },
  label:    { size: 16, weight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
};
```

---

## 2. 핵심 애니메이션 컴포넌트

### 2.1 FlowChart (플로우차트 — 선 드로잉)

영상 참조: "AI 복사 메커니즘" 장면
노드들이 선으로 연결되며 빛이 흐르듯 순차적으로 생성

```typescript
// src/animations/FlowChart.tsx
interface FlowChartNode {
  id:       string;
  label:    string;
  sublabel?: string;
  x:        number;   // 0~100 (%)
  y:        number;   // 0~100 (%)
  color:    'accent' | 'purple' | 'neutral';
}

interface FlowChartEdge {
  from:     string;
  to:       string;
  label?:   string;
  animated: boolean;  // 빛 흐름 효과
}

// 애니메이션 타이밍
const T = {
  node1Appear:  0,
  edge1Draw:    10,
  node2Appear:  20,
  edge2Draw:    30,
  // ... 순차적
  lightFlow:    60,   // 모든 노드 등장 후 빛 흐름 시작
};

// 핵심 효과: SVG path stroke-dashoffset으로 선 드로잉
// 선 위에 빛나는 점이 애니메이션으로 이동
```

### 2.2 BarChart (막대 그래프 — 길이 애니메이션)

영상 참조: "예전 vs 지금" 속도 대비
막대가 왼쪽에서 오른쪽으로 차오르는 애니메이션

```typescript
// src/animations/BarChart.tsx
interface BarItem {
  label:    string;
  value:    number;       // 0~100
  color:    string;
  sublabel?: string;      // "몇 달~몇 년", "일주일"
}

// 핵심 효과
// 1. 막대가 duration 기반으로 채워짐
// 2. 값이 다를 때 시각적 대비가 극적으로 표현됨
// 3. 레이블이 막대 끝에서 팝업
const barFill = interpolate(frame, [startFrame, startFrame + 30], [0, targetValue], {
  easing: Easing.out(Easing.cubic),
  extrapolateRight: 'clamp',
});
```

### 2.3 BubbleSpeech (말풍선 팝업)

영상 참조: 로봇 아이콘 위 "웹사이트 만들어줘" 말풍선

```typescript
// src/animations/BubbleSpeech.tsx
interface BubbleSpeechProps {
  text:       string;
  position:   'top' | 'bottom' | 'left' | 'right';
  tailTarget: { x: number; y: number };  // 말풍선 꼬리 방향
}

// 핵심 효과
// scale: 0 → 1.1 → 1.0 (bounce pop)
const scale = interpolate(frame, [0, 8, 12], [0, 1.1, 1.0], {
  easing: Easing.out(Easing.back(2)),
  extrapolateRight: 'clamp',
});
```

### 2.4 MockupBrowser (UI 모형)

영상 참조: 웹사이트 잘못된 패턴을 브라우저 창으로 보여주는 장면

```typescript
// src/animations/MockupBrowser.tsx
interface MockupBrowserProps {
  url:        string;         // 가짜 URL 표시
  children:   ReactNode;      // 내부 콘텐츠
  highlight?: HighlightArea;  // 빨간/초록 강조 영역
  warning?:   string;         // 경고 텍스트
  entrance:   'slideUp' | 'fadeIn' | 'popIn';
}

// 브라우저 프레임 구조
// - 상단 주소바 (회색 배경, 가짜 URL)
// - 3개 점 (빨/노/초 → 모두 gray로 스타일링)
// - 내부 콘텐츠 영역
// - 강조 영역은 반투명 overlay로 표현
```

### 2.5 CheckList (체크리스트 순차 등장)

영상 참조: "첫 화면 필수 4가지" 체크리스트

```typescript
// src/animations/CheckList.tsx
interface CheckItem {
  text:     string;
  checked:  boolean;
  delay:    number;   // 각 항목 등장 딜레이 (frames)
}

// 핵심 효과
// 1. 항목이 왼쪽에서 슬라이드인
// 2. 체크 아이콘이 circle → checkmark로 드로잉
// 3. 체크된 항목: 녹색 강조 / 미체크: 빨간 X
```

### 2.6 XMark / CheckMark (강조 마킹)

영상 참조: "특별함 ⓧ", "독창성 ⓧ" 엑스 표시

```typescript
// src/animations/Markers.tsx

// X 마크: 빨간색, 회전하며 등장
const XMark = ({ frame, startFrame }) => {
  const scale = popIn(frame, startFrame);
  const rotation = interpolate(frame, [startFrame, startFrame + 8], [-20, 0], {
    extrapolateRight: 'clamp'
  });
  return (
    <div style={{
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      color: '#ff4444',
      fontSize: 48,
      fontWeight: 900,
    }}>✕</div>
  );
};

// 체크 마크: 녹색, SVG stroke 드로잉
const CheckMark = ({ frame, startFrame }) => {
  const drawProgress = drawLine(frame, startFrame, 20);
  // SVG path stroke-dashoffset 애니메이션
};
```

### 2.7 TextBlink (텍스트 순차 깜빡임)

영상 참조: "살리고, 빼고, 고치고" 순차 깜빡임

```typescript
// src/animations/TextBlink.tsx
interface TextBlinkProps {
  items:    string[];
  interval: number;   // 각 항목 표시 간격 (frames)
  mode:     'sequential' | 'highlight'; // 순차 or 강조
}

// 핵심 효과
// sequential: 한 번에 하나씩 나타났다가 다음으로
// highlight: 모두 표시 후 하나씩 강조
const activeIndex = Math.floor(frame / interval) % items.length;
```

### 2.8 ComparePanel (좌우 비교)

영상 참조: "내 의도" vs "실제 사이트" 좌우 비교

```typescript
// src/animations/ComparePanel.tsx
interface ComparePanelProps {
  left:   { label: string; content: ReactNode; color: 'good' | 'bad' };
  right:  { label: string; content: ReactNode; color: 'good' | 'bad' };
  dividerAnimated: boolean;  // 가운데 구분선 드로잉
}

// 핵심 효과
// 1. 구분선이 위에서 아래로 드로잉
// 2. 좌우 패널이 각각 슬라이드인
// 3. good: 녹색 테두리, bad: 빨간 테두리
```

### 2.9 CardGrid (카드 그리드 솟아오르기)

영상 참조: 보라색 그라디언트 웹사이트 카드들이 그리드로 솟아오름

```typescript
// src/animations/CardGrid.tsx
interface GridCard {
  title:    string;
  subtitle?: string;
  badge?:   string;   // 카드 하단 레이블
  gradient: string;   // 카드 배경 그라디언트
}

// 핵심 효과: stagger로 아래에서 위로 순차 등장
const cardY = staggerIn(frame, index, startFrame, 6);  // stagger 6 frames
```

---

## 3. 레이아웃 30종 — 비주얼 스타일 업데이트

영상 묘사를 반영한 각 레이아웃의 구체적인 비주얼 지침.

### concept → FlowChart 통합

```
기존: orbit 다이어그램 (원형 배치)
업데이트: FlowChart (선형 플로우) 또는 orbit 선택 가능

diagram.type: 'orbit' | 'flow' | 'tree'

flow 선택 시:
- 노드 → 선 드로잉 → 노드 순차 등장
- 선 위 빛 흐름 효과 (accent 컬러)
- 각 노드 pop-in 애니메이션
```

### stats-grid → BarChart 통합

```
기존: CountUp 숫자만
업데이트: 막대 그래프 + 숫자 동시 애니메이션

stats.style: 'number' | 'bar' | 'bar+number'

bar 선택 시:
- 막대가 왼→오른 채워짐 (duration 30frames)
- 비교 항목은 대비가 극적으로 표현
- 레이블이 막대 끝에서 팝업
```

### example → MockupBrowser 통합

```
기존: 일반 카드
업데이트: 브라우저 프레임 안에 콘텐츠 표시

content.mockup: true 설정 시
- 브라우저 주소바 + 3점 표시
- 내부 콘텐츠 슬라이드인
- 강조 영역 overlay 표시 가능
```

### comparison → ComparePanel 통합

```
기존: 단순 좌우 텍스트
업데이트: 구분선 드로잉 + 좌우 패널 슬라이드인

- 가운데 수직선 위→아래 드로잉
- 좌: 슬라이드 왼쪽에서
- 우: 슬라이드 오른쪽에서
- good/bad 컬러 테두리
```

---

## 4. slides.json 추가 필드

영상 스타일 반영을 위한 새 필드.

```json
{
  "meta": {
    "visualStyle": "dark-neon",  // 이 영상 스타일 고정값
    "theme": {
      "bg":      "#0a0a0a",
      "accent":  "#00ff88",
      "accent2": "#a855f7",
      "accent3": "#ff4444"
    }
  },
  "slides": [
    {
      "content": {
        "diagram": {
          "type": "flow",          // orbit | flow | tree
          "lightFlow": true        // 빛 흐름 효과
        },
        "stats": {
          "style": "bar",          // number | bar | bar+number
          "compareMode": true      // 대비 강조 모드
        },
        "mockup": {
          "enabled": false,
          "url": "example.com",
          "highlight": null,
          "warning": null
        },
        "markers": [               // X/체크 마킹
          { "text": "특별함", "type": "x" },
          { "text": "독창성", "type": "x" }
        ],
        "checklist": [             // 체크리스트
          { "text": "뭘 하는 곳인지", "checked": true },
          { "text": "누구를 위한 건지", "checked": true }
        ],
        "textBlink": {             // 순차 깜빡임
          "items": ["살리고", "빼고", "고치고"],
          "mode": "sequential"
        }
      }
    }
  ]
}
```