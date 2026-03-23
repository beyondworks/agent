import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { colors, fontFamily, borderRadius, fontSize, fontWeight } from '../tokens/tokens';
import {
  type LayoutPattern,
  type ContentType,
  patternSpecs,
  contentLayoutMap,
  allPatterns,
  validateSequence,
  layoutFamilyMap,
} from '../tokens/layout-variations';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const PAGE: React.CSSProperties = {
  background: colors.bg.base,
  padding: 40,
  fontFamily: fontFamily.sans,
  color: colors.text.primary,
  minHeight: '100vh',
};

const HEADING: React.CSSProperties = {
  fontSize: fontSize.h2,
  fontWeight: fontWeight.bold,
  marginBottom: 8,
  color: colors.text.primary,
};

const SUB: React.CSSProperties = {
  fontSize: fontSize.body,
  color: colors.text.secondary,
  marginBottom: 40,
};

const GLASS: React.CSSProperties = {
  background: colors.bg.card,
  border: `1px solid ${colors.border.glass}`,
  borderRadius: borderRadius.lg,
  overflow: 'hidden',
};

const MONO: React.CSSProperties = {
  fontFamily: fontFamily.mono,
  fontSize: 11,
  lineHeight: 1.5,
};

const TAG: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: borderRadius.sm,
  fontSize: 11,
  fontFamily: fontFamily.mono,
  marginRight: 4,
  marginBottom: 4,
};

const TAG_TEAL: React.CSSProperties = {
  ...TAG,
  background: 'rgba(0, 188, 212, 0.12)',
  color: colors.accent.primary,
  border: `1px solid ${colors.accent.border}`,
};

const TAG_MUTED: React.CSSProperties = {
  ...TAG,
  background: 'rgba(255, 255, 255, 0.04)',
  color: colors.text.muted,
  border: `1px solid ${colors.border.dim}`,
};

/* ------------------------------------------------------------------ */
/*  Mini layout diagram renderer                                       */
/* ------------------------------------------------------------------ */

const TEAL_BLOCK = 'rgba(0, 188, 212, 0.25)';
const PURPLE_BLOCK = 'rgba(74, 69, 88, 0.4)';
const TEAL_BORDER = 'rgba(0, 188, 212, 0.35)';
const PURPLE_BORDER = 'rgba(74, 69, 88, 0.5)';

interface BlockDef {
  x: number; y: number; w: number; h: number;
  primary?: boolean;
  label?: string;
}

/** Predefined block layouts for each pattern (normalized 0-1 coords). */
const patternBlocks: Record<LayoutPattern, BlockDef[]> = {
  'center-stage': [
    { x: 0.25, y: 0.2, w: 0.5, h: 0.6, primary: true, label: 'CONTENT' },
  ],
  'split-7-5': [
    { x: 0, y: 0, w: 0.56, h: 1, primary: true, label: 'TEXT' },
    { x: 0.6, y: 0.1, w: 0.38, h: 0.8, label: 'VISUAL' },
  ],
  'split-5-7': [
    { x: 0, y: 0.1, w: 0.38, h: 0.8, label: 'VISUAL' },
    { x: 0.42, y: 0, w: 0.56, h: 1, primary: true, label: 'TEXT' },
  ],
  'split-equal': [
    { x: 0, y: 0, w: 0.48, h: 1, primary: true, label: 'LEFT' },
    { x: 0.52, y: 0, w: 0.48, h: 1, label: 'RIGHT' },
  ],
  'asymmetric-8-4': [
    { x: 0, y: 0, w: 0.64, h: 1, primary: true, label: 'MAIN' },
    { x: 0.68, y: 0.15, w: 0.3, h: 0.7, label: 'SIDE' },
  ],
  'asymmetric-4-8': [
    { x: 0, y: 0.15, w: 0.3, h: 0.7, label: 'SIDE' },
    { x: 0.34, y: 0, w: 0.64, h: 1, primary: true, label: 'MAIN' },
  ],
  'bento-grid': [
    { x: 0, y: 0, w: 0.64, h: 0.48, primary: true, label: 'A' },
    { x: 0.68, y: 0, w: 0.3, h: 0.48, label: 'B' },
    { x: 0, y: 0.52, w: 0.3, h: 0.48, label: 'C' },
    { x: 0.34, y: 0.52, w: 0.64, h: 0.48, label: 'D' },
  ],
  'staggered-rows': [
    { x: 0, y: 0, w: 0.45, h: 0.28, primary: true, label: '1' },
    { x: 0.5, y: 0, w: 0.45, h: 0.28, label: '2' },
    { x: 0.1, y: 0.35, w: 0.45, h: 0.28, label: '3' },
    { x: 0.6, y: 0.35, w: 0.35, h: 0.28, label: '4' },
    { x: 0, y: 0.7, w: 0.45, h: 0.28, label: '5' },
    { x: 0.5, y: 0.7, w: 0.45, h: 0.28, label: '6' },
  ],
  'feature-callout': [
    { x: 0, y: 0, w: 0.58, h: 1, primary: true, label: 'HERO' },
    { x: 0.62, y: 0, w: 0.36, h: 0.48, label: 'sub1' },
    { x: 0.62, y: 0.52, w: 0.36, h: 0.48, label: 'sub2' },
  ],
  'magazine-editorial': [
    { x: 0, y: 0.1, w: 0.4, h: 0.5, primary: true, label: 'TYPO' },
    { x: 0.55, y: 0.2, w: 0.4, h: 0.6, label: 'BODY' },
  ],
  'full-bleed': [
    { x: 0, y: 0, w: 1, h: 1, primary: true, label: 'FULL' },
  ],
  'hero-supporting': [
    { x: 0, y: 0, w: 1, h: 0.55, primary: true, label: 'HERO' },
    { x: 0, y: 0.6, w: 0.3, h: 0.38, label: 's1' },
    { x: 0.34, y: 0.6, w: 0.3, h: 0.38, label: 's2' },
    { x: 0.68, y: 0.6, w: 0.3, h: 0.38, label: 's3' },
  ],
  'alternating-zigzag': [
    { x: 0, y: 0, w: 0.48, h: 0.3, primary: true, label: 'IMG' },
    { x: 0.52, y: 0, w: 0.48, h: 0.3, label: 'TXT' },
    { x: 0, y: 0.35, w: 0.48, h: 0.3, label: 'TXT' },
    { x: 0.52, y: 0.35, w: 0.48, h: 0.3, primary: true, label: 'IMG' },
    { x: 0, y: 0.7, w: 0.48, h: 0.3, primary: true, label: 'IMG' },
    { x: 0.52, y: 0.7, w: 0.48, h: 0.3, label: 'TXT' },
  ],
  filmstrip: [
    { x: 0, y: 0.15, w: 0.18, h: 0.7, primary: true, label: '1' },
    { x: 0.205, y: 0.15, w: 0.18, h: 0.7, label: '2' },
    { x: 0.41, y: 0.15, w: 0.18, h: 0.7, label: '3' },
    { x: 0.615, y: 0.15, w: 0.18, h: 0.7, label: '4' },
    { x: 0.82, y: 0.15, w: 0.18, h: 0.7, label: '5' },
  ],
  'quote-spotlight': [
    { x: 0.15, y: 0.25, w: 0.7, h: 0.5, primary: true, label: 'QUOTE' },
  ],
  'data-dashboard': [
    { x: 0, y: 0, w: 0.23, h: 0.4, primary: true, label: 'N1' },
    { x: 0.26, y: 0, w: 0.23, h: 0.4, label: 'N2' },
    { x: 0.52, y: 0, w: 0.23, h: 0.4, label: 'N3' },
    { x: 0.78, y: 0, w: 0.22, h: 0.4, label: 'N4' },
    { x: 0, y: 0.46, w: 0.48, h: 0.54, label: 'chart1' },
    { x: 0.52, y: 0.46, w: 0.48, h: 0.54, label: 'chart2' },
  ],
  timeline: [
    { x: 0, y: 0, w: 0.42, h: 0.28, primary: true, label: 'step1' },
    { x: 0.46, y: 0.08, w: 0.08, h: 0.84 }, // line
    { x: 0.56, y: 0.35, w: 0.42, h: 0.28, label: 'step2' },
    { x: 0, y: 0.7, w: 0.42, h: 0.28, primary: true, label: 'step3' },
  ],
  'comparison-table': [
    { x: 0, y: 0, w: 0.25, h: 0.15, label: 'Label' },
    { x: 0.28, y: 0, w: 0.35, h: 0.15, primary: true, label: 'ColA' },
    { x: 0.65, y: 0, w: 0.35, h: 0.15, label: 'ColB' },
    { x: 0, y: 0.2, w: 0.25, h: 0.8 },
    { x: 0.28, y: 0.2, w: 0.35, h: 0.8, primary: true },
    { x: 0.65, y: 0.2, w: 0.35, h: 0.8 },
  ],
};

const LayoutDiagram: React.FC<{
  pattern: LayoutPattern;
  width?: number;
  height?: number;
  showLabel?: boolean;
}> = ({ pattern, width = 280, height = 158, showLabel = true }) => {
  const blocks = patternBlocks[pattern];
  const pad = 8;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  return (
    <div style={{ width, height, position: 'relative', background: colors.bg.slide, borderRadius: borderRadius.sm, overflow: 'hidden' }}>
      {/* Grid ghost */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,188,212,0.04) 0px, rgba(0,188,212,0.04) 1px, transparent 1px, transparent ${innerW / 12}px)`,
        backgroundPosition: `${pad}px 0`,
        backgroundSize: `${innerW / 12}px 100%`,
      }} />
      {blocks.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pad + b.x * innerW,
            top: pad + b.y * innerH,
            width: b.w * innerW,
            height: b.h * innerH,
            background: b.primary ? TEAL_BLOCK : PURPLE_BLOCK,
            border: `1px solid ${b.primary ? TEAL_BORDER : PURPLE_BORDER}`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...MONO,
            fontSize: 9,
            color: b.primary ? colors.accent.primary : colors.text.muted,
          }}
        >
          {showLabel && b.label}
        </div>
      ))}
    </div>
  );
};


/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Theme System/Layout Variations',
};
export default meta;

/* ------------------------------------------------------------------ */
/*  Story: PatternCatalog                                              */
/* ------------------------------------------------------------------ */

export const PatternCatalog: StoryObj = {
  render: () => (
    <div style={PAGE}>
      <h1 style={HEADING}>Layout Pattern Catalog</h1>
      <p style={SUB}>16:9 슬라이드를 위한 18가지 레이아웃 패턴. teal = 주요 영역, purple-gray = 보조 영역</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 24,
      }}>
        {allPatterns.map((p) => {
          const spec = patternSpecs[p];
          return (
            <div key={p} style={{ ...GLASS, padding: 20, display: 'flex', gap: 20 }}>
              <LayoutDiagram pattern={p} width={300} height={169} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...MONO, fontSize: 14, color: colors.accent.primary, marginBottom: 4 }}>{p}</div>
                <div style={{ fontSize: 14, color: colors.text.secondary, marginBottom: 12 }}>{spec.description}</div>
                <pre style={{
                  ...MONO, fontSize: 10, color: colors.text.muted,
                  background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 4,
                  marginBottom: 12, whiteSpace: 'pre', overflow: 'auto',
                }}>{spec.sketch}</pre>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ ...MONO, fontSize: 10, color: colors.text.muted, marginRight: 6 }}>best for:</span>
                  {spec.bestFor.map((ct) => <span key={ct} style={TAG_TEAL}>{ct}</span>)}
                </div>
                <div>
                  <span style={{ ...MONO, fontSize: 10, color: colors.text.muted, marginRight: 6 }}>columns:</span>
                  <span style={{ ...MONO, fontSize: 11, color: colors.text.secondary }}>{spec.columns}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Story: ContentMapping                                              */
/* ------------------------------------------------------------------ */

const ContentMappingInner: React.FC = () => {
  const [selected, setSelected] = useState<ContentType | null>(null);
  const contentTypes = Object.keys(contentLayoutMap) as ContentType[];

  const contentTypeLabels: Record<ContentType, string> = {
    title: '제목/인트로',
    problem: '문제 정의',
    quote: '인용/핵심 메시지',
    comparison: '비교 (Before/After)',
    list3: '리스트 (3개 항목)',
    list4plus: '리스트 (4개 이상)',
    code: '코드/기술 비교',
    cta: 'CTA/마무리',
    process: '프로세스/순서',
    stats: '숫자/통계',
  };

  const highlightedPatterns = selected ? new Set(contentLayoutMap[selected]) : null;

  return (
    <div style={PAGE}>
      <h1 style={HEADING}>Content &rarr; Layout Mapping</h1>
      <p style={SUB}>콘텐츠 유형을 클릭하면 추천 레이아웃이 강조됩니다</p>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left: content type list */}
        <div style={{ width: 240, flexShrink: 0 }}>
          {contentTypes.map((ct) => {
            const isActive = selected === ct;
            return (
              <button
                key={ct}
                onClick={() => setSelected(isActive ? null : ct)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  marginBottom: 4,
                  background: isActive ? 'rgba(0,188,212,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? colors.accent.border : 'transparent'}`,
                  borderRadius: borderRadius.sm,
                  color: isActive ? colors.accent.primary : colors.text.secondary,
                  fontFamily: fontFamily.sans,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ ...MONO, fontSize: 11, marginRight: 8, opacity: 0.5 }}>{ct}</span>
                {contentTypeLabels[ct]}
              </button>
            );
          })}
        </div>
        {/* Right: pattern grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          alignContent: 'start',
        }}>
          {allPatterns.map((p) => {
            const isHighlighted = highlightedPatterns === null || highlightedPatterns.has(p);
            return (
              <div key={p} style={{
                ...GLASS,
                padding: 10,
                opacity: isHighlighted ? 1 : 0.2,
                transition: 'opacity 0.2s',
                border: highlightedPatterns?.has(p)
                  ? `1px solid ${colors.accent.border}`
                  : `1px solid ${colors.border.glass}`,
              }}>
                <LayoutDiagram pattern={p} width={200} height={112} showLabel={false} />
                <div style={{ ...MONO, fontSize: 11, color: colors.accent.primary, marginTop: 6, textAlign: 'center' }}>{p}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ContentMapping: StoryObj = {
  render: () => <ContentMappingInner />,
};

/* ------------------------------------------------------------------ */
/*  Story: SequenceValidator                                           */
/* ------------------------------------------------------------------ */

const goodSequence: LayoutPattern[] = [
  'center-stage',
  'split-7-5',
  'bento-grid',
  'quote-spotlight',
  'timeline',
  'data-dashboard',
  'magazine-editorial',
];

const badSequence: LayoutPattern[] = [
  'center-stage',
  'quote-spotlight',   // same family (center)
  'split-7-5',
  'split-equal',       // same family (split)
  'bento-grid',
  'staggered-rows',    // same family (grid)
  'bento-grid',        // same family (grid) again
];

const SlideBar: React.FC<{
  patterns: LayoutPattern[];
  label: string;
  good: boolean;
}> = ({ patterns, label, good }) => {
  const result = validateSequence(patterns);
  const violationIndices = new Set(result.violations.filter(v => v.index > 0 && v.index < patterns.length).map(v => v.index));

  return (
    <div style={{ flex: 1 }}>
      <div style={{
        ...MONO, fontSize: 13,
        color: good ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
        marginBottom: 12,
      }}>
        {label} {good ? '(valid)' : `(${result.violations.length} violations)`}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {patterns.map((p, i) => {
          const hasViolation = violationIndices.has(i);
          return (
            <div key={i} style={{
              ...GLASS,
              padding: 8,
              width: 120,
              border: `1px solid ${hasViolation ? 'rgba(244,67,54,0.4)' : colors.border.glass}`,
              background: hasViolation ? 'rgba(244,67,54,0.06)' : colors.bg.card,
            }}>
              <div style={{ ...MONO, fontSize: 9, color: colors.text.muted, marginBottom: 4 }}>#{i + 1}</div>
              <LayoutDiagram pattern={p} width={104} height={58} showLabel={false} />
              <div style={{ ...MONO, fontSize: 9, color: colors.accent.primary, marginTop: 4, textAlign: 'center' }}>{p}</div>
              <div style={{
                textAlign: 'center', marginTop: 4, fontSize: 14,
                color: hasViolation ? 'rgba(244,67,54,0.9)' : 'rgba(76,175,80,0.9)',
              }}>
                {hasViolation ? '\u2718' : '\u2714'}
              </div>
            </div>
          );
        })}
      </div>
      {result.violations.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {result.violations.map((v, i) => (
            <div key={i} style={{ ...MONO, fontSize: 11, color: 'rgba(244,67,54,0.7)', marginBottom: 2 }}>
              slide #{v.index + 1}: {v.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SequenceValidator: StoryObj = {
  render: () => (
    <div style={PAGE}>
      <h1 style={HEADING}>Sequence Validator</h1>
      <p style={SUB}>7-slide 시퀀스에서 레이아웃 반복 규칙을 검증합니다</p>
      <div style={{ display: 'flex', gap: 40 }}>
        <SlideBar patterns={goodSequence} label="Good Sequence" good />
        <SlideBar patterns={badSequence} label="Bad Sequence" good={false} />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Story: PatternDetails                                              */
/* ------------------------------------------------------------------ */

const topPatterns: LayoutPattern[] = [
  'center-stage',
  'split-7-5',
  'split-equal',
  'bento-grid',
  'feature-callout',
  'magazine-editorial',
  'quote-spotlight',
  'data-dashboard',
  'timeline',
  'hero-supporting',
];

const sampleContent: Partial<Record<LayoutPattern, { title: string; body: string }>> = {
  'center-stage': { title: '왜 지금 바꿔야 하는가', body: '변화는 선택이 아니라 생존 전략입니다' },
  'split-7-5': { title: '기존 방식의 문제점', body: '매뉴얼 프로세스가 만드는 병목 3가지를 분석합니다' },
  'split-equal': { title: 'Before vs After', body: '도입 전후 워크플로우를 직접 비교해 보겠습니다' },
  'bento-grid': { title: '핵심 기능 3가지', body: '자동화, 분석, 협업 --- 각 모듈이 하나의 플랫폼에서 동작합니다' },
  'feature-callout': { title: 'AI 엔진의 핵심', body: '실시간 데이터 파이프라인이 모든 것을 가능하게 합니다' },
  'magazine-editorial': { title: '2024, 전환점', body: '산업 전체가 재편되고 있습니다. 우리가 그 중심에 있습니다' },
  'quote-spotlight': { title: '', body: '"좋은 도구는 사용자를 바꾸고, 위대한 도구는 산업을 바꾼다"' },
  'data-dashboard': { title: '성과 지표', body: '처리 속도 3.2배, 오류율 87% 감소, 비용 42% 절감, NPS 92점' },
  timeline: { title: '도입 로드맵', body: '1단계 파일럿 -> 2단계 확장 -> 3단계 전사 적용' },
  'hero-supporting': { title: '아키텍처 개요', body: '메인 시스템과 3개의 보조 서비스로 구성됩니다' },
};

export const PatternDetails: StoryObj = {
  render: () => (
    <div style={PAGE}>
      <h1 style={HEADING}>Pattern Details</h1>
      <p style={SUB}>상위 10개 패턴의 상세 스펙과 한국어 샘플</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {topPatterns.map((p) => {
          const spec = patternSpecs[p];
          const sample = sampleContent[p];
          const family = layoutFamilyMap[p];
          return (
            <div key={p} style={{ ...GLASS, padding: 24, display: 'flex', gap: 28 }}>
              {/* Large diagram */}
              <div style={{ flexShrink: 0 }}>
                <LayoutDiagram pattern={p} width={400} height={225} />
                {/* Grid spec overlay */}
                <div style={{
                  marginTop: 12, ...MONO, fontSize: 11, color: colors.text.muted,
                  background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 4,
                }}>
                  <div>columns: <span style={{ color: colors.text.secondary }}>{spec.columns}</span></div>
                  <div>alignment: <span style={{ color: colors.text.secondary }}>{spec.contentAlignment}</span></div>
                  {spec.gridAreas && <div>areas: <span style={{ color: colors.text.secondary }}>{spec.gridAreas}</span></div>}
                  <div>family: <span style={{ color: colors.accent.primary }}>{family}</span></div>
                </div>
              </div>
              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: fontWeight.bold, color: colors.accent.primary, marginBottom: 4 }}>{p}</div>
                <div style={{ fontSize: 15, color: colors.text.secondary, marginBottom: 16 }}>{spec.description}</div>

                {/* Sample content */}
                {sample && (
                  <div style={{
                    background: 'rgba(0,188,212,0.04)',
                    border: `1px solid ${colors.accent.border}`,
                    borderRadius: borderRadius.sm,
                    padding: 16,
                    marginBottom: 16,
                  }}>
                    <div style={{ ...MONO, fontSize: 10, color: colors.text.muted, marginBottom: 8 }}>SAMPLE CONTENT</div>
                    {sample.title && <div style={{ fontSize: 16, fontWeight: fontWeight.bold, marginBottom: 6 }}>{sample.title}</div>}
                    <div style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 1.6 }}>{sample.body}</div>
                  </div>
                )}

                {/* Tags */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ ...MONO, fontSize: 10, color: colors.text.muted, marginBottom: 4 }}>BEST FOR</div>
                  {spec.bestFor.map((ct) => <span key={ct} style={TAG_TEAL}>{ct}</span>)}
                </div>
                <div>
                  <div style={{ ...MONO, fontSize: 10, color: colors.text.muted, marginBottom: 4 }}>AVOID AFTER</div>
                  {spec.avoidAfter.map((ap) => <span key={ap} style={TAG_MUTED}>{ap}</span>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
};
