/**
 * Component & Layout Normalization Rules
 *
 * 디자인 피드백에서 도출된 규칙. 모든 슬라이드/샘플 제작 시 반드시 준수.
 * 위반 시 시각적 일관성이 깨지거나 가독성이 떨어진다.
 */

// ─── 1. 뱃지/태그 일관성 규칙 ─────────────────────────

export const badgeRules = {
  description: '뱃지(neo-badge)는 슬라이드 전체에서 동일한 스타일을 유지한다.',
  rules: [
    'color는 반드시 text-primary(#1a1a1a)로 고정. 부모 색상을 상속하지 않는다.',
    'border는 스타일 토큰의 border 색상과 동일해야 한다 (네오브루탈: 3px solid #1a1a1a).',
    'box-shadow도 border와 동일한 색상을 사용한다.',
    'opacity는 항상 1. decorative.marker의 opacity(0.7)는 뱃지가 아닌 텍스트-only 마커에만 적용.',
    'font-weight는 항상 800. 뱃지는 눈에 띄어야 하는 UI 요소.',
    'background만 슬라이드마다 다를 수 있다 (accent-1, accent-2, accent-3 등).',
  ],
  antiPattern: '뱃지마다 border/shadow/text 색상이 다른 것 → 스타일 일관성 파괴',
} as const;

// ─── 2. 컨테이너 유동성 규칙 ──────────────────────────

export const containerRules = {
  description: '컨테이너(카드, 코드블록, 비교 컬럼)는 콘텐츠에 맞게 크기가 조절된다.',
  rules: [
    'max-height를 고정값으로 설정하지 않는다. 콘텐츠가 잘리거나 과도한 여백이 생긴다.',
    'flex: 1로 남은 공간을 채우지 않는다. 컨테이너는 콘텐츠만큼만 차지한다.',
    'align-items: stretch로 자식 높이를 맞추되, 부모에 고정 높이를 주지 않는다.',
    'overflow: hidden + word-break: keep-all로 텍스트 넘침을 방지한다.',
    'padding은 충분히 (보더 두께의 6~8배). 텍스트가 보더에 붙지 않도록.',
  ],
  antiPattern: 'max-height: 65% → 텍스트가 잘리거나, 짧은 콘텐츠에 빈 공간 과다',
} as const;

// ─── 3. 컬러 배경 위 가독성 규칙 ──────────────────────

export const colorContrastRules = {
  description: '유색 배경(accent 컬러) 위의 텍스트는 반드시 가독성을 확보한다.',
  rules: [
    '밝은 배경(accent-3 옐로우, accent-5 민트) 위 텍스트: text-primary(#1a1a1a) 사용.',
    '채도 높은 배경(accent-1 오렌지, accent-4 핑크) 위 텍스트: text-primary + opacity 최소 0.7.',
    'text-muted(#8a8a8a)는 유색 배경 위에서 사용하지 않는다. 대비가 부족하다.',
    '서브텍스트가 유색 배경 위에 있으면: color를 text-primary로 하되 weight 500 + opacity 0.7로 차별화.',
    '배경색을 바꿀 때마다 위의 텍스트 대비를 확인한다.',
  ],
  antiPattern: '핑크 배경(#FF6B8A) 위에 text-muted(#8a8a8a) → 거의 안 보임',
} as const;

// ─── 4. 코드 블록 규칙 ────────────────────────────────

export const codeBlockRules = {
  description: '코드 블록 내부 텍스트는 decorative.code이지만 "읽힐 필요가 있는 장식"이다.',
  rules: [
    'font-size: 최소 0.7vw (1920px 기준 ~13px). 이보다 작으면 내용 파악 불가.',
    'line-height: 1.9~2.0. 코드는 줄 간격이 넓어야 스캔이 된다.',
    'padding: 블록 내부 최소 1.4vw. 코드가 보더에 붙으면 답답하다.',
    'bad/good 코드 블록의 배경색은 스타일 팔레트가 아닌 의미적 색상 사용 (red 계열 / green 계열).',
    '단, bad/good 블록의 border와 shadow는 스타일 토큰과 동일해야 한다 (일관성).',
  ],
  antiPattern: '코드 텍스트 0.55vw(~10px) → 내용을 읽을 수 없음',
} as const;

// ─── 5. 줄바꿈 규칙 ──────────────────────────────────

export const lineBreakRules = {
  description: '텍스트 줄바꿈은 의도적이어야 한다.',
  rules: [
    '한 줄로 충분한 문장은 white-space: nowrap으로 줄바꿈을 방지한다.',
    '컨테이너 width가 좁아서 억지로 줄이 바뀌면: 컨테이너를 넓힌다 (텍스트가 아니라 컨테이너를 고친다).',
    '한글 word-break: keep-all 기본 적용. 단어 중간에서 끊기지 않도록.',
    '헤드라인 줄바꿈: 의미 단위로 <br>을 명시적으로 넣는다. 자동 줄바꿈에 맡기지 않는다.',
    '캡션/서브텍스트: 1줄이 기본. 2줄 이상이면 문장을 줄인다.',
  ],
  antiPattern: 'width: 55%로 좁혀서 서브텍스트가 2줄로 찢어짐',
} as const;

// ─── 6. 스타일 간 일관성 규칙 ─────────────────────────

export const styleConsistencyRules = {
  description: '한 슬라이드셋 내에서 스타일 토큰은 모든 슬라이드에 동일하게 적용된다.',
  rules: [
    'border 두께/색상/스타일은 모든 컴포넌트에 동일. 카드, 뱃지, 코드블록 모두.',
    'box-shadow 패턴(offset, blur, color)은 모든 컴포넌트에 동일.',
    'border-radius는 모든 컴포넌트에 동일한 토큰 사용.',
    'accent 컬러를 컴포넌트 배경으로 사용할 때, border/shadow는 변하지 않는다.',
    '특정 슬라이드에서만 다른 border나 shadow를 쓰면 → 전체 일관성 파괴.',
  ],
  antiPattern: '06-CODE 뱃지만 border가 회색, 나머지는 검정 → 같은 세트인지 의심됨',
} as const;

// ─── 7. 수직 배치 규칙 ────────────────────────────────

export const verticalPlacementRules = {
  description: '콘텐츠는 슬라이드의 광학적 중앙에 위치한다.',
  rules: [
    'justify-content: center를 기본으로 한다.',
    'padding-bottom: 2%를 추가하여 광학적 중앙 보정 (수학적 중앙보다 약간 위).',
    'padding-top으로 콘텐츠를 밀어내리지 않는다 (18%, 22% 등 → 아래로 쏠림).',
    '콘텐츠가 슬라이드 높이의 60%를 초과하면 요소를 줄인다 (텍스트 축소가 아니라 요소 수를 줄인다).',
    '상단 여백과 하단 여백이 체감상 비슷해야 한다.',
  ],
  antiPattern: 'padding-top: 22% → 콘텐츠가 아래 1/3에 몰림',
} as const;

// ─── 전체 체크리스트 ──────────────────────────────────

export const preDeliveryChecklist = [
  // 뱃지
  '모든 뱃지의 color/border/shadow 색상이 동일한가?',
  '뱃지 opacity가 1인가? (0.7이면 마커와 혼동)',
  // 컨테이너
  '컨테이너에 max-height 고정값이 있는가? → 제거',
  '컨테이너에 flex: 1이 있는가? → 콘텐츠 기반으로 변경',
  '텍스트가 컨테이너 밖으로 넘치지 않는가?',
  // 가독성
  '유색 배경 위 텍스트가 text-muted를 사용하고 있지 않은가?',
  '코드 블록 텍스트가 0.7vw 이상인가?',
  // 줄바꿈
  '서브텍스트/캡션이 불필요하게 2줄인가? → 컨테이너 확대 또는 nowrap',
  '한글에 word-break: keep-all이 적용되어 있는가?',
  // 일관성
  'border/shadow/radius가 모든 컴포넌트에 동일한 토큰을 사용하는가?',
  // 수직 배치
  '콘텐츠가 슬라이드 아래쪽으로 쏠려 있지 않은가?',
  '콘텐츠 영역이 슬라이드의 60% 이내인가?',
  // 헤드라인 스케일
  '슬라이드 유형별 헤드라인 크기가 다른가? (title > section > detail)',
  // 비교 무게
  'Before/After 비교에서 시각적 무게 차이가 명확한가? (Before 약하고 After 강한가?)',
  // 패턴 정체성
  '선택한 레이아웃 패턴의 핵심 특성이 시각적으로 드러나는가?',
  // 콘텐츠 상한선
  '스타일에 맞는 콘텐츠 영역 비율을 지키고 있는가? (Exaggerated≤35%, Standard≤50%, Bold≤60%)',
] as const;

// ─── 8. 슬라이드 유형별 헤드라인 스케일 ──────────────

export const headlineScaleRules = {
  description: '슬라이드 유형에 따라 헤드라인 크기가 달라야 한다. 모든 슬라이드가 같은 크기면 위계가 없다.',
  scale: {
    title: { fontSize: '3.5vw', role: '영상 제목. 가장 큰 텍스트.' },
    section: { fontSize: '2.2vw', role: '섹션 제목 (문제, 인용, 리스트 등). 표준 크기.' },
    detail: { fontSize: '1.6vw', role: '코드, 비교 등 콘텐츠가 주인공인 슬라이드. 헤드라인은 작게.' },
  },
  rules: [
    'title 슬라이드(01, 07)는 가장 큰 헤드라인을 사용한다.',
    'section 슬라이드(02, 03, 05)는 표준 크기를 사용한다.',
    'detail 슬라이드(04, 06)는 작은 헤드라인을 사용하여 콘텐츠에 주목하게 한다.',
    '같은 세트 내에서 최소 2단계 이상의 헤드라인 크기가 존재해야 한다.',
  ],
  antiPattern: '7슬라이드 모두 2.2vw → 어떤 슬라이드가 중요한지 구분 불가',
} as const;

// ─── 9. 비교 슬라이드 무게 차별화 ────────────────────

export const comparisonWeightRules = {
  description: 'Before/After, Bad/Good 비교에서 시각적 무게 차이가 명확해야 한다.',
  rules: [
    'Before/Bad 측: opacity 0.4~0.6, color text-muted, 배경 없음 또는 연한 회색.',
    'After/Good 측: opacity 1.0, color text-primary, accent 컬러 요소 포함.',
    '무게 비율: Before 30% / After 70%. 동등하면 비교 효과 없음.',
    '화살표/흐름 표시자: After 측에만 accent 컬러 적용.',
    'Before 텍스트는 weight 400, After 텍스트는 weight 600~700으로 차별화.',
  ],
  antiPattern: 'Before와 After가 같은 크기, 같은 색, 같은 weight → 비교가 아니라 나열',
} as const;

// ─── 10. 패턴 정체성 검증 ─────────────────────────────

export const patternIdentityRules = {
  description: '레이아웃 패턴을 선택했으면, 그 패턴의 핵심 특성이 시각적으로 드러나야 한다.',
  identityChecklist: {
    'magazine-editorial': '비대칭 타이포 배치, 드라마틱한 크기 대비, 에디토리얼 여백. 단순 좌정렬이면 위반.',
    'quote-spotlight': '80%+ 여백, 인용문 외 요소 최소화. 여백이 주인공.',
    'feature-callout': '주인공 카드와 보조 카드의 크기 차이 최소 2배.',
    'alternating-zigzag': '좌→우, 우→좌 교차가 명확하게 보여야 함. 수평 이동 없이 같은 위치면 위반.',
    'asymmetric-8-4': '큰 영역과 작은 영역의 존재감 차이가 확실해야 함.',
    'staggered-rows': '행마다 수평 위치가 다르게 엇갈려야 함. 같은 위치면 그냥 stacked.',
    'full-bleed': '배경색이 전체를 채워서 다른 슬라이드와 확실한 전환 느낌.',
    'bento-grid': '카드 크기가 최소 2가지 이상 혼합. 모두 같은 크기면 그냥 grid.',
  },
  rules: [
    '패턴 이름만 HTML 주석에 있고 시각적으로 구분 안 되면 → 위반.',
    '해당 패턴을 처음 보는 사람이 "이건 XX 패턴이구나"라고 알 수 있어야 한다.',
  ],
  antiPattern: 'magazine-editorial이라고 주석 달았는데 실제로는 좌정렬 center-stage',
} as const;

// ─── 11. 콘텐츠 영역 상한선 ──────────────────────────

export const contentAreaRules = {
  description: '스타일에 따라 콘텐츠가 차지하는 면적의 상한선이 다르다.',
  limits: {
    'exaggerated-minimalism': { maxPercent: 35, minWhitespace: 65 },
    'minimalism': { maxPercent: 50, minWhitespace: 50 },
    'glassmorphism': { maxPercent: 55, minWhitespace: 45 },
    'neobrutalism': { maxPercent: 60, minWhitespace: 40 },
    'memphis': { maxPercent: 60, minWhitespace: 40 },
    'bento-grid': { maxPercent: 75, minWhitespace: 25 },
    'dashboard': { maxPercent: 80, minWhitespace: 20 },
  },
  rules: [
    'Exaggerated Minimalism에서 콘텐츠가 35%를 초과하면 "exaggerated"가 아니다.',
    '여백이 부족하면 요소 수를 줄인다 (텍스트 크기를 줄이는 게 아니라).',
    '콘텐츠 영역 = 텍스트 + 카드 + 장식 등 비여백 요소의 바운딩 박스.',
  ],
  antiPattern: 'Exaggerated Minimalism인데 콘텐츠가 60% → 그냥 평범한 미니멀',
} as const;

// ─── 12. 배경 장식 금지 ──────────────────────────────

export const noDecorationRules = {
  description: '슬라이드 배경에 도형(삼각형, 원, 물결, 점 패턴 등) 장식을 넣지 않는다.',
  rules: [
    '배경 장식(geometric shapes, dots, squiggles)은 어떤 스타일에서도 사용하지 않는다.',
    '장식이 필요한 역할은 컴포넌트(카드, 뱃지, 디바이더)가 대신한다.',
    '배경은 단색 또는 미세한 그라데이션만 허용한다.',
    '시각적 풍성함은 장식이 아니라 타이포그래피 계층과 레이아웃 구성으로 만든다.',
    'CSS에서 ::before, ::after로 도형을 추가하는 패턴도 금지.',
  ],
  antiPattern: '삼각형, 원, 물결, 점 패턴 등을 opacity 낮게 넣어 "있는 듯 없는 듯" 처리 → 불필요한 시각 노이즈',
} as const;

// ─── 13. 서비스/도구 소개 시 로고 필수 ───────────────

export const serviceLogoRules = {
  description: '서비스나 도구를 소개할 때 반드시 해당 서비스의 로고 또는 앱 아이콘을 함께 표시한다.',
  rules: [
    'SVG, PNG, 또는 3D 아이콘 형태로 포함한다.',
    '로고는 Simple Icons(simpleicons.org) 또는 공식 브랜드 페이지에서 가져온다.',
    '로고 크기는 해당 카드/영역의 15~25% 비율.',
    '로고를 추측하여 그리지 않는다. 공식 리소스를 사용하거나, 텍스트 로고로 대체한다.',
    '로고가 없는 서비스는 서비스명을 모노스페이스 굵은 텍스트로 대체.',
  ],
  antiPattern: '서비스명만 텍스트로 적고 로고 없음 → 무슨 서비스인지 시각적으로 인식 불가',
} as const;
