import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, CountUp } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 1030;

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
    <filter id="grain07">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain07)" />
  </svg>
);

// 배경: 경쟁 도구 로고 텍스트 흐릿하게
const CompetitorBg: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 120,
      opacity: opacity * 0.07,
      pointerEvents: 'none',
    }}
  >
    {['Cursor', 'Copilot', 'Windsurf'].map((name) => (
      <div
        key={name}
        style={{
          fontFamily: fs.english,
          fontSize: 48,
          fontWeight: 800,
          color: fs.accent,
          letterSpacing: '-0.03em',
          filter: 'blur(2px)',
        }}
      >
        {name}
      </div>
    ))}
  </div>
);

// 도넛 차트 SVG — 클로드코드 46% 세그먼트
const DonutChart: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame - 15) return null;

  const r = 110;
  const cx = 140;
  const cy = 140;
  const circumference = 2 * Math.PI * r;

  // 전체 링 (기타 54%)
  const bgArcOpacity = interpolate(frame, [startFrame - 15, startFrame], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 클로드코드 46% 세그먼트 채움 애니메이션
  const fillProgress = interpolate(frame, [startFrame, startFrame + 50], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const claudeArc = circumference * 0.46 * fillProgress;
  const offset = circumference * 0.25; // 12시 방향에서 시작

  // 레이블 opacity
  const labelOpacity = interpolate(frame, [startFrame + 40, startFrame + 60], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelY = interpolate(frame, [startFrame + 40, startFrame + 60], [10, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // glow 강도
  const glowOpacity = interpolate(frame, [startFrame + 30, startFrame + 60], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      <svg width={280} height={280} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="glowFilter07">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 배경 링 */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={24}
          opacity={bgArcOpacity}
        />

        {/* 클로드코드 46% — 골드 */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={fs.accent}
          strokeWidth={24}
          strokeDasharray={`${claudeArc} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={`url(#glowFilter07)`}
          opacity={glowOpacity}
        />
      </svg>

      {/* 중앙 레이블 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 52,
            fontWeight: 800,
            color: fs.accent,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          46%
        </div>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 14,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
          }}
        >
          Claude Code
        </div>
      </div>
    </div>
  );
};

// 개발자→비개발자 방향 화살표
const TransitionArrow: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame - 10) return null;

  const opacity = interpolate(frame, [startFrame - 10, startFrame + 10], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scaleX = interpolate(frame, [startFrame, startFrame + 20], [0.4, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'left center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* 출발 레이블 */}
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 16,
            fontWeight: 700,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            whiteSpace: 'nowrap',
            padding: '6px 14px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
          }}
        >
          개발자
        </div>

        {/* 화살표 라인 + glow */}
        <div
          style={{
            width: 80,
            height: 2,
            background: `linear-gradient(to right, rgba(255,197,5,0.4), ${fs.accent})`,
            boxShadow: `0 0 12px rgba(255,197,5,0.6)`,
            flexShrink: 0,
          }}
        />

        {/* 화살표 헤드 */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderLeft: `12px solid ${fs.accent}`,
            filter: `drop-shadow(0 0 6px rgba(255,197,5,0.8))`,
            flexShrink: 0,
          }}
        />

        {/* 도착 레이블 */}
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 16,
            fontWeight: 700,
            color: fs.accent,
            letterSpacing: fs.letterSpacing,
            whiteSpace: 'nowrap',
            padding: '6px 14px',
            border: `1px solid rgba(255,197,5,0.4)`,
            borderRadius: 24,
            boxShadow: `0 0 16px rgba(255,197,5,0.15)`,
          }}
        >
          비개발자
        </div>
      </div>
    </div>
  );
};

// Block 1 — "왜 3월에 이렇게 쏟아냈을까"
const Block1: React.FC = () => {
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
        text="왜 3월에 이렇게"
        startFrame={0}
        stagger={5}
        fontSize={64}
        color={fs.text}
        fontWeight={700}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="쏟아냈을까"
        startFrame={20}
        stagger={5}
        fontSize={64}
        color={fs.accent}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
    </div>
  );
};

// Block 2 — "$8.5B market / 개발자 55%"  Split Screen
const Block2: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  // 우측 stats
  const devBarWidth = interpolate(frame, [startFrame + 30, startFrame + 60], [0, 55], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const statsOpacity = interpolate(frame, [startFrame + 20, startFrame + 40], [0, 1], {
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
        gap: 80,
        width: '100%',
        height: '100%',
        padding: '0 80px',
      }}
    >
      {/* 좌: $8.5B CountUp */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 12,
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 40,
              fontWeight: 800,
              color: fs.accent,
              marginTop: 16,
              marginRight: 4,
              letterSpacing: '-0.02em',
            }}
          >
            $
          </span>
          <CountUp
            value={85}
            suffix=""
            startFrame={startFrame}
            duration={50}
            fontSize={120}
            color={fs.accent}
            style={{ lineHeight: 1 }}
          />
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 40,
              fontWeight: 800,
              color: fs.accent,
              marginTop: 16,
              marginLeft: 4,
              letterSpacing: '-0.02em',
            }}
          >
            억
          </span>
        </div>
        <SlideUpFade startFrame={startFrame + 10}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 18,
              color: fs.textDim,
              letterSpacing: fs.letterSpacing,
              textAlign: 'right',
              wordBreak: 'keep-all',
              lineHeight: 1.4,
            }}
          >
            AI 코딩 어시스턴트 시장 규모
          </div>
        </SlideUpFade>
      </div>

      {/* 수직 디바이더 */}
      <div
        style={{
          width: 1,
          height: 200,
          background:
            'linear-gradient(to bottom, transparent, rgba(255,197,5,0.3) 20%, rgba(255,197,5,0.3) 80%, transparent)',
          flexShrink: 0,
        }}
      />

      {/* 우: 개발자 55% 바 차트 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          flex: 1,
          opacity: statsOpacity,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 16,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
              }}
            >
              개발자
            </span>
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 20,
                fontWeight: 700,
                color: fs.accent,
                letterSpacing: '-0.02em',
              }}
            >
              55%
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${devBarWidth}%`,
                background: `linear-gradient(to right, ${fs.accent}, ${fs.accentLight})`,
                borderRadius: 4,
                boxShadow: `0 0 12px rgba(255,197,5,0.5)`,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 16,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
              }}
            >
              비개발자
            </span>
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 20,
                fontWeight: 700,
                color: fs.textMuted,
                letterSpacing: '-0.02em',
              }}
            >
              45%
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${interpolate(frame, [startFrame + 40, startFrame + 70], [0, 45], {
                  easing: ease,
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}%`,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Block 3 — "런레이트 25억, 스타트업 75%" + 도넛 차트
const Block3: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 80,
        width: '100%',
        height: '100%',
        padding: '0 80px',
      }}
    >
      {/* 좌: 런레이트 숫자 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 16,
          flex: 1,
        }}
      >
        <SlideUpFade startFrame={startFrame} distance={30}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 18,
              color: fs.textDim,
              letterSpacing: fs.letterSpacing,
              textAlign: 'right',
              wordBreak: 'keep-all',
            }}
          >
            연간 런레이트
          </div>
        </SlideUpFade>
        <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 32,
              fontWeight: 800,
              color: fs.accent,
              marginTop: 10,
              marginRight: 4,
              letterSpacing: '-0.02em',
            }}
          >
            $
          </span>
          <CountUp
            value={25}
            suffix=""
            startFrame={startFrame + 10}
            duration={40}
            fontSize={96}
            color={fs.accent}
            style={{ lineHeight: 1 }}
          />
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 32,
              fontWeight: 800,
              color: fs.accent,
              marginTop: 10,
              marginLeft: 4,
              letterSpacing: '-0.02em',
            }}
          >
            억
          </span>
        </div>
        <SlideUpFade startFrame={startFrame + 20}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 15,
              color: 'rgba(255,197,5,0.5)',
              letterSpacing: fs.letterSpacing,
              textAlign: 'right',
              wordBreak: 'keep-all',
            }}
          >
            전년比 +312%
          </div>
        </SlideUpFade>
      </div>

      {/* 수직 디바이더 */}
      <div
        style={{
          width: 1,
          height: 200,
          background:
            'linear-gradient(to bottom, transparent, rgba(255,197,5,0.3) 20%, rgba(255,197,5,0.3) 80%, transparent)',
          flexShrink: 0,
        }}
      />

      {/* 우: 도넛 차트 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 20,
          flex: 1,
        }}
      >
        <SlideUpFade startFrame={startFrame + 5} distance={20}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 16,
              color: fs.textDim,
              letterSpacing: fs.letterSpacing,
              wordBreak: 'keep-all',
            }}
          >
            Claude Code 사용 고객
          </div>
        </SlideUpFade>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <DonutChart startFrame={startFrame + 15} />
          {/* 범례 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '스타트업', value: '75%', color: fs.accent },
              { label: '엔터프라이즈', value: '25%', color: 'rgba(255,255,255,0.3)' },
            ].map(({ label, value, color }, i) => {
              const itemOpacity = interpolate(
                frame,
                [startFrame + 50 + i * 10, startFrame + 70 + i * 10],
                [0, 1],
                { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    opacity: itemOpacity,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: color,
                      boxShadow: i === 0 ? `0 0 8px rgba(255,197,5,0.6)` : 'none',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: fs.font,
                      fontSize: 15,
                      color: fs.textDim,
                      letterSpacing: fs.letterSpacing,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: fs.font,
                      fontSize: 15,
                      fontWeight: 700,
                      color,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Block 4 — "비개발자 사용자층을 잡아야" + 화살표
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
        gap: 32,
        padding: '0 120px',
      }}
    >
      <BlurReveal
        text="비개발자 사용자층을"
        startFrame={startFrame}
        stagger={5}
        fontSize={56}
        color={fs.text}
        fontWeight={700}
        style={{ justifyContent: 'center' }}
      />
      <BlurReveal
        text="잡아야 한다"
        startFrame={startFrame + 20}
        stagger={5}
        fontSize={56}
        color={fs.accent}
        fontWeight={800}
        style={{ justifyContent: 'center' }}
      />
      <SlideUpFade startFrame={startFrame + 40} distance={20}>
        <TransitionArrow startFrame={startFrame + 50} />
      </SlideUpFade>
    </div>
  );
};

export const Scene07Market: React.FC = () => {
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

  // 배경 경쟁사 로고 전체 씬 opacity
  const bgLogoOpacity = interpolate(frame, [20, 60], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const b1 = { in: 0, out: 186 };
  const b2 = { in: 191, out: 457 };
  const b3 = { in: 462, out: 716 };
  const b4 = { in: 721, out: DURATION };

  return (
    <AbsoluteFill style={{ background: fs.bg, opacity: sceneOutOpacity }}>
      <GrainOverlay />
      <CompetitorBg opacity={bgLogoOpacity} />

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
