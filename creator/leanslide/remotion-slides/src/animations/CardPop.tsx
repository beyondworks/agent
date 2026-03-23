import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';

interface CardData {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CardPopProps {
  cards: CardData[];
  theme: {
    accent: string;
    bg: string;
    bgLight: string;
    text: string;
    textDim: string;
  };
  /** 카드 간 stagger 프레임 간격 (기본 8) */
  staggerDelay?: number;
  /** 카드 너비 px (기본 240) */
  cardWidth?: number;
}

export const CardPop: React.FC<CardPopProps> = ({
  cards,
  theme,
  staggerDelay = 8,
  cardWidth = 240,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {cards.map((card, i) => {
        const startFrame = i * staggerDelay;

        // 아래→위 슬라이드 + 페이드
        const translateY = interpolate(
          frame,
          [startFrame, startFrame + 15],
          [60, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          },
        );

        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        // spring 스케일 (pop 느낌)
        const scale = spring({
          frame: Math.max(0, frame - startFrame),
          fps,
          config: { damping: 10, stiffness: 180, mass: 0.7 },
        });

        // 레이어 깊이감: 뒤쪽 카드 살짝 작게 + 어둡게
        const depthScale = 1 - i * 0.02;
        const depthDim = 1 - i * 0.05;

        // 그림자 세기 (등장하면서 그림자 깊어짐)
        const shadowBlur = interpolate(
          frame,
          [startFrame, startFrame + 20],
          [0, 24],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <div
            key={i}
            style={{
              width: cardWidth,
              padding: 24,
              borderRadius: 16,
              background: theme.bgLight,
              border: `1px solid rgba(255,255,255,0.06)`,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale * depthScale})`,
              boxShadow: `0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0,0,0,0.4)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              filter: `brightness(${depthDim})`,
            }}
          >
            {/* 아이콘 */}
            {card.icon && (
              <div style={{ fontSize: 28 }}>{card.icon}</div>
            )}

            {/* 제목 */}
            <div
              style={{
                color: theme.text,
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </div>

            {/* 설명 */}
            {card.description && (
              <div
                style={{
                  color: theme.textDim,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {card.description}
              </div>
            )}

            {/* 하단 accent 라인 */}
            <div
              style={{
                height: 2,
                borderRadius: 1,
                background: theme.accent,
                opacity: 0.4,
                width: interpolate(
                  frame,
                  [startFrame + 10, startFrame + 25],
                  [0, 100],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
                // width를 %로
                maxWidth: '100%',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
