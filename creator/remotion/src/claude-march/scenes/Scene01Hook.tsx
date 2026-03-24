import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard, CountUp } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 850;

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
    <filter id="grain01">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain01)" />
  </svg>
);

// 글래스모피즘 수직 디바이더
const GlassDivider: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const scaleY = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        width: 1,
        height: 220,
        background:
          'linear-gradient(to bottom, transparent, rgba(255,197,5,0.4) 20%, rgba(255,197,5,0.4) 80%, transparent)',
        transform: `scaleY(${scaleY})`,
        transformOrigin: 'top center',
        opacity,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        alignSelf: 'center',
        flexShrink: 0,
      }}
    />
  );
};

// Block 1 — Split Screen: 46% / 접근성 최하위
const Block1: React.FC = () => {
  const frame = useCurrentFrame();

  // 위험 레이블 페이드인 (숫자보다 살짝 뒤)
  const dangerOpacity = interpolate(frame, [15, 30], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dangerY = interpolate(frame, [15, 30], [20, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        width: '100%',
        height: '100%',
      }}
    >
      {/* 좌: 46% */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <CountUp
            value={46}
            suffix="%"
            startFrame={0}
            duration={40}
            fontSize={160}
            color={fs.accent}
            style={{ lineHeight: 1, fontFamily: fs.font }}
          />
        </div>
        <SlideUpFade startFrame={6}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 22,
              color: fs.textDim,
              letterSpacing: fs.letterSpacing,
              textAlign: 'right',
              wordBreak: 'keep-all',
              lineHeight: 1.4,
            }}
          >
            시장 점유율 1위
          </div>
        </SlideUpFade>
      </div>

      {/* 디바이더 */}
      <GlassDivider startFrame={25} />

      {/* 우: 접근성 최하위 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          opacity: dangerOpacity,
          transform: `translateY(${dangerY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 52,
            fontWeight: 800,
            color: fs.danger,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
            lineHeight: 1.2,
          }}
        >
          접근성
          <br />
          최하위
        </div>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 18,
            color: 'rgba(255,77,77,0.6)',
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          사용자 만족도 조사
        </div>
      </div>
    </div>
  );
};

// Block 2 — 역설 선언
const Block2: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const show = frame >= startFrame;
  if (!show) return null;

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
        text="가장 유능한 도구가"
        startFrame={startFrame}
        stagger={5}
        fontSize={56}
        color={fs.text}
        fontWeight={700}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="가장 접근하기 어려운"
        startFrame={startFrame + 20}
        stagger={5}
        fontSize={56}
        color={fs.accent}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
      <SlideUpFade startFrame={startFrame + 55}>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 22,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          이 역설을 풀어드립니다
        </div>
      </SlideUpFade>
    </div>
  );
};

// Claude Code 로고 (SVG, #FFC505 단색)
const ClaudeCodeLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="rgba(255,197,5,0.12)" />
    <path
      d="M24 8C15.16 8 8 15.16 8 24s7.16 16 16 16 16-7.16 16-16S32.84 8 24 8zm-2 23l-2-2 6-6-6-6 2-2 8 8-8 8z"
      fill="#FFC505"
    />
    <path
      d="M18 17l2-2 8 8-8 8-2-2 6-6-6-6z"
      fill="#FFC505"
      opacity="0.6"
      transform="translate(-6, 0)"
    />
  </svg>
);

// Block 3 — 13 Releases / 100+ Changes 카운터
const Block3: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        width: '100%',
      }}
    >
      {/* 클로드코드 로고 + 라벨 */}
      <SlideUpFade startFrame={startFrame} duration={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ClaudeCodeLogo size={44} />
          <div style={{
            fontFamily: fs.english,
            fontSize: 26,
            fontWeight: 700,
            color: fs.accent,
            letterSpacing: '-0.01em',
          }}>
            Claude Code
          </div>
          <div style={{
            fontFamily: fs.font,
            fontSize: 16,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            marginLeft: 4,
          }}>
            2026년 3월
          </div>
        </div>
      </SlideUpFade>

    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 40,
        padding: '0 80px',
        width: '100%',
      }}
    >
      <GlassCard
        glow
        glowColor="accent"
        padding={48}
        style={{
          flex: 1,
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: interpolate(frame, [startFrame, startFrame + 16], [0, 1], {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [startFrame, startFrame + 16], [30, 0], {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <CountUp
          value={13}
          suffix=""
          startFrame={startFrame + 10}
          duration={40}
          fontSize={100}
          color={fs.accent}
        />
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 20,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            textAlign: 'center',
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          Releases
        </div>
      </GlassCard>

      <GlassCard
        glow
        glowColor="danger"
        padding={48}
        style={{
          flex: 1,
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: interpolate(frame, [startFrame + 8, startFrame + 24], [0, 1], {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [startFrame + 8, startFrame + 24], [30, 0], {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <CountUp
          value={100}
          suffix="+"
          startFrame={startFrame + 18}
          duration={40}
          fontSize={100}
          color={fs.danger}
        />
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 20,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            textAlign: 'center',
            wordBreak: 'keep-all',
            lineHeight: 1.4,
          }}
        >
          Changes
        </div>
      </GlassCard>
    </div>
    </div>
  );
};

// Block 4 — 기획자 관점 마무리
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
        gap: 24,
        padding: '0 100px',
      }}
    >
      <BlurReveal
        text="기획자 관점으로"
        startFrame={startFrame}
        stagger={5}
        fontSize={42}
        color={fs.textDim}
        fontWeight={600}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="진짜 의미 있는 것만"
        startFrame={startFrame + 15}
        stagger={5}
        fontSize={64}
        color={fs.text}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
      <SlideUpFade startFrame={startFrame + 50}>
        <GlassCard padding={24} style={{ marginTop: 8 }}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 20,
              color: fs.accent,
              letterSpacing: fs.letterSpacing,
              wordBreak: 'keep-all',
              lineHeight: 1.4,
            }}
          >
            골라드립니다
          </div>
        </GlassCard>
      </SlideUpFade>
    </div>
  );
};

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // 블록 전환 (각 블록 fade in-out)
  const getBlockOpacity = (inF: number, outF: number) =>
    interpolate(
      frame,
      [inF, inF + 20, outF - 20, outF],
      [0, 1, 1, 0],
      { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

  // Scene-out: 마지막 30f fade-out
  const sceneOutOpacity = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 블록별 표시 구간
  const b1 = { in: 0, out: 246 };
  const b2 = { in: 251, out: 395 };
  const b3 = { in: 400, out: 680 };
  const b4 = { in: 685, out: DURATION };

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

      {/* Block 2 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b2.in, b2.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block2 startFrame={b2.in} />
      </AbsoluteFill>

      {/* Block 3 */}
      <AbsoluteFill
        style={{
          opacity: getBlockOpacity(b3.in, b3.out),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Block3 startFrame={b3.in} />
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
    </AbsoluteFill>
  );
};
