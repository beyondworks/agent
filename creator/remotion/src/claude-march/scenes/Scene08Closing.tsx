import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 955;

// Grain texture overlay
const GrainOverlay: React.FC = () => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.03,
      pointerEvents: 'none',
    }}
  >
    <filter id="grain08">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain08)" />
  </svg>
);

// 아이콘: 파형 (음성 지시)
const WaveformIcon: React.FC<{ color?: string; size?: number }> = ({
  color = fs.accent,
  size = 28,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="2" y="10" width="2.5" height="8" rx="1.25" fill={color} opacity={0.5} />
    <rect x="6" y="6" width="2.5" height="16" rx="1.25" fill={color} opacity={0.7} />
    <rect x="10" y="3" width="2.5" height="22" rx="1.25" fill={color} />
    <rect x="14" y="7" width="2.5" height="14" rx="1.25" fill={color} opacity={0.8} />
    <rect x="18" y="10" width="2.5" height="8" rx="1.25" fill={color} opacity={0.6} />
    <rect x="22" y="12" width="2.5" height="4" rx="1.25" fill={color} opacity={0.4} />
  </svg>
);

// 아이콘: 연결선 (끊기지 않는 흐름)
const FlowIcon: React.FC<{ color?: string; size?: number }> = ({
  color = fs.accent,
  size = 28,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="5" cy="14" r="3" stroke={color} strokeWidth="2" />
    <circle cx="23" cy="14" r="3" stroke={color} strokeWidth="2" />
    <path
      d="M8 14 C 10 14, 12 8, 14 8 C 16 8, 18 20, 20 20"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// 아이콘: 슬라이더 (사고 깊이 제어)
const SliderIcon: React.FC<{ color?: string; size?: number }> = ({
  color = fs.accent,
  size = 28,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="3" y1="8" x2="25" y2="8" stroke={color} strokeWidth="2" strokeOpacity={0.3} strokeLinecap="round" />
    <circle cx="18" cy="8" r="3.5" fill={color} />
    <line x1="3" y1="16" x2="25" y2="16" stroke={color} strokeWidth="2" strokeOpacity={0.3} strokeLinecap="round" />
    <circle cx="10" cy="16" r="3.5" fill={color} opacity={0.7} />
    <line x1="3" y1="24" x2="25" y2="24" stroke={color} strokeWidth="2" strokeOpacity={0.3} strokeLinecap="round" />
    <circle cx="20" cy="24" r="3.5" fill={color} opacity={0.5} />
  </svg>
);

interface KeywordCardProps {
  index: number;
  icon: React.ReactNode;
  label: string;
  startFrame: number;
  /** 전체 카드가 수렴 후 뒤로 물러나는 시작 프레임 */
  receedFrame?: number;
}

const KeywordCard: React.FC<KeywordCardProps> = ({
  index,
  icon,
  label,
  startFrame,
  receedFrame,
}) => {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterY = interpolate(frame, [startFrame, startFrame + 20], [40, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 뒤로 물러남 (scale down + fade)
  const receedScale =
    receedFrame != null
      ? interpolate(frame, [receedFrame, receedFrame + 40], [1, 0.9], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
  const receedOpacity =
    receedFrame != null
      ? interpolate(frame, [receedFrame, receedFrame + 40], [1, 0.3], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  return (
    <div
      style={{
        opacity: enterOpacity * receedOpacity,
        transform: `translateY(${enterY}px) scale(${receedScale})`,
        transformOrigin: 'center bottom',
      }}
    >
      <GlassCard
        glow={index === 0}
        glowColor="accent"
        padding={28}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          minWidth: 320,
        }}
      >
        {/* 순번 */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `1.5px solid rgba(255,197,5,0.4)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 14,
              fontWeight: 700,
              color: fs.accent,
              lineHeight: 1,
            }}
          >
            {index + 1}
          </span>
        </div>

        {/* 아이콘 */}
        <div style={{ flexShrink: 0 }}>{icon}</div>

        {/* 레이블 */}
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 20,
            fontWeight: 700,
            color: fs.text,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
      </GlassCard>
    </div>
  );
};

// Block 1 — "딱 세 가지만 기억하시면"
const Block1: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
        padding: '0 120px',
      }}
    >
      <SlideUpFade startFrame={0} distance={20}>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 28,
            fontWeight: 600,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
          }}
        >
          딱
        </div>
      </SlideUpFade>
      <BlurReveal
        text="세 가지만"
        startFrame={8}
        stagger={5}
        fontSize={96}
        color={fs.accent}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
      <SlideUpFade startFrame={25} distance={20}>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 28,
            fontWeight: 600,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
          }}
        >
          기억하시면 됩니다
        </div>
      </SlideUpFade>
    </div>
  );
};

// Block 2+3 — 3개 카드 순차 등장 (Z-Axis Cascade 유지)
const Block23Cards: React.FC<{ b2Start: number; b3Start: number; receedFrame: number }> = ({
  b2Start,
  b3Start,
  receedFrame,
}) => {
  const frame = useCurrentFrame();
  if (frame < b2Start) return null;

  const cards = [
    {
      icon: <WaveformIcon />,
      label: '음성 지시',
      startFrame: b2Start,
    },
    {
      icon: <FlowIcon />,
      label: '끊기지 않는 흐름',
      startFrame: b2Start + 50,
    },
    {
      icon: <SliderIcon />,
      label: '사고 깊이 제어',
      startFrame: b3Start,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {cards.map((card, i) => (
        <KeywordCard
          key={card.label}
          index={i}
          icon={card.icon}
          label={card.label}
          startFrame={card.startFrame}
          receedFrame={i < 3 ? receedFrame : undefined}
        />
      ))}
    </div>
  );
};

// Block 4 — "도구는 계속 바뀝니다. 뭘 만들지, 왜 만들지"
const Block4: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 20,
        padding: '0 120px',
      }}
    >
      <BlurReveal
        text="도구는 계속 바뀝니다"
        startFrame={startFrame}
        stagger={5}
        fontSize={44}
        color={fs.textDim}
        fontWeight={600}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="뭘 만들지"
        startFrame={startFrame + 25}
        stagger={6}
        fontSize={64}
        color={fs.text}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="왜 만들지"
        startFrame={startFrame + 50}
        stagger={6}
        fontSize={64}
        color={fs.accent}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
    </div>
  );
};

// Block 5 — "AI 포모가 사라지는 날까지" + 채널 로고
const Block5: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  // 배경 어두워지기
  const bgDark = interpolate(frame, [startFrame, startFrame + 40], [0, 0.5], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 채널 로고 페이드인
  const logoOpacity = interpolate(frame, [startFrame + 60, startFrame + 90], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* 배경 다크닝 오버레이 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `rgba(0,0,0,${bgDark})`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 24,
          padding: '0 100px',
          width: '100%',
        }}
      >
        <BlurReveal
          text="AI 포모가"
          startFrame={startFrame}
          stagger={6}
          fontSize={52}
          color={fs.textDim}
          fontWeight={600}
          style={{ justifyContent: 'center' }}
        />
        <BlurReveal
          text="사라지는 날까지"
          startFrame={startFrame + 20}
          stagger={5}
          fontSize={52}
          color={fs.text}
          fontWeight={700}
          style={{ justifyContent: 'center' }}
        />

        {/* 채널 로고 중앙 하단 */}
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: logoOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 48,
              height: 2,
              background: `linear-gradient(to right, transparent, ${fs.accent}, transparent)`,
              borderRadius: 1,
              marginBottom: 4,
            }}
          />
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 18,
              fontWeight: 800,
              color: fs.accent,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            김효율의 AI 개발단
          </div>
        </div>
      </div>
    </>
  );
};

export const Scene08Closing: React.FC = () => {
  const frame = useCurrentFrame();

  const getBlockOpacity = (inF: number, outF: number) =>
    interpolate(frame, [inF, inF + 20, outF - 20, outF], [0, 1, 1, 0], {
      easing: ease,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // Scene-out: 마지막 30f fade-out
  const sceneOutOpacity = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 블록 구간 (명세 기준)
  const b1 = { in: 0, out: 150 };
  // b2 (f146) + b3 (f368) 는 카드 레이어로 함께 표시
  const b23 = { in: 146, out: 492 };
  const b4 = { in: 488, out: 731 };
  const b5 = { in: 727, out: DURATION };

  // 카드들이 뒤로 물러나기 시작하는 시점 = b4 진입 직전
  const cardsReceedFrame = 483;

  return (
    <AbsoluteFill style={{ background: fs.bg, opacity: sceneOutOpacity }}>
      <GrainOverlay />

      {/* Block 1 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b1.in, b1.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block1 />
      </AbsoluteFill>

      {/* Block 2+3: 카드 레이어 — 수렴 후 뒤로 물러남 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b23.in, b23.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block23Cards
          b2Start={b23.in + 9}
          b3Start={368}
          receedFrame={cardsReceedFrame}
        />
      </AbsoluteFill>

      {/* Block 4 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b4.in, b4.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block4 startFrame={b4.in} />
      </AbsoluteFill>

      {/* Block 5 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b5.in, b5.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block5 startFrame={b5.in} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
