/**
 * 1920x1080 그리드 시스템
 * 모든 씬의 요소 배치 기준. 세이프존 내에서만 콘텐츠 배치.
 */

export const GRID = {
  /** 캔버스 */
  width: 1920,
  height: 1080,

  /** 세이프존 (TV/모바일 잘림 방지) */
  safe: {
    top: 60,
    bottom: 80, // 자막 영역 확보
    left: 80,
    right: 80,
  },

  /** 콘텐츠 영역 (세이프존 내부) */
  content: {
    x: 80,
    y: 60,
    width: 1760, // 1920 - 80*2
    height: 940, // 1080 - 60 - 80
  },

  /** 12컬럼 그리드 */
  columns: 12,
  gutter: 24, // 컬럼 간 갭

  /** 컬럼 너비 계산 (gutters 포함) */
  colWidth: (1760 - 24 * 11) / 12, // ~122px

  /** N컬럼 span 너비 */
  span: (n: number) => {
    const colW = (1760 - 24 * 11) / 12;
    return colW * n + 24 * (n - 1);
  },

  /** 수직 리듬 */
  row: {
    gap: 32, // 행 간 기본 갭
    sectionGap: 64, // 섹션 간 큰 갭
  },

  /** 자막 영역 (하단 고정) */
  subtitle: {
    y: 960,
    height: 80,
    padding: 20,
  },

  /** 프로그래스 바 (최하단) */
  progressBar: {
    y: 1060,
    height: 4,
  },
} as const;

/** 레이아웃 프리셋 — 세이프존 기반 좌표 */
export const LAYOUT = {
  /** Split Screen 60/40 */
  split: {
    left: { x: GRID.content.x, y: GRID.content.y, width: GRID.span(7), height: GRID.content.height },
    right: { x: GRID.content.x + GRID.span(7) + GRID.gutter, y: GRID.content.y, width: GRID.span(5), height: GRID.content.height },
  },

  /** Split Screen 50/50 */
  splitEven: {
    left: { x: GRID.content.x, y: GRID.content.y, width: GRID.span(6), height: GRID.content.height },
    right: { x: GRID.content.x + GRID.span(6) + GRID.gutter, y: GRID.content.y, width: GRID.span(6), height: GRID.content.height },
  },

  /** Bento Grid 2fr 1fr 1fr */
  bento: {
    hero: { x: GRID.content.x, y: GRID.content.y, width: GRID.span(6), height: GRID.content.height },
    topRight: { x: GRID.content.x + GRID.span(6) + GRID.gutter, y: GRID.content.y, width: GRID.span(6), height: (GRID.content.height - GRID.row.gap) / 2 },
    bottomRight: { x: GRID.content.x + GRID.span(6) + GRID.gutter, y: GRID.content.y + (GRID.content.height - GRID.row.gap) / 2 + GRID.row.gap, width: GRID.span(6), height: (GRID.content.height - GRID.row.gap) / 2 },
  },

  /** Full-bleed + 중앙 오버레이 */
  fullBleed: {
    background: { x: 0, y: 0, width: GRID.width, height: GRID.height },
    overlay: { x: GRID.content.x + GRID.span(2), y: GRID.content.y + 120, width: GRID.span(8), height: GRID.content.height - 240 },
  },

  /** 중앙 집중형 (임팩트 메시지) */
  center: {
    area: { x: GRID.content.x + GRID.span(2), y: GRID.content.y + 160, width: GRID.span(8), height: GRID.content.height - 320 },
  },

  /** 3단 카드 (가로 배치, 비대칭 가능) */
  triCard: {
    cards: [
      { x: GRID.content.x, y: GRID.content.y + 120, width: GRID.span(4) - 8, height: GRID.content.height - 240 },
      { x: GRID.content.x + GRID.span(4) + GRID.gutter - 8, y: GRID.content.y + 120, width: GRID.span(4) - 8, height: GRID.content.height - 240 },
      { x: GRID.content.x + GRID.span(8) + GRID.gutter * 2 - 16, y: GRID.content.y + 120, width: GRID.span(4) - 8, height: GRID.content.height - 240 },
    ],
  },
} as const;
