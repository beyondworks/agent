import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard } from '../components';

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 684;
const FADE_START = DURATION - 30;

// 카드 데이터
const CARDS = [
  { title: '보이스모드', keyword: '진입장벽', detail: 'AI 음성 모드' },
  { title: '채널즈', keyword: '맥락 전환', detail: '프로젝트 격리' },
  { title: '100만 토큰', keyword: '정보 손실', detail: '긴 컨텍스트' },
];

// Grain 텍스처 오버레이
const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.035,
      pointerEvents: 'none',
      zIndex: 100,
    }}
  >
    <filter id="grain05">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain05)" />
  </svg>
);

// 카드 컴포넌트
const FrictionCard: React.FC<{
  title: string;
  keyword: string;
  detail: string;
  startFrame: number;
  isActive: boolean;
}> = ({ title, keyword, detail, startFrame, isActive }) => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardY = interpolate(frame, [startFrame, startFrame + 20], [30, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowOpacity = interpolate(frame, [startFrame + 10, startFrame + 30], [0, isActive ? 1 : 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
        flex: 1,
        maxWidth: 300,
      }}
    >
      <GlassCard
        glow={isActive}
        glowColor="accent"
        padding={36}
        style={{
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          border: isActive
            ? `1px solid rgba(255,197,5,0.35)`
            : fs.card.border,
        }}
      >
        {/* 상단 골드 선 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${fs.accent}, transparent)`,
            opacity: glowOpacity,
          }}
        />

        <div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 13,
              fontWeight: 500,
              color: fs.textMuted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {detail}
          </div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 22,
              fontWeight: 700,
              color: fs.text,
              letterSpacing: fs.letterSpacing,
              lineHeight: 1.3,
              wordBreak: 'keep-all',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            fontFamily: fs.font,
            fontSize: 28,
            fontWeight: 800,
            color: fs.accent,
            letterSpacing: '-0.03em',
          }}
        >
          {keyword}
        </div>
      </GlassCard>
    </div>
  );
};

// 연결선
const ConnectorLine: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        width: '100%',
        position: 'relative',
        height: 2,
        marginTop: -100,
        marginBottom: 0,
        zIndex: 0,
      }}
    >
      {/* 왼쪽 카드 → 중간 카드 */}
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, rgba(255,197,5,0.6), rgba(255,197,5,0.3))`,
          width: `${progress * 33}%`,
          marginLeft: '16.5%',
          transition: 'none',
        }}
      />
    </div>
  );
};

// 상위 레이블 "마찰 감소"
const UnifiedLabel: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [startFrame, startFrame + 25], [0.85, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* 브래킷 라인 */}
      <div
        style={{
          width: 680,
          height: 1,
          background: `linear-gradient(90deg, transparent 5%, rgba(255,197,5,0.4) 20%, rgba(255,197,5,0.4) 80%, transparent 95%)`,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 28,
            height: 1,
            background: `rgba(255,197,5,0.4)`,
          }}
        />
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 15,
            fontWeight: 600,
            color: fs.accent,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          마찰 감소 (Friction Reduction)
        </div>
        <div
          style={{
            width: 28,
            height: 1,
            background: `rgba(255,197,5,0.4)`,
          }}
        />
      </div>
    </div>
  );
};

// 우측 실루엣 카드들 (다음 씬 예고)
const SilhouetteCards: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 35], [0, 0.18], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateX = interpolate(frame, [startFrame, startFrame + 35], [60, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 60,
        top: '50%',
        transform: `translateY(-50%) translateX(${translateX}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 120,
            height: 60,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  );
};

export const Scene05Summary: React.FC = () => {
  const frame = useCurrentFrame();

  // sceneOut fade
  const sceneOpacity = interpolate(frame, [FADE_START, DURATION], [1, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 블록 [31] f0: 카드 등장 — 각 카드는 키 프레이즈보다 9-15f 앞서
  // 카드 1: f0-15, 카드 2: f20-35, 카드 3: f40-55
  const card1Start = 0;
  const card2Start = 20;
  const card3Start = 40;

  // 블록 [32] f289: "세 개 다 도구와..." 텍스트 → 연결선 + 레이블
  // 연결선은 f274 (15f 앞), 레이블은 f289
  const lineStart = 274;
  const labelStart = 289;

  // 연결선 progress (카드들을 가로로 잇는 라인)
  const lineProgress = interpolate(frame, [lineStart, lineStart + 50], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 블록 [33] f483: "나머지 세 가지는..." 텍스트 → 실루엣 카드
  // 실루엣은 f468 (15f 앞)
  const silhouetteStart = 468;

  // 카드 활성화 상태 (레이블 등장 후)
  const cardsActive = frame >= labelStart + 10;

  return (
    <AbsoluteFill style={{ background: fs.bg, opacity: sceneOpacity }}>
      <GrainOverlay />

      {/* 배경 glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(255,197,5,0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 메인 레이아웃 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          padding: '0 80px',
        }}
      >
        {/* 블록 [31] 자막 영역 */}
        <SlideUpFade startFrame={card1Start} style={{ marginBottom: 60, textAlign: 'center' }}>
          <BlurReveal
            text="보이스모드는 진입장벽을, 채널즈는 맥락 전환을, 100만 토큰은 정보 손실을"
            startFrame={card1Start}
            fontSize={22}
            color={fs.textDim}
            stagger={3}
            style={{ justifyContent: 'center', maxWidth: 860, lineHeight: 1.4 }}
          />
        </SlideUpFade>

        {/* 3카드 가로 정렬 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
            width: '100%',
            maxWidth: 980,
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <FrictionCard
            title="보이스모드"
            keyword="진입장벽"
            detail="AI 음성 모드"
            startFrame={card1Start}
            isActive={cardsActive}
          />
          <FrictionCard
            title="채널즈"
            keyword="맥락 전환"
            detail="프로젝트 격리"
            startFrame={card2Start}
            isActive={cardsActive}
          />
          <FrictionCard
            title="100만 토큰"
            keyword="정보 손실"
            detail="긴 컨텍스트"
            startFrame={card3Start}
            isActive={cardsActive}
          />
        </div>

        {/* 연결선 (카드 아래, 레이블 위) */}
        <div
          style={{
            width: '100%',
            maxWidth: 980,
            height: 32,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '8%',
              right: '8%',
              height: 1,
              background: `linear-gradient(90deg, transparent, rgba(255,197,5,0.5) 30%, rgba(255,197,5,0.5) 70%, transparent)`,
              transform: `scaleX(${lineProgress})`,
              transformOrigin: 'center',
            }}
          />
          {/* 연결 수직선 3개 */}
          {[0.19, 0.5, 0.81].map((pos, i) => {
            const dotOpacity = interpolate(
              frame,
              [lineStart + i * 8, lineStart + i * 8 + 12],
              [0, lineProgress],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${pos * 100}%`,
                  top: 0,
                  width: 1,
                  height: 16,
                  background: `rgba(255,197,5,0.5)`,
                  opacity: dotOpacity,
                }}
              />
            );
          })}
        </div>

        {/* 상위 레이블 "마찰 감소" */}
        <UnifiedLabel startFrame={labelStart} />

        {/* 블록 [32] 자막 */}
        {frame >= 289 && (
          <SlideUpFade startFrame={289} style={{ marginTop: 48, textAlign: 'center' }}>
            <BlurReveal
              text="세 개 다 도구와 사람 사이의 마찰을 깎아내는"
              startFrame={289}
              fontSize={28}
              color={fs.text}
              fontWeight={700}
              stagger={4}
              style={{ justifyContent: 'center', lineHeight: 1.4 }}
            />
          </SlideUpFade>
        )}

        {/* 블록 [33] 자막 */}
        {frame >= 483 && (
          <SlideUpFade startFrame={483} style={{ marginTop: 16, textAlign: 'center' }}>
            <BlurReveal
              text="나머지 세 가지는 결이 좀 다릅니다"
              startFrame={483}
              fontSize={24}
              color={fs.textDim}
              fontWeight={500}
              stagger={4}
              style={{ justifyContent: 'center', lineHeight: 1.4 }}
            />
          </SlideUpFade>
        )}
      </div>

      {/* 우측 실루엣 예고 카드 */}
      <SilhouetteCards startFrame={silhouetteStart} />
    </AbsoluteFill>
  );
};
