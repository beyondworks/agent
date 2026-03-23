import { memphisTheme } from '../themes/memphis';

export const T = {
  // Readable
  headline: (scale: 'title' | 'section' | 'detail' = 'section') => ({
    fontFamily: memphisTheme.fontHeading,
    fontSize: scale === 'title' ? '3.5vw' : scale === 'detail' ? '1.6vw' : '2.2vw',
    fontWeight: scale === 'title' ? 900 : 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: memphisTheme.textPrimary,
    wordBreak: 'keep-all' as const,
  }),
  subheadline: {
    fontFamily: memphisTheme.fontBody,
    fontSize: '1.1vw',
    fontWeight: 400,
    lineHeight: 1.7,
    color: memphisTheme.textSecondary,
    wordBreak: 'keep-all' as const,
  },
  body: {
    fontFamily: memphisTheme.fontBody,
    fontSize: '0.85vw',
    fontWeight: 400,
    lineHeight: 1.75,
    color: memphisTheme.textSecondary,
    wordBreak: 'keep-all' as const,
  },
  caption: {
    fontFamily: memphisTheme.fontBody,
    fontSize: '0.65vw',
    fontWeight: 400,
    lineHeight: 1.6,
    color: memphisTheme.textMuted,
    wordBreak: 'keep-all' as const,
  },
  // Decorative
  marker: {
    fontFamily: memphisTheme.fontMono,
    fontSize: '0.52vw',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    opacity: 0.7,
    color: memphisTheme.textSecondary,
  },
  cli: {
    fontFamily: memphisTheme.fontMono,
    fontSize: '0.55vw',
    fontWeight: 400,
    letterSpacing: '0.05em',
    opacity: 0.35,
    color: memphisTheme.textMuted,
  },
  index: {
    fontFamily: memphisTheme.fontMono,
    fontSize: '1.2vw',
    fontWeight: 700,
    color: memphisTheme.purple,
  },
} as const;
