/**
 * 타이포그래피 + 여백 시스템
 * 모든 씬에서 이 토큰만 사용. 임의 값 사용 금지.
 */

// ─── 폰트 크기 스케일 ───────────────────────────────
export const FONT = {
  display: { min: 96, max: 160 },   // 후킹 숫자, 임팩트 한 단어
  h1:      { min: 52, max: 64 },    // 씬 제목
  h2:      { min: 36, max: 44 },    // 섹션 제목, 카드 헤더
  h3:      { min: 28, max: 32 },    // 소제목
  body:    { min: 20, max: 24 },    // 본문 설명
  caption: { min: 14, max: 18 },    // 라벨, 태그, 부가 정보
  micro:   { min: 12, max: 13 },    // 타임스탬프, 출처
} as const;

// ─── 자간 (letterSpacing) ───────────────────────────
export const TRACKING = {
  /** 한글 헤드라인 48px+ */
  koreanHeadline: '-0.03em',
  /** 한글 본문 20-32px (기본) */
  koreanBody: '-0.02em',
  /** 한글 캡션 13-18px (좁히면 뭉침) */
  koreanCaption: '0em',
  /** 영문 디스플레이 48px+ */
  englishDisplay: '-0.04em',
  /** 영문 본문 20-32px */
  englishBody: '-0.02em',
  /** 라벨/태그 UPPERCASE 전용 */
  label: '0.08em',
  /** 코드 (모노스페이스 — 건드리지 않음) */
  code: '0em',
} as const;

// ─── 행간 (lineHeight) ─────────────────────────────
export const LEADING = {
  /** 숫자 단독 (CountUp, 통계) */
  number: 1.0,
  /** 헤드라인 1줄 */
  headlineSingle: 1.1,
  /** 헤드라인 2줄 (한글은 1.1이면 잘림) */
  headlineMulti: 1.2,
  /** 본문/설명 (기본값) */
  body: 1.4,
  /** 긴 텍스트 3줄 이상 */
  long: 1.6,
} as const;

// ─── 여백 토큰 ──────────────────────────────────────
export const SPACE = {
  /** 8px — 라벨↔제목, 인라인 요소 간 */
  xs: 8,
  /** 12px — 아이콘↔텍스트 */
  sm: 12,
  /** 16px — 제목↔본문, 리스트 항목 간 */
  md: 16,
  /** 24px — 카드 간, 구분선 전후, gutter */
  lg: 24,
  /** 32px — 씬 제목↔콘텐츠, 카드 내부 상하 */
  xl: 32,
  /** 40px — 레이아웃 슬롯 내부 padding */
  '2xl': 40,
  /** 48px — 섹션 그룹 간 */
  '3xl': 48,
  /** 60px — FullBleed 오버레이 padding */
  '4xl': 60,
} as const;

// ─── 카드 내부 여백 ─────────────────────────────────
export const CARD_PADDING = {
  /** 기본 카드: 상하 32, 좌우 36 */
  default: { vertical: 32, horizontal: 36 },
  /** 소형 카드: 상하 24, 좌우 28 */
  small: { vertical: 24, horizontal: 28 },
  /** 미니 Chip: 상하 8, 좌우 16 */
  chip: { vertical: 8, horizontal: 16 },
} as const;

// ─── 텍스트 블록 간 간격 ────────────────────────────
export const TEXT_GAP = {
  /** 라벨 → 제목 (밀접 관계) */
  labelToTitle: 8,
  /** 제목 → 본문 (논리적 연결) */
  titleToBody: 16,
  /** 본문 → 구분선 (섹션 전환) */
  bodyToDivider: 24,
  /** 구분선 → 수치/CTA */
  dividerToContent: 24,
  /** 아이콘 → 텍스트 (인라인) */
  iconToText: 12,
  /** 씬 제목 → 콘텐츠 */
  sceneTitleToContent: 32,
} as const;

// ─── 들여쓰기 ───────────────────────────────────────
export const INDENT = {
  /** 일반 단락 — 들여쓰기 없음 */
  paragraph: 0,
  /** 리스트/불릿 */
  list: 32,
  /** 중첩 리스트 추가분 (per level) */
  listNested: 32,
  /** 코드 블록 (좌측 accent 라인 2px 포함) */
  codeBlock: 24,
  /** 인용구 (좌측 accent 라인 3px 포함) */
  quote: 40,
} as const;

// ─── 인용구 스타일 ──────────────────────────────────
export const QUOTE_STYLE = {
  /** 좌측 라인 */
  line: {
    width: 3,
    color: 'rgba(255,197,5,0.6)',
    borderRadius: 2,
  },
  /** 인용 텍스트: h3 크기, italic */
  text: {
    fontSize: FONT.h3,
    fontStyle: 'italic' as const,
    lineHeight: LEADING.body,
  },
  /** 출처: caption 크기, textDim */
  source: {
    fontSize: FONT.caption,
    marginTop: SPACE.md,
  },
} as const;
