import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  badgeRules,
  containerRules,
  colorContrastRules,
  codeBlockRules,
  lineBreakRules,
  styleConsistencyRules,
  verticalPlacementRules,
  headlineScaleRules,
  comparisonWeightRules,
  patternIdentityRules,
  contentAreaRules,
  preDeliveryChecklist,
} from '../tokens/component-rules';

const BG_BASE = '#2B303B';
const BG_CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_PRIMARY = '#ECECEC';
const TEXT_SECONDARY = 'rgba(236,236,236,0.6)';
const ACCENT = '#00BCD4';
const ANTI_PATTERN_COLOR = '#EF4444';
const ANTI_PATTERN_BG = 'rgba(239,68,68,0.08)';
const ANTI_PATTERN_BORDER = 'rgba(239,68,68,0.25)';

const cardStyle: React.CSSProperties = {
  background: BG_CARD,
  border: `1px solid ${BORDER}`,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: 12,
  padding: '28px 32px',
  marginBottom: 20,
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: ACCENT,
  marginBottom: 6,
};

const ruleNameStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: TEXT_PRIMARY,
  marginBottom: 8,
  lineHeight: 1.3,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 14,
  color: TEXT_SECONDARY,
  marginBottom: 18,
  lineHeight: 1.7,
};

const ruleListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginBottom: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const ruleItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
};

const ruleNumberStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: '50%',
  background: 'rgba(0,188,212,0.15)',
  border: `1px solid rgba(0,188,212,0.3)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 700,
  color: ACCENT,
  marginTop: 1,
};

const ruleTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: TEXT_PRIMARY,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
};

const antiPatternBoxStyle: React.CSSProperties = {
  background: ANTI_PATTERN_BG,
  border: `1px solid ${ANTI_PATTERN_BORDER}`,
  borderRadius: 8,
  padding: '12px 16px',
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
};

const antiPatternLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: ANTI_PATTERN_COLOR,
  flexShrink: 0,
  marginTop: 2,
};

const antiPatternTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: ANTI_PATTERN_COLOR,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
};

interface RuleSection {
  index: number;
  name: string;
  description: string;
  rules: readonly string[];
  antiPattern: string;
}

function RuleCard({ section }: { section: RuleSection }) {
  return (
    <div style={cardStyle}>
      <div style={sectionHeaderStyle}>Rule {section.index.toString().padStart(2, '0')}</div>
      <div style={ruleNameStyle}>{section.name}</div>
      <div style={descriptionStyle}>{section.description}</div>
      <ol style={ruleListStyle}>
        {section.rules.map((rule, i) => (
          <li key={i} style={ruleItemStyle}>
            <span style={ruleNumberStyle}>{i + 1}</span>
            <span style={ruleTextStyle}>{rule}</span>
          </li>
        ))}
      </ol>
      <div style={antiPatternBoxStyle}>
        <span style={antiPatternLabelStyle}>Anti</span>
        <span style={antiPatternTextStyle}>{section.antiPattern}</span>
      </div>
    </div>
  );
}

function ChecklistCard({ items }: { items: readonly string[] }) {
  return (
    <div style={cardStyle}>
      <div style={sectionHeaderStyle}>Pre-Delivery</div>
      <div style={ruleNameStyle}>납품 전 체크리스트</div>
      <div style={descriptionStyle}>
        슬라이드 납품 전 아래 항목을 모두 확인한다. 하나라도 미통과 시 수정 후 재확인.
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 18,
                height: 18,
                borderRadius: 4,
                border: `1.5px solid rgba(0,188,212,0.5)`,
                background: 'rgba(0,188,212,0.05)',
                marginTop: 2,
                display: 'block',
              }}
            />
            <span style={{ fontSize: 13, color: TEXT_PRIMARY, lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComponentRulesPage() {
  const sections: RuleSection[] = [
    { index: 1, name: '뱃지/태그 일관성', ...badgeRules },
    { index: 2, name: '컨테이너 유동성', ...containerRules },
    { index: 3, name: '컬러 배경 위 가독성', ...colorContrastRules },
    { index: 4, name: '코드 블록', ...codeBlockRules },
    { index: 5, name: '줄바꿈', ...lineBreakRules },
    { index: 6, name: '스타일 간 일관성', ...styleConsistencyRules },
    { index: 7, name: '수직 배치', ...verticalPlacementRules },
    { index: 8, name: '헤드라인 스케일', description: headlineScaleRules.description, rules: headlineScaleRules.rules, antiPattern: headlineScaleRules.antiPattern },
    { index: 9, name: '비교 무게 차별화', description: comparisonWeightRules.description, rules: comparisonWeightRules.rules, antiPattern: comparisonWeightRules.antiPattern },
    { index: 10, name: '패턴 정체성 검증', description: patternIdentityRules.description, rules: patternIdentityRules.rules, antiPattern: patternIdentityRules.antiPattern },
    { index: 11, name: '콘텐츠 영역 상한선', description: contentAreaRules.description, rules: contentAreaRules.rules, antiPattern: contentAreaRules.antiPattern },
  ];

  return (
    <div
      style={{
        background: BG_BASE,
        minHeight: '100vh',
        padding: '48px 40px',
        fontFamily: "'Noto Sans KR', 'Noto Sans', system-ui, sans-serif",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: ACCENT,
            marginBottom: 10,
          }}
        >
          Theme System / Component Rules
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: TEXT_PRIMARY,
            margin: 0,
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          컴포넌트 & 레이아웃 정규화 규칙
        </h1>
        <p
          style={{
            fontSize: 15,
            color: TEXT_SECONDARY,
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 640,
            wordBreak: 'keep-all',
          }}
        >
          디자인 피드백에서 도출된 규칙. 모든 슬라이드/샘플 제작 시 반드시 준수.
          위반 시 시각적 일관성이 깨지거나 가독성이 떨어진다.
        </p>
      </div>

      {/* Rule cards */}
      {sections.map((section) => (
        <RuleCard key={section.index} section={section} />
      ))}

      {/* Checklist */}
      <ChecklistCard items={preDeliveryChecklist} />
    </div>
  );
}

const meta: Meta = {
  title: 'Theme System/Component Rules',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: BG_BASE }] },
  },
};

export default meta;

type Story = StoryObj;

export const All: Story = {
  name: 'Component Rules',
  render: () => <ComponentRulesPage />,
};
