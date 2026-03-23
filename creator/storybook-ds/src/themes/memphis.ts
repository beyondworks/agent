export const memphisTheme = {
  bgPage: '#FFF0E5',
  bgSlide: '#FFF8F0',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#8a8a8a',
  pink: '#FF71CE',
  yellow: '#FFCE5C',
  teal: '#86CCCA',
  purple: '#6A7BB4',
  border: '#000000',
  radius: '0px',
  borderWidth: '4px',
  fontHeading: "'Inter', 'Pretendard Variable', sans-serif",
  fontBody: "'Pretendard Variable', 'Inter', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
} as const;

/**
 * Memphis Design의 핵심: 그림자 색이 배경색과 다른 악센트 컬러.
 * 각 색상 카드마다 대비되는 색상으로 그림자를 넣어 오프셋 효과를 만든다.
 */
export const memphisShadowMap = {
  pink: `8px 8px 0 ${memphisTheme.yellow}`,
  yellow: `8px 8px 0 ${memphisTheme.pink}`,
  teal: `8px 8px 0 ${memphisTheme.purple}`,
  purple: `8px 8px 0 ${memphisTheme.pink}`,
  neutral: `8px 8px 0 ${memphisTheme.teal}`,
} as const;
