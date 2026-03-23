import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { colors, fontWeight, fontFamily, borderRadius } from '../tokens/tokens';
import { grid, hierarchy } from '../tokens/grid';

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const SLIDE: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  background: colors.bg.slide,
  fontFamily: fontFamily.sans,
  overflow: 'hidden',
  color: colors.text.primary,
};

const MARGIN = grid.slide.margin.top; // 96
const COL_W = grid.slide.columnWidth; // 120
const GUTTER = grid.slide.gutter; // 24
const COLS = grid.slide.columns; // 12
const CONTENT_W = grid.slide.width - MARGIN * 2; // 1728

/** Convert a pixel value to percentage of slide width */
const pxToPct = (px: number) => `${(px / grid.slide.width) * 100}%`;
const pxToPctH = (px: number) => `${(px / grid.slide.height) * 100}%`;

/** Percentage margin */
const marginPct = pxToPct(MARGIN); // ~5%
const marginPctH = pxToPctH(MARGIN); // ~8.89%

/** Column span as percentage of content width */
const colSpanPct = (n: number) => `${((grid.span(n)) / CONTENT_W) * 100}%`;

const gridColor = 'rgba(0, 188, 212, 0.08)';
const gridFill = 'rgba(0, 188, 212, 0.04)';
const gridColFill = 'rgba(0, 188, 212, 0.06)';
const labelStyle: React.CSSProperties = {
  fontFamily: fontFamily.mono,
  fontSize: 10,
  color: colors.text.muted,
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
};

const patternLabelStyle: React.CSSProperties = {
  fontFamily: fontFamily.mono,
  fontSize: 11,
  color: colors.accent.primary,
  letterSpacing: 0.5,
  opacity: 0.8,
};

const blockStyle = (opacity = 0.12): React.CSSProperties => ({
  background: `rgba(0, 188, 212, ${opacity})`,
  border: `1px solid ${colors.accent.border}`,
  borderRadius: borderRadius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 12,
  boxSizing: 'border-box' as const,
});


/* ------------------------------------------------------------------ */
/*  GridOverlay component                                              */
/* ------------------------------------------------------------------ */

const GridOverlaySlide: React.FC = () => (
  <div style={SLIDE}>
    {/* Background grid */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${colors.border.dim} 1px, transparent 1px),
          linear-gradient(90deg, ${colors.border.dim} 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        pointerEvents: 'none',
      }}
    />

    {/* Margin areas */}
    {/* Top margin */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: marginPctH, background: 'rgba(255,100,100,0.06)', borderBottom: '1px dashed rgba(255,100,100,0.2)' }}>
      <span style={{ ...labelStyle, position: 'absolute', bottom: 4, left: marginPct, color: 'rgba(255,100,100,0.5)' }}>margin-top: 96px</span>
    </div>
    {/* Bottom margin */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: marginPctH, background: 'rgba(255,100,100,0.06)', borderTop: '1px dashed rgba(255,100,100,0.2)' }}>
      <span style={{ ...labelStyle, position: 'absolute', top: 4, left: marginPct, color: 'rgba(255,100,100,0.5)' }}>margin-bottom: 96px</span>
    </div>
    {/* Left margin */}
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: marginPct, background: 'rgba(255,100,100,0.06)', borderRight: '1px dashed rgba(255,100,100,0.2)' }} />
    {/* Right margin */}
    <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: marginPct, background: 'rgba(255,100,100,0.06)', borderLeft: '1px dashed rgba(255,100,100,0.2)' }} />

    {/* 12 columns */}
    <div
      style={{
        position: 'absolute',
        top: marginPctH,
        bottom: marginPctH,
        left: marginPct,
        right: marginPct,
        display: 'flex',
        gap: pxToPct(GUTTER),
      }}
    >
      {Array.from({ length: COLS }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: `0 0 ${(COL_W / CONTENT_W) * 100}%`,
            background: gridColFill,
            borderLeft: `1px solid ${gridColor}`,
            borderRight: `1px solid ${gridColor}`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 8,
            position: 'relative',
          }}
        >
          <span style={{ ...labelStyle, color: colors.accent.primary, opacity: 0.6 }}>{i + 1}</span>
        </div>
      ))}
    </div>

    {/* Column width label */}
    <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', ...patternLabelStyle }}>
      12-Column Grid &middot; 1920 x 1080 &middot; 120px cols &middot; 24px gutters &middot; 96px margins
    </div>

    {/* Safe area outline */}
    <div
      style={{
        position: 'absolute',
        top: marginPctH,
        left: marginPct,
        right: marginPct,
        bottom: marginPctH,
        border: `2px dashed rgba(0, 188, 212, 0.2)`,
        pointerEvents: 'none',
      }}
    >
      <span style={{ ...patternLabelStyle, position: 'absolute', top: -18, left: 0 }}>Safe Area</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Layout Pattern components                                          */
/* ------------------------------------------------------------------ */

/** Ghost grid background for pattern slides */
const GhostGrid: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: marginPctH,
      bottom: marginPctH,
      left: marginPct,
      right: marginPct,
      display: 'flex',
      gap: pxToPct(GUTTER),
      pointerEvents: 'none',
    }}
  >
    {Array.from({ length: COLS }).map((_, i) => (
      <div key={i} style={{ flex: `0 0 ${(COL_W / CONTENT_W) * 100}%`, background: gridFill, borderLeft: `1px solid ${gridColor}`, borderRight: `1px solid ${gridColor}` }} />
    ))}
  </div>
);

const PatternFrame: React.FC<{ label: string; description: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div style={{ marginBottom: 48 }}>
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary }}>{label}</span>
      <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>{description}</span>
    </div>
    <div style={SLIDE}>
      <GhostGrid />
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
        {children}
      </div>
    </div>
  </div>
);

/* 1. Center Stage */
const CenterStagePattern: React.FC = () => (
  <PatternFrame label="1. Center Stage" description="Single focal point, centered. Headline spans 7 columns, vertically at upper third.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: colSpanPct(7), textAlign: 'center' }}>
        <div style={{ ...blockStyle(0.15), padding: '32px 24px', marginBottom: grid.vr(3) }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 32, fontWeight: fontWeight.black, color: colors.text.primary }}>
            AI가 바꾸는 콘텐츠 제작의 미래
          </span>
        </div>
        <div style={{ ...blockStyle(0.06), padding: '16px 24px' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 16, color: colors.text.secondary }}>
            한 마디로 시작하는 자동화 파이프라인
          </span>
        </div>
      </div>
      <span style={{ ...patternLabelStyle, position: 'absolute', bottom: 16, right: 16 }}>7-col span, upper-third vertical</span>
    </div>
  </PatternFrame>
);

/* 2. Split Content 7-5 */
const SplitContent75: React.FC = () => (
  <PatternFrame label="2. Split Content (7-5)" description="Left 7 columns text, right 5 columns visual. Golden ratio approximation.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', gap: pxToPct(GUTTER) }}>
      <div style={{ flex: `0 0 ${colSpanPct(7)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(2) }}>
        <div style={{ ...patternLabelStyle, marginBottom: 4 }}>Layer 1 — 50% attention</div>
        <div style={{ ...blockStyle(0.15), padding: '24px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            디자인 시스템으로 일관된 브랜드 경험 구축
          </span>
        </div>
        <div style={{ ...patternLabelStyle, marginBottom: 4, marginTop: 8 }}>Layer 2 — 30% attention</div>
        <div style={{ ...blockStyle(0.06), padding: '16px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, lineHeight: 1.6 }}>
            토큰 기반 설계로 컬러, 타이포그래피, 간격을 체계적으로 관리합니다. 코드와 디자인의 간극을 줄이세요.
          </span>
        </div>
      </div>
      <div style={{ flex: `0 0 ${colSpanPct(5)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(2) }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ ...blockStyle(0.08), padding: 16 }}>
            <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>카드 {n}</span>
          </div>
        ))}
      </div>
    </div>
  </PatternFrame>
);

/* 3. Split Content 5-7 (reversed) */
const SplitContent57: React.FC = () => (
  <PatternFrame label="3. Split Content (5-7)" description="Reversed: left visual, right text. Visual weight shifts to left.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', gap: pxToPct(GUTTER) }}>
      <div style={{ flex: `0 0 ${colSpanPct(5)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...blockStyle(0.1), width: '100%', height: '70%', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.text.muted }}>Visual / Image Area</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.muted, opacity: 0.6 }}>5-col span</span>
        </div>
      </div>
      <div style={{ flex: `0 0 ${colSpanPct(7)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(3) }}>
        <div style={{ ...blockStyle(0.15), padding: '24px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 26, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            왼쪽 비주얼, 오른쪽 텍스트 배치
          </span>
        </div>
        <div style={{ ...blockStyle(0.06), padding: '14px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.text.secondary, lineHeight: 1.6 }}>
            시각 요소가 먼저 눈에 들어오고, 자연스럽게 오른쪽 텍스트로 시선이 이동합니다.
          </span>
        </div>
      </div>
    </div>
  </PatternFrame>
);

/* 4. Rule of Thirds */
const RuleOfThirdsPattern: React.FC = () => (
  <PatternFrame label="4. Rule of Thirds" description="3x3 grid overlay. Content placed at intersection points for natural visual flow.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH }}>
      {/* Third lines */}
      <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,188,212,0.25)' }} />
      <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,188,212,0.25)' }} />
      <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, borderTop: '1px dashed rgba(0,188,212,0.25)' }} />
      <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, borderTop: '1px dashed rgba(0,188,212,0.25)' }} />

      {/* Intersection dots */}
      {[33.33, 66.66].map(x =>
        [33.33, 66.66].map(y => (
          <div key={`${x}-${y}`} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 12, height: 12, borderRadius: '50%', background: colors.accent.primary, transform: 'translate(-50%, -50%)', opacity: 0.6 }} />
        ))
      )}

      {/* Content at intersections */}
      <div style={{ position: 'absolute', left: '5%', top: '20%', width: '55%' }}>
        <div style={{ ...blockStyle(0.15), padding: '20px 16px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 24, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            핵심 메시지는 교차점에
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', right: '5%', bottom: '20%', width: '40%' }}>
        <div style={{ ...blockStyle(0.08), padding: '14px 16px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>
            보조 정보는 대각선 반대편 교차점 근처에 배치
          </span>
        </div>
      </div>
    </div>
  </PatternFrame>
);

/* 5. Z-Pattern */
const ZPattern: React.FC = () => (
  <PatternFrame label="5. Z-Pattern" description="Eye follows Z shape: top-left logo, top-right nav, center-left hero, bottom-right CTA.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH }}>
      {/* Z line overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points="10,15 90,15 10,85 90,85" fill="none" stroke="rgba(0,188,212,0.15)" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      {/* Top-left: Logo */}
      <div style={{ position: 'absolute', top: '5%', left: '0%', width: '25%' }}>
        <div style={{ ...blockStyle(0.1), padding: '12px 16px' }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 13, color: colors.accent.primary }}>Logo / Brand</span>
        </div>
      </div>
      {/* Top-right: Nav */}
      <div style={{ position: 'absolute', top: '5%', right: '0%', width: '30%' }}>
        <div style={{ ...blockStyle(0.06), padding: '12px 16px', justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.muted }}>메뉴 A &nbsp; 메뉴 B &nbsp; 메뉴 C</span>
        </div>
      </div>
      {/* Center-left: Hero */}
      <div style={{ position: 'absolute', top: '30%', left: '0%', width: '60%' }}>
        <div style={{ ...blockStyle(0.15), padding: '28px 20px', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 26, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            Z 패턴으로 시선 유도
          </span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.text.secondary }}>
            자연스러운 읽기 흐름을 따라 콘텐츠를 배치합니다
          </span>
        </div>
      </div>
      {/* Bottom-right: CTA */}
      <div style={{ position: 'absolute', bottom: '5%', right: '0%', width: '35%' }}>
        <div style={{ ...blockStyle(0.2), padding: '16px 20px' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 15, fontWeight: fontWeight.bold, color: colors.accent.primary }}>
            시작하기 &rarr;
          </span>
        </div>
      </div>
    </div>
  </PatternFrame>
);

/* 6. F-Pattern */
const FPattern: React.FC = () => (
  <PatternFrame label="6. F-Pattern" description="Headline full width top, list items left-aligned below. Mimics natural reading scan.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', flexDirection: 'column', gap: grid.vr(3) }}>
      {/* Full-width headline bar */}
      <div style={{ ...blockStyle(0.15), padding: '20px 20px', justifyContent: 'flex-start' }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 26, fontWeight: fontWeight.bold, color: colors.text.primary }}>
          F 패턴 — 전체 폭 헤드라인이 시선을 잡는다
        </span>
      </div>
      {/* Second scan line - shorter */}
      <div style={{ width: '75%' }}>
        <div style={{ ...blockStyle(0.08), padding: '14px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary }}>
            두 번째 줄은 약간 짧게 — 시선이 왼쪽에서 오른쪽으로 스캔
          </span>
        </div>
      </div>
      {/* List items left-aligned */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: grid.vr(2), width: '60%' }}>
        {['첫 번째 핵심 포인트', '두 번째 핵심 포인트', '세 번째 핵심 포인트'].map((text, i) => (
          <div key={i} style={{ ...blockStyle(0.05), padding: '12px 16px', justifyContent: 'flex-start' }}>
            <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>
              <span style={{ color: colors.accent.primary, marginRight: 8 }}>{i + 1}.</span>{text}
            </span>
          </div>
        ))}
      </div>
      <span style={{ ...patternLabelStyle, position: 'absolute', bottom: 8, right: 0 }}>Eye scan narrows downward</span>
    </div>
  </PatternFrame>
);

/* 7. Bento Grid */
const BentoGridPattern: React.FC = () => (
  <PatternFrame label="7. Bento Grid" description="Modular grid with varied cell sizes (2x2, 1x1, 1x2). Visually rich composition.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: grid.vr(2) }}>
      {/* Large 2x2 */}
      <div style={{ ...blockStyle(0.15), gridColumn: '1 / 3', gridRow: '1 / 3', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 22, fontWeight: fontWeight.bold, color: colors.text.primary }}>핵심 기능</span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>2x2 영역으로 시각적 무게감</span>
      </div>
      {/* 1x1 top-right */}
      <div style={{ ...blockStyle(0.08), flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: fontWeight.medium, color: colors.text.primary }}>성능</span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 11, color: colors.text.muted }}>1x1</span>
      </div>
      {/* 1x1 */}
      <div style={{ ...blockStyle(0.08), flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: fontWeight.medium, color: colors.text.primary }}>보안</span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 11, color: colors.text.muted }}>1x1</span>
      </div>
      {/* 1x2 wide */}
      <div style={{ ...blockStyle(0.1), gridColumn: '3 / 5', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: fontWeight.medium, color: colors.text.primary }}>확장성과 유연한 아키텍처</span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 11, color: colors.text.muted }}>1x2 wide</span>
      </div>
      {/* Bottom row */}
      <div style={{ ...blockStyle(0.06), flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>통합</span>
      </div>
      <div style={{ ...blockStyle(0.06), gridColumn: '2 / 4', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>모니터링 및 분석 대시보드</span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 11, color: colors.text.muted }}>2x1 wide</span>
      </div>
      <div style={{ ...blockStyle(0.06), flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary }}>지원</span>
      </div>
    </div>
  </PatternFrame>
);

/* 8. Full Bleed */
const FullBleedPattern: React.FC = () => (
  <PatternFrame label="8. Full Bleed" description="Content fills entire frame. Text overlay with dark gradient for readability.">
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Simulated image background */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${colors.palette.darkPurple} 0%, ${colors.palette.darkNavy} 50%, rgba(0,188,212,0.15) 100%)` }} />
      {/* Dark gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,30,38,0.95) 0%, rgba(26,30,38,0.4) 50%, rgba(26,30,38,0.1) 100%)' }} />
      {/* Text overlay at bottom */}
      <div style={{ position: 'absolute', bottom: marginPctH, left: marginPct, right: '40%', display: 'flex', flexDirection: 'column', gap: grid.vr(2) }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 32, fontWeight: fontWeight.black, color: colors.text.primary, lineHeight: 1.3 }}>
          전체 화면을 이미지로 채우고 텍스트는 그라디언트 위에
        </span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, lineHeight: 1.6 }}>
          풀 블리드는 몰입감을 극대화합니다. 어두운 그라디언트로 텍스트 가독성을 확보하세요.
        </span>
      </div>
    </div>
  </PatternFrame>
);

/* 9. Asymmetric */
const AsymmetricPattern: React.FC = () => (
  <PatternFrame label="9. Asymmetric" description="Intentional asymmetry: large element 8-col left, small element 3-col right offset.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', gap: pxToPct(GUTTER), alignItems: 'center' }}>
      <div style={{ flex: `0 0 ${colSpanPct(8)}`, display: 'flex', alignItems: 'center' }}>
        <div style={{ ...blockStyle(0.15), width: '100%', height: '75%', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            큰 요소가 시선을 잡고
          </span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary }}>
            8-column span — 시각적 무게 중심
          </span>
        </div>
      </div>
      {/* 1-col gap (empty) */}
      <div style={{ flex: `0 0 ${colSpanPct(1)}` }} />
      <div style={{ flex: `0 0 ${colSpanPct(3)}`, display: 'flex', alignItems: 'flex-end', height: '75%' }}>
        <div style={{ ...blockStyle(0.08), width: '100%', padding: '20px 16px', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: fontWeight.medium, color: colors.text.primary }}>보조 요소</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.muted }}>3-col, offset</span>
        </div>
      </div>
    </div>
  </PatternFrame>
);

/* 10. Stacked */
const StackedPattern: React.FC = () => (
  <PatternFrame label="10. Stacked" description="3 horizontal bands: top title bar, middle content, bottom CTA. Clear vertical hierarchy.">
    <div style={{ position: 'absolute', top: marginPctH, left: marginPct, right: marginPct, bottom: marginPctH, display: 'flex', flexDirection: 'column', gap: grid.vr(3) }}>
      {/* Top band - title */}
      <div style={{ ...blockStyle(0.12), padding: '16px 20px', justifyContent: 'flex-start', flex: '0 0 auto' }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary, letterSpacing: 2 }}>
          SECTION 03 &mdash; 아키텍처
        </span>
      </div>
      {/* Middle band - main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(2) }}>
        <div style={{ ...blockStyle(0.15), padding: '24px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 26, fontWeight: fontWeight.bold, color: colors.text.primary }}>
            수직 스택으로 명확한 구조 전달
          </span>
        </div>
        <div style={{ ...blockStyle(0.06), padding: '16px 20px', justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.text.secondary, lineHeight: 1.6 }}>
            각 밴드는 독립적인 역할을 가집니다. 상단은 네비게이션, 중앙은 핵심 메시지, 하단은 행동 유도입니다.
          </span>
        </div>
      </div>
      {/* Bottom band - CTA */}
      <div style={{ ...blockStyle(0.1), padding: '14px 20px', justifyContent: 'center', flex: '0 0 auto' }}>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 15, fontWeight: fontWeight.medium, color: colors.accent.primary }}>
          다음 단계로 &rarr;
        </span>
      </div>
    </div>
  </PatternFrame>
);

/* ------------------------------------------------------------------ */
/*  Hierarchy Demo                                                     */
/* ------------------------------------------------------------------ */

const HierarchyDemoSlide: React.FC = () => (
  <div style={SLIDE}>
    <GhostGrid />
    <div style={{ position: 'relative', zIndex: 1, padding: `${marginPctH} ${marginPct}`, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(5) }}>
      {/* Layer 1 — 50% */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: grid.vr(1) }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.accent.primary }} />
          <span style={patternLabelStyle}>Layer 1 — 50% attention — {hierarchy.layer1_headline.fontSize}</span>
        </div>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 56, fontWeight: fontWeight.black, color: colors.text.primary, lineHeight: 1.2 }}>
          <span style={{ color: colors.accent.primary }}>핵심 메시지</span>가 가장 크게
        </span>
      </div>
      {/* Layer 2 — 30% */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: grid.vr(1) }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.text.secondary }} />
          <span style={patternLabelStyle}>Layer 2 — 30% attention — {hierarchy.layer2_subtext.fontSize}</span>
        </div>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.medium, color: colors.text.secondary, lineHeight: 1.5 }}>
          보조 텍스트는 중간 크기로 맥락을 전달합니다
        </span>
      </div>
      {/* Layer 3 — 15% */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: grid.vr(1) }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: colors.text.muted }} />
          <span style={patternLabelStyle}>Layer 3 — 15% attention — {hierarchy.layer3_support.fontSize}</span>
        </div>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 18, fontWeight: fontWeight.regular, color: colors.text.muted, lineHeight: 1.6 }}>
          근거 데이터나 세부 설명은 작고 차분한 톤으로 배치합니다. 이 레이어는 관심 있는 사람만 읽습니다.
        </span>
      </div>
      {/* Layer 4 — 5% */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: grid.vr(1) }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(236,236,236,0.15)' }} />
          <span style={patternLabelStyle}>Layer 4 — 5% attention — {hierarchy.layer4_meta.fontSize}</span>
        </div>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13, fontWeight: fontWeight.light, color: 'rgba(236,236,236,0.25)', lineHeight: 1.6 }}>
          출처: 2024 UX Research Report &middot; Page 12 of 24 &middot; Last updated 2024.03.15
        </span>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Spacing Rhythm                                                     */
/* ------------------------------------------------------------------ */

const SpacingRhythmSlide: React.FC = () => {
  const measureStyle = (width: number, label: string, color: string): React.ReactNode => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width, height: 8, background: color, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ ...labelStyle, color, whiteSpace: 'nowrap' }}>{label} — {width}px ({width / 8} units)</span>
    </div>
  );

  return (
    <div style={SLIDE}>
      <GhostGrid />
      <div style={{ position: 'relative', zIndex: 1, padding: `${marginPctH} ${marginPct}`, height: '100%', boxSizing: 'border-box', display: 'flex', gap: '8%' }}>
        {/* Left: Vertical rhythm scale */}
        <div style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: grid.vr(4) }}>
          <div style={{ marginBottom: grid.vr(2) }}>
            <span style={{ fontFamily: fontFamily.sans, fontSize: 24, fontWeight: fontWeight.bold, color: colors.text.primary }}>
              Vertical Rhythm — 8px Base Unit
            </span>
          </div>
          {measureStyle(grid.vr(1), 'vr(1) — Element padding', 'rgba(0,188,212,0.4)')}
          {measureStyle(grid.vr(2), 'vr(2) — Tight group gap', 'rgba(0,188,212,0.5)')}
          {measureStyle(grid.vr(3), 'vr(3) — Medium gap', 'rgba(0,188,212,0.6)')}
          {measureStyle(grid.vr(4), 'vr(4) — Section gap', 'rgba(0,188,212,0.7)')}
          {measureStyle(grid.vr(6), 'vr(6) — Wide section gap', 'rgba(0,188,212,0.8)')}
          {measureStyle(grid.vr(8), 'vr(8) — Layout gap', 'rgba(0,188,212,0.9)')}
          {measureStyle(grid.vr(12), 'vr(12) — Slide margin (96px)', colors.accent.primary)}
        </div>

        {/* Right: Visual diagram */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ border: `1px solid ${colors.accent.border}`, borderRadius: borderRadius.md, overflow: 'hidden' }}>
            {/* Slide margin indicator */}
            <div style={{ padding: 12, background: 'rgba(255,100,100,0.05)', borderBottom: '1px dashed rgba(255,100,100,0.15)' }}>
              <span style={{ ...labelStyle, color: 'rgba(255,100,100,0.5)' }}>Slide Margin — 96px</span>
            </div>
            {/* Section 1 */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,188,212,0.03)' }}>
              <div style={{ ...blockStyle(0.1), padding: '14px 16px', marginBottom: grid.vr(1) }}>
                <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.primary }}>Headline (internal padding: 8px)</span>
              </div>
              <div style={{ height: grid.vr(1), borderLeft: `2px solid rgba(0,188,212,0.3)`, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                <span style={{ ...labelStyle, color: 'rgba(0,188,212,0.5)', fontSize: 9 }}>8px — same-group</span>
              </div>
              <div style={{ ...blockStyle(0.06), padding: '10px 16px' }}>
                <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.secondary }}>Subtitle</span>
              </div>
            </div>
            {/* Between-group gap */}
            <div style={{ height: grid.vr(3), borderLeft: `2px solid rgba(0,188,212,0.5)`, marginLeft: 28, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
              <span style={{ ...labelStyle, color: 'rgba(0,188,212,0.7)', fontSize: 9 }}>24px — between groups</span>
            </div>
            {/* Section 2 */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,188,212,0.03)' }}>
              <div style={{ ...blockStyle(0.06), padding: '10px 16px', marginBottom: grid.vr(2) }}>
                <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.secondary }}>Content block A</span>
              </div>
              <div style={{ ...blockStyle(0.06), padding: '10px 16px' }}>
                <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.secondary }}>Content block B</span>
              </div>
            </div>
            {/* Between-section gap */}
            <div style={{ height: grid.vr(5), borderLeft: `2px solid ${colors.accent.primary}`, marginLeft: 28, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
              <span style={{ ...labelStyle, color: colors.accent.primary, fontSize: 9 }}>40px — between sections</span>
            </div>
            {/* Section 3 */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,188,212,0.03)' }}>
              <div style={{ ...blockStyle(0.06), padding: '10px 16px' }}>
                <span style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.text.secondary }}>Footer section</span>
              </div>
            </div>
            {/* Bottom margin */}
            <div style={{ padding: 12, background: 'rgba(255,100,100,0.05)', borderTop: '1px dashed rgba(255,100,100,0.15)' }}>
              <span style={{ ...labelStyle, color: 'rgba(255,100,100,0.5)' }}>Slide Margin — 96px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Composition Rules                                                  */
/* ------------------------------------------------------------------ */

const CompositionRulesSlide: React.FC = () => {
  const MiniSlide: React.FC<{ label: string; good?: boolean; children: React.ReactNode }> = ({ label, good, children }) => (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 10, color: good ? 'rgba(100,220,150,0.8)' : 'rgba(255,120,120,0.8)' }}>
          {good ? 'GOOD' : 'BAD'}
        </span>
        <span style={{ fontFamily: fontFamily.sans, fontSize: 11, color: colors.text.muted }}>{label}</span>
      </div>
      <div style={{ aspectRatio: '16/9', background: colors.bg.slide, border: `1px solid ${good ? 'rgba(100,220,150,0.2)' : 'rgba(255,120,120,0.2)'}`, borderRadius: borderRadius.sm, position: 'relative', overflow: 'hidden', padding: '6%' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Rule 1: 3-Second Rule */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary }}>1. 3-Second Rule</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary, marginLeft: 12 }}>3초 안에 슬라이드의 핵심을 파악할 수 있어야 한다</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <MiniSlide label="Too much to process">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 2, width: `${60 + Math.random() * 40}%` }} />
              ))}
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
                ))}
              </div>
            </div>
          </MiniSlide>
          <MiniSlide label="Instant clarity" good>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
              <div style={{ height: 14, width: '60%', background: 'rgba(0,188,212,0.2)', borderRadius: 2 }} />
              <div style={{ height: 8, width: '40%', background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
            </div>
          </MiniSlide>
        </div>
      </div>

      {/* Rule 2: One Idea Per Slide */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary }}>2. One Idea Per Slide</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary, marginLeft: 12 }}>한 슬라이드에 한 가지 메시지</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <MiniSlide label="Multiple ideas competing">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
              <div style={{ flex: 1, background: 'rgba(255,100,100,0.08)', borderRadius: 2, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ height: 6, width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
              </div>
              <div style={{ flex: 1, background: 'rgba(100,100,255,0.08)', borderRadius: 2, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ height: 6, width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
              </div>
              <div style={{ flex: 1, background: 'rgba(100,255,100,0.08)', borderRadius: 2, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                <div style={{ height: 6, width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
              </div>
            </div>
          </MiniSlide>
          <MiniSlide label="Single focused idea" good>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
              <div style={{ height: 16, width: '50%', background: 'rgba(0,188,212,0.2)', borderRadius: 2 }} />
              <div style={{ height: 6, width: '35%', background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
            </div>
          </MiniSlide>
        </div>
      </div>

      {/* Rule 3: Whitespace Ratio */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary }}>3. Whitespace Ratio</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary, marginLeft: 12 }}>40% 콘텐츠 / 60% 여백이 이상적</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <MiniSlide label="80% content, 20% whitespace">
            <div style={{ position: 'absolute', inset: '4%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 3 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
              ))}
            </div>
          </MiniSlide>
          <MiniSlide label="40% content, 60% whitespace" good>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingLeft: '10%', gap: 10 }}>
              <div style={{ height: 12, width: '45%', background: 'rgba(0,188,212,0.15)', borderRadius: 2 }} />
              <div style={{ height: 6, width: '55%', background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
              <div style={{ height: 6, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 1 }} />
            </div>
          </MiniSlide>
        </div>
      </div>

      {/* Rule 4: Alignment */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: fontWeight.bold, color: colors.accent.primary }}>4. Alignment</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.text.secondary, marginLeft: 12 }}>요소를 그리드에 정렬 vs 임의 배치</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <MiniSlide label="Random placement">
            <div style={{ position: 'relative', height: '100%' }}>
              <div style={{ position: 'absolute', top: '10%', left: '15%', width: '30%', height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '35%', left: '25%', width: '45%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '55%', left: '8%', width: '35%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '75%', left: '20%', width: '50%', height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
            </div>
          </MiniSlide>
          <MiniSlide label="Grid-snapped" good>
            <div style={{ position: 'relative', height: '100%' }}>
              {/* Grid guide line */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '10%', borderLeft: '1px solid rgba(0,188,212,0.1)' }} />
              <div style={{ position: 'absolute', top: '12%', left: '10%', width: '50%', height: 10, background: 'rgba(0,188,212,0.15)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '35%', left: '10%', width: '65%', height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '52%', left: '10%', width: '55%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '69%', left: '10%', width: '45%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
            </div>
          </MiniSlide>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Layout Patterns (all 10 in one)                                    */
/* ------------------------------------------------------------------ */

const AllLayoutPatterns: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <CenterStagePattern />
    <SplitContent75 />
    <SplitContent57 />
    <RuleOfThirdsPattern />
    <ZPattern />
    <FPattern />
    <BentoGridPattern />
    <FullBleedPattern />
    <AsymmetricPattern />
    <StackedPattern />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Storybook Meta                                                     */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Theme System/Layout System',
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1200, margin: '0 auto', background: colors.bg.base, padding: 48, minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  Exported Stories                                                    */
/* ------------------------------------------------------------------ */

export const GridOverlay: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary, margin: 0 }}>Grid Overlay</h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, margin: '8px 0 0' }}>12-column grid for 1920x1080 slides. 120px columns, 24px gutters, 96px margins.</p>
      </div>
      <GridOverlaySlide />
    </div>
  ),
};

export const LayoutPatterns: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary, margin: 0 }}>Layout Patterns</h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, margin: '8px 0 0' }}>10 composition patterns with grid-aligned content placement. Each pattern shows ghosted grid in background.</p>
      </div>
      <AllLayoutPatterns />
    </div>
  ),
};

export const HierarchyDemo: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary, margin: 0 }}>Visual Hierarchy — 50/30/15/5</h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, margin: '8px 0 0' }}>Attention allocation across 4 typographic layers. Bigger = more important.</p>
      </div>
      <HierarchyDemoSlide />
    </div>
  ),
};

export const SpacingRhythm: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary, margin: 0 }}>Spacing Rhythm</h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, margin: '8px 0 0' }}>8px base unit vertical rhythm. All spacings are multiples of 8.</p>
      </div>
      <SpacingRhythmSlide />
    </div>
  ),
};

export const CompositionRules: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: fontFamily.sans, fontSize: 28, fontWeight: fontWeight.bold, color: colors.text.primary, margin: 0 }}>Composition Rules</h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.text.secondary, margin: '8px 0 0' }}>Good vs bad examples of fundamental slide composition principles.</p>
      </div>
      <CompositionRulesSlide />
    </div>
  ),
};
