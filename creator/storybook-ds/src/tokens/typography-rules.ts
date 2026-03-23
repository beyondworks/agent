/**
 * Typography Role System
 *
 * 모든 텍스트를 2가지 카테고리 × 6단계 계층으로 분류.
 * "이 텍스트는 읽으라고 있는 건가, 보라고 있는 건가?"를 먼저 결정한다.
 */

// ─── 텍스트 카테고리 ─────────────────────────────────
//
// READABLE (워딩 역할) — 시청자가 읽고 이해해야 하는 텍스트
//   → 가독성 최우선. 충분한 크기, 적절한 행간, 명확한 대비
//
// DECORATIVE (디자인 요소) — 분위기/구조를 시각적으로 전달하는 텍스트
//   → 안 읽혀도 됨. 작아도 됨. 흐려도 됨. "있다"는 것 자체가 역할
//

export type TextCategory = 'readable' | 'decorative';

// ─── 텍스트 계층 (READABLE) ──────────────────────────
//
// 시청자가 슬라이드를 봤을 때 읽는 순서:
// 1. 헤드라인 → 2. 서브 헤드라인 → 3. 본문 → 4. 캡션
//
// 50/30/15/5 주의 배분 규칙 적용

export const readable = {
  headline: {
    role: '슬라이드의 핵심 메시지. 3초 안에 전달되어야 한다.',
    attention: '50%',
    fontSize: '2.2vw',      // ~42px at 1920
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    font: 'var(--font-heading)',
    maxChars: 20,            // 한 줄 최대 글자 수 (한글 기준)
    maxLines: 2,
  },
  subheadline: {
    role: '헤드라인을 보충하는 한 줄. 헤드라인 없이는 존재하지 않는다.',
    attention: '30%',
    fontSize: '1.1vw',      // ~21px at 1920
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: '0',
    color: 'var(--text-secondary)',
    font: 'var(--font-body)',
    maxChars: 35,
    maxLines: 2,
  },
  body: {
    role: '설명, 리스트 항목, 카드 내부 텍스트. 읽기 편해야 한다.',
    attention: '15%',
    fontSize: '0.85vw',     // ~16px at 1920
    fontWeight: 400,
    lineHeight: 1.75,
    letterSpacing: '0',
    color: 'var(--text-secondary)',
    font: 'var(--font-body)',
    maxChars: 45,
    maxLines: 3,
  },
  caption: {
    role: '출처, 부연, 주석. 없어도 메시지 전달에 지장 없다.',
    attention: '5%',
    fontSize: '0.65vw',     // ~12px at 1920
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.02em',
    color: 'var(--text-muted)',
    font: 'var(--font-body)',
    maxChars: 50,
    maxLines: 1,
  },
} as const;

// ─── 텍스트 계층 (DECORATIVE) ────────────────────────
//
// 읽는 용도가 아닌 텍스트. 시각적 장치로만 존재한다.
// 가독성이 아니라 분위기를 전달한다.

export const decorative = {
  marker: {
    role: '섹션 태그, 뱃지. "이 영역이 무엇인지" 시각적 힌트.',
    fontSize: '0.52vw',     // ~10px at 1920
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'var(--accent-color, var(--text-muted))',
    font: 'var(--font-mono)',
    opacity: 0.7,
  },
  cli: {
    role: 'CLI 커맨드 라인. 개발자 분위기를 전달하는 장식.',
    fontSize: '0.55vw',     // ~11px at 1920
    fontWeight: 400,
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    font: 'var(--font-mono)',
    opacity: 0.35,          // 매우 흐리게 — 읽으려고 있는 게 아님
  },
  accent: {
    role: '큰따옴표, 숫자 하이라이트 등. 시각적 앵커.',
    fontSize: '3.5vw',      // ~67px at 1920
    fontWeight: 300,
    color: 'var(--accent-color)',
    font: 'var(--font-heading)',
    opacity: 0.15,
  },
  index: {
    role: '번호 뱃지 내부 숫자. 순서를 시각적으로 표시.',
    fontSize: '0.6vw',      // ~12px at 1920
    fontWeight: 700,
    color: 'var(--accent-color)',
    font: 'var(--font-mono)',
    opacity: 1,
  },
  code: {
    role: '코드 블록 내부 텍스트. 코드처럼 보이는 게 목적.',
    fontSize: '0.55vw',     // ~11px at 1920
    fontWeight: 400,
    lineHeight: 1.9,
    color: 'var(--text-secondary)',
    font: 'var(--font-mono)',
    opacity: 1,
  },
} as const;

// ─── 강조 규칙 ───────────────────────────────────────
//
// 텍스트 내에서 특정 단어를 강조할 때의 규칙

export const emphasis = {
  colorHighlight: {
    method: '텍스트 색상을 액센트 컬러로 변경',
    when: '한 문장에서 핵심 키워드 1~2개만',
    rule: '헤드라인에서만 사용. 본문에서는 사용하지 않는다.',
  },
  backgroundHighlight: {
    method: '텍스트 뒤에 액센트 컬러 배경 박스',
    when: '인용/강조 슬라이드에서 핵심 단어 1개',
    rule: '스타일에 따라 형태가 다름 (네오브루탈: 각진 박스, 미니멀: 밑줄)',
  },
  weightContrast: {
    method: '같은 크기에서 font-weight만 변경 (400 → 700)',
    when: '본문 내에서 중요 단어를 구분할 때',
    rule: '색상 강조와 중복 사용하지 않는다.',
  },
} as const;

// ─── 노멀라이징 규칙 ─────────────────────────────────

export const normalization = {
  // 한글 텍스트 규칙
  korean: {
    lineHeight: '영문 대비 +10~15% (영문 1.5 → 한글 1.65~1.75)',
    wordBreak: 'keep-all (단어 단위 줄바꿈)',
    letterSpacing: '헤드라인: -0.02em, 본문: 0, 캡션: +0.02em',
    fontSmoothing: '-webkit-font-smoothing: antialiased',
  },

  // 슬라이드 텍스트 규칙
  slide: {
    oneIdeaPerSlide: '한 슬라이드에 readable 텍스트 계층은 최대 3개 (headline + sub + body 또는 headline + body + caption)',
    headlineMax: '헤드라인은 2줄 이내. 넘으면 메시지를 줄인다.',
    noOrphanLines: '1단어만 남은 줄을 만들지 않는다 (줄바꿈 조정)',
    contrastMinimum: 'readable 텍스트의 배경 대비 최소 4.5:1',
    decorativeNoContrast: 'decorative 텍스트는 대비 규칙 면제 (흐려도 됨)',
  },

  // 스타일별 변형 허용 범위
  styleOverrides: {
    sizeRange: 'readable 텍스트 크기는 기본값의 ±15% 범위 내에서만 조정',
    weightRange: 'font-weight는 인접 1단계까지만 변경 (800→700 OK, 800→400 NG)',
    opacityFloor: 'readable 텍스트 opacity 최소 0.6, decorative는 제한 없음',
  },
} as const;
