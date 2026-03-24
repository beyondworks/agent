import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard, CountUp } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function fadeIn(frame: number, start: number, dur = 20) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function slideY(frame: number, start: number, from: number, dur = 22) {
  return interpolate(frame, [start, start + dur], [from, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/** Grain 오버레이 */
const Grain: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
      backgroundSize: '256px 256px',
      pointerEvents: 'none',
      zIndex: 100,
      opacity: 0.35,
    }}
  />
);

/** 문서 아이콘 카드 */
const DocIcon: React.FC<{
  emoji: string;
  label: string;
  frame: number;
  startFrame: number;
  stackIndex: number;
  absorbed?: boolean;
  absorbFrame?: number;
}> = ({ emoji, label, frame, startFrame, stackIndex, absorbed = false, absorbFrame = 9999 }) => {
  const op = fadeIn(frame, startFrame, 16);
  const ty = slideY(frame, startFrame, 30, 16);

  // 흡수 애니메이션: absorbFrame 이후 scale + opacity 축소
  const absorbProgress = interpolate(
    frame,
    [absorbFrame, absorbFrame + 30],
    [0, 1],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const absorbScale = absorbed ? interpolate(absorbProgress, [0, 1], [1, 0.3]) : 1;
  const absorbOpacity = absorbed ? interpolate(absorbProgress, [0, 1], [1, 0]) : 1;
  const absorbX = absorbed
    ? interpolate(absorbProgress, [0, 1], [0, 80])
    : 0;

  return (
    <div
      style={{
        opacity: op * absorbOpacity,
        transform: `translateY(${ty}px) translateX(${absorbX}px) scale(${absorbScale})`,
        marginTop: 0,
        zIndex: 10 - stackIndex,
        position: 'relative',
      }}
    >
      <GlassCard
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: 260,
        }}
      >
        <span style={{ fontSize: 28 }}>{emoji}</span>
        <span
          style={{
            fontFamily: fs.font,
            fontSize: 18,
            color: fs.text,
            letterSpacing: fs.letterSpacing,
            wordBreak: 'keep-all',
          }}
        >
          {label}
        </span>
      </GlassCard>
    </div>
  );
};

/** 비교 카드: 요약본 vs 원본 */
const ComparisonCard: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const op = fadeIn(frame, startFrame, 24);
  const ty = slideY(frame, startFrame, 40, 24);

  // 취소선 진행
  const strikeProgress = interpolate(
    frame,
    [startFrame + 30, startFrame + 55],
    [0, 1],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{ opacity: op, transform: `translateY(${ty}px)` }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
        {/* 요약본 — 취소선 */}
        <GlassCard
          style={{
            flex: 1,
            padding: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 15,
              color: fs.textMuted,
              marginBottom: 8,
              letterSpacing: fs.letterSpacing,
            }}
          >
            요약본
          </div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 48,
              fontWeight: 800,
              color: fs.textDim,
              letterSpacing: '-0.03em',
            }}
          >
            10p
          </div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 14,
              color: fs.textMuted,
              marginTop: 4,
              letterSpacing: fs.letterSpacing,
            }}
          >
            맥락 손실 있음
          </div>
          {/* 취소선 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              height: 3,
              width: `${strikeProgress * 100}%`,
              background: fs.danger,
              transform: 'translateY(-50%)',
              boxShadow: `0 0 8px rgba(255,77,77,0.6)`,
            }}
          />
        </GlassCard>

        {/* 원본 — 하이라이트 */}
        <GlassCard
          style={{
            flex: 1,
            padding: 24,
            borderColor: 'rgba(255,197,5,0.4)',
            background: 'rgba(255,197,5,0.06)',
          }}
          glow
        >
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 15,
              color: fs.accent,
              marginBottom: 8,
              letterSpacing: fs.letterSpacing,
            }}
          >
            원본 전달
          </div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 48,
              fontWeight: 800,
              color: fs.accent,
              letterSpacing: '-0.03em',
            }}
          >
            50p
          </div>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 14,
              color: fs.accentLight,
              marginTop: 4,
              letterSpacing: fs.letterSpacing,
            }}
          >
            맥락 완전 보존
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

/** 오퍼스 4.6 뱃지 */
const OpusBadge: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const op = fadeIn(frame, startFrame, 28);
  const scale = interpolate(
    frame,
    [startFrame, startFrame + 28],
    [0.8, 1],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, rgba(255,197,5,0.2), rgba(255,197,5,0.05))`,
          border: `2px solid ${fs.accent}`,
          borderRadius: 16,
          padding: '20px 32px',
          textAlign: 'center',
          boxShadow: `${fs.glow('accent', 0.25)}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div
          style={{
            fontFamily: fs.english,
            fontSize: 13,
            color: fs.accent,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          NEW MODEL
        </div>
        <div
          style={{
            fontFamily: fs.english,
            fontSize: 32,
            fontWeight: 800,
            color: fs.text,
            letterSpacing: '-0.02em',
          }}
        >
          Claude Opus 4.6
        </div>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 16,
            color: fs.accent,
            marginTop: 6,
            letterSpacing: fs.letterSpacing,
          }}
        >
          오퍼스 4.6 모델
        </div>
      </div>
    </div>
  );
};

export const Scene04Context: React.FC = () => {
  const frame = useCurrentFrame();
  const DURATION = 1807;

  // sceneOut
  const sceneOutOpacity = interpolate(
    frame,
    [DURATION - 30, DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 블록 타이밍 (timing_v2)
  const B23 = 0;
  const B24 = 244;
  const B25 = 426;
  const B26 = 603;
  const B27 = 854;
  const B28 = 1146;
  const B29 = 1417;
  const B30 = 1541;

  // 문서 흡수 시점 (B27 이후 터미널로)
  const absorbStart = B27 + 60;

  // 좌/우 레이아웃 전환 (B28 기준으로 비교 카드 등장)
  const compareStart = B28 - 9;

  return (
    <AbsoluteFill
      style={{
        background: fs.bg,
        opacity: sceneOutOpacity,
        fontFamily: fs.font,
        overflow: 'hidden',
      }}
    >
      <Grain />

      {/* ══════════════════════════════════════
          ZIG-ZAG 레이아웃: 좌/우 교번
      ══════════════════════════════════════ */}

      {/* ─── ROW 1: 좌—숫자 카운트, 우—문서 스택 ─── */}

      {/* 좌: 컨텍스트 윈도우 카운트 (B23) */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 80,
          width: 480,
        }}
      >
        <SlideUpFade startFrame={B23} duration={22}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 22,
              color: fs.textDim,
              letterSpacing: fs.letterSpacing,
              marginBottom: 16,
              wordBreak: 'keep-all',
            }}
          >
            컨텍스트 윈도우
          </div>
        </SlideUpFade>

        {/* 200K → 1M 전환 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* 200K */}
          <div
            style={{
              opacity: fadeIn(frame, B23 + 8, 18),
              transform: `translateY(${slideY(frame, B23 + 8, 24, 18)}px)`,
            }}
          >
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 64,
                fontWeight: 800,
                color: fs.textDim,
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                textDecoration: 'line-through',
                textDecorationColor: fs.danger,
              }}
            >
              200K
            </span>
          </div>

          {/* 화살표 */}
          <div
            style={{
              opacity: fadeIn(frame, B23 + 20, 14),
              fontSize: 36,
              color: fs.accent,
            }}
          >
            →
          </div>

          {/* 1M CountUp */}
          <div
            style={{
              opacity: fadeIn(frame, B23 + 28, 18),
            }}
          >
            <CountUp
              value={1000000}
              suffix="+"
              startFrame={B23 + 28}
              duration={60}
              fontSize={72}
              color={fs.accent}
              style={{
                textShadow: `0 0 30px rgba(255,197,5,0.4)`,
              }}
            />
          </div>
        </div>

        {/* 골드 하이라이트 라벨 */}
        <SlideUpFade startFrame={B23 + 40} duration={20}>
          <div
            style={{
              display: 'inline-block',
              background: `rgba(255,197,5,0.12)`,
              border: `1px solid rgba(255,197,5,0.3)`,
              borderRadius: 8,
              padding: '6px 16px',
              fontFamily: fs.font,
              fontSize: 18,
              color: fs.accent,
              fontWeight: 600,
              letterSpacing: fs.letterSpacing,
            }}
          >
            토큰 컨텍스트
          </div>
        </SlideUpFade>

        {/* 출력 카운트 (B24) */}
        <div style={{ marginTop: 32 }}>
          <SlideUpFade startFrame={B24 - 9} duration={20}>
            <div
              style={{
                fontFamily: fs.font,
                fontSize: 20,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
                marginBottom: 12,
              }}
            >
              출력 토큰
            </div>
          </SlideUpFade>
          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'baseline',
            }}
          >
            <div
              style={{
                opacity: fadeIn(frame, B24, 18),
                transform: `translateY(${slideY(frame, B24, 20, 18)}px)`,
              }}
            >
              <CountUp
                value={64000}
                prefix="기본 "
                suffix=""
                startFrame={B24}
                duration={45}
                fontSize={36}
                color={fs.text}
              />
            </div>
            <div
              style={{
                opacity: fadeIn(frame, B24 + 20, 18),
                transform: `translateY(${slideY(frame, B24 + 20, 20, 18)}px)`,
              }}
            >
              <CountUp
                value={128000}
                prefix="최대 "
                suffix=""
                startFrame={B24 + 20}
                duration={45}
                fontSize={36}
                color={fs.accentLight}
              />
            </div>
          </div>
        </div>

        {/* "AI가 한 번에 읽을 수 있는" 설명 (B25) */}
        <SlideUpFade startFrame={B25 - 9} duration={22} style={{ marginTop: 28 }}>
          <BlurReveal
            text="AI가 한 번에 읽을 수 있는 문서 분량"
            startFrame={B25}
            fontSize={26}
            fontWeight={500}
            color={fs.textDim}
            stagger={3}
            style={{ lineHeight: 1.4, wordBreak: 'keep-all' }}
          />
        </SlideUpFade>
      </div>

      {/* 우: 문서 스택 (B26) */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 80,
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <SlideUpFade startFrame={B26 - 9} duration={20}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 20,
              color: fs.textDim,
              marginBottom: 16,
              letterSpacing: fs.letterSpacing,
            }}
          >
            한 번에 전달
          </div>
        </SlideUpFade>

        <DocIcon
          emoji="📋"
          label="기획서"
          frame={frame}
          startFrame={B26}
          stackIndex={0}
          absorbed={true}
          absorbFrame={absorbStart}
        />
        <DocIcon
          emoji="🎨"
          label="디자인 가이드"
          frame={frame}
          startFrame={B26 + 16}
          stackIndex={1}
          absorbed={true}
          absorbFrame={absorbStart + 12}
        />
        <DocIcon
          emoji="💻"
          label="기존 코드"
          frame={frame}
          startFrame={B26 + 32}
          stackIndex={2}
          absorbed={true}
          absorbFrame={absorbStart + 24}
        />

        {/* 터미널 흡수 표시 */}
        <div
          style={{
            opacity: fadeIn(frame, absorbStart - 10, 20),
            marginTop: 16,
          }}
        >
          <div
            style={{
              background: 'rgba(255,197,5,0.08)',
              border: `1px solid rgba(255,197,5,0.2)`,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: fs.accent,
                boxShadow: `0 0 8px ${fs.accent}`,
              }}
            />
            <span
              style={{
                fontFamily: fs.mono,
                fontSize: 14,
                color: fs.accent,
              }}
            >
              → claude session
            </span>
          </div>
        </div>
      </div>

      {/* ─── "상품 기획서를 개발팀에 넘길 때" (B27) ─── */}
      <SlideUpFade
        startFrame={B27 - 9}
        duration={22}
        style={{
          position: 'absolute',
          top: 490,
          left: 80,
          right: 400,
        }}
      >
        <BlurReveal
          text="상품 기획서를 개발팀에 넘길 때"
          startFrame={B27}
          fontSize={30}
          fontWeight={600}
          color={fs.text}
          stagger={4}
          style={{ lineHeight: 1.4, wordBreak: 'keep-all' }}
        />
      </SlideUpFade>

      {/* ─── ROW 2 (ZIG-ZAG): 좌—비교 카드, 우—뱃지 ─── */}

      {/* 좌: 비교 카드 (B28) */}
      <div
        style={{
          position: 'absolute',
          top: 590,
          left: 80,
          width: 500,
        }}
      >
        <ComparisonCard frame={frame} startFrame={compareStart} />

        {/* "요약 과정에서 빠지는 맥락" (B28) */}
        <SlideUpFade startFrame={B28} duration={20} style={{ marginTop: 20 }}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 20,
              color: fs.danger,
              letterSpacing: fs.letterSpacing,
              lineHeight: 1.4,
              wordBreak: 'keep-all',
            }}
          >
            요약 과정에서 빠지는 맥락
          </div>
        </SlideUpFade>
      </div>

      {/* 우: "요약 과정 자체를 없앤다" (B29) + 오퍼스 뱃지 (B30) */}
      <div
        style={{
          position: 'absolute',
          top: 590,
          right: 80,
          width: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* B29 강조 문구 */}
        <SlideUpFade startFrame={B29 - 9} duration={24}>
          <GlassCard style={{ padding: 32 }} glow>
            <div
              style={{
                fontFamily: fs.font,
                fontSize: 28,
                fontWeight: 700,
                color: fs.accent,
                letterSpacing: fs.letterSpacing,
                lineHeight: 1.4,
                wordBreak: 'keep-all',
              }}
            >
              요약 과정 자체를
              <br />
              <span
                style={{
                  color: fs.text,
                  fontSize: 34,
                  display: 'block',
                  marginTop: 6,
                }}
              >
                없앤다
              </span>
            </div>
          </GlassCard>
        </SlideUpFade>

        {/* B30 오퍼스 4.6 뱃지 */}
        <OpusBadge frame={frame} startFrame={B30 - 9} />
      </div>

      {/* ─── 씬 하단 구분선 ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 80,
          right: 80,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(255,197,5,0.2), transparent)`,
          opacity: fadeIn(frame, B24, 30),
        }}
      />
    </AbsoluteFill>
  );
};
