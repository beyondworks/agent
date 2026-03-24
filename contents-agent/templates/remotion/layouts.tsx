/**
 * 레이아웃 템플릿 — 씬 내부 콘텐츠 배치용
 *
 * 5가지 레이아웃 패턴:
 * 1. SplitLayout — 60/40 또는 50/50 좌우 분할
 * 2. BentoLayout — 2fr+1fr+1fr 비대칭 그리드
 * 3. FullBleedLayout — 전면 배경 + 중앙 오버레이
 * 4. ZigZagLayout — 이미지-텍스트 좌우 교대
 * 5. CascadeLayout — 카드 겹침 + 미세 회전 (Z-Axis)
 *
 * 규칙: 인접 씬은 반드시 다른 레이아웃 사용
 */

import React from 'react';
import { GRID, LAYOUT } from './grid';

const baseStyle: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

/** Split Screen (60/40 기본, even=true로 50/50) */
export const SplitLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  even?: boolean;
}> = ({ left, right, even = false }) => {
  const preset = even ? LAYOUT.splitEven : LAYOUT.split;
  return (
    <>
      <div style={{ ...baseStyle, ...preset.left, padding: 40 }}>{left}</div>
      <div style={{ ...baseStyle, ...preset.right, padding: 40, alignItems: 'center' }}>{right}</div>
    </>
  );
};

/** Bento Grid (왼쪽 Hero + 오른쪽 상/하) */
export const BentoLayout: React.FC<{
  hero: React.ReactNode;
  topRight: React.ReactNode;
  bottomRight: React.ReactNode;
}> = ({ hero, topRight, bottomRight }) => (
  <>
    <div style={{ ...baseStyle, ...LAYOUT.bento.hero, padding: 40 }}>{hero}</div>
    <div style={{ ...baseStyle, ...LAYOUT.bento.topRight, padding: 32 }}>{topRight}</div>
    <div style={{ ...baseStyle, ...LAYOUT.bento.bottomRight, padding: 32 }}>{bottomRight}</div>
  </>
);

/** Full-bleed 배경 + 중앙 오버레이 */
export const FullBleedLayout: React.FC<{
  background: React.ReactNode;
  overlay: React.ReactNode;
}> = ({ background, overlay }) => (
  <>
    <div style={{ position: 'absolute', inset: 0 }}>{background}</div>
    <div
      style={{
        ...baseStyle,
        ...LAYOUT.fullBleed.overlay,
        alignItems: 'center',
        textAlign: 'center',
        padding: 60,
      }}
    >
      {overlay}
    </div>
  </>
);

/** Zig-Zag 교차 (행 단위 좌우 교대) */
export const ZigZagLayout: React.FC<{
  rows: Array<{ visual: React.ReactNode; text: React.ReactNode }>;
}> = ({ rows }) => {
  const rowHeight = (GRID.content.height - GRID.row.gap * (rows.length - 1)) / rows.length;

  return (
    <>
      {rows.map((row, i) => {
        const isReversed = i % 2 === 1;
        const y = GRID.content.y + i * (rowHeight + GRID.row.gap);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: GRID.content.x,
              top: y,
              width: GRID.content.width,
              height: rowHeight,
              display: 'flex',
              flexDirection: isReversed ? 'row-reverse' : 'row',
              gap: GRID.gutter,
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '0 0 45%', display: 'flex', justifyContent: 'center' }}>
              {row.visual}
            </div>
            <div style={{ flex: 1, padding: '0 20px' }}>{row.text}</div>
          </div>
        );
      })}
    </>
  );
};

/** Z-Axis Cascade (카드 겹침 + 미세 회전) */
export const CascadeLayout: React.FC<{
  cards: React.ReactNode[];
  /** 카드 간 X 오프셋 (기본 60px) */
  offsetX?: number;
  /** 카드 간 Y 오프셋 (기본 40px) */
  offsetY?: number;
  /** 카드 간 회전 (기본 2deg) */
  rotation?: number;
}> = ({ cards, offsetX = 60, offsetY = 40, rotation = 2 }) => {
  const centerX = GRID.width / 2;
  const centerY = GRID.height / 2;
  const totalOffset = (cards.length - 1) * offsetX;
  const startX = centerX - totalOffset / 2 - 200;

  return (
    <>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: startX + i * offsetX,
            top: centerY - 200 + i * offsetY,
            width: 480,
            transform: `rotate(${(i - Math.floor(cards.length / 2)) * rotation}deg)`,
            zIndex: i + 1,
          }}
        >
          {card}
        </div>
      ))}
    </>
  );
};

/** 중앙 집중형 (임팩트 메시지, CTA) */
export const CenterLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div
    style={{
      ...baseStyle,
      ...LAYOUT.center.area,
      alignItems: 'center',
      textAlign: 'center',
      padding: 60,
    }}
  >
    {children}
  </div>
);

/** 3단 카드 가로 배치 */
export const TriCardLayout: React.FC<{
  cards: [React.ReactNode, React.ReactNode, React.ReactNode];
}> = ({ cards }) => (
  <>
    {LAYOUT.triCard.cards.map((pos, i) => (
      <div key={i} style={{ ...baseStyle, ...pos, padding: 24 }}>
        {cards[i]}
      </div>
    ))}
  </>
);
