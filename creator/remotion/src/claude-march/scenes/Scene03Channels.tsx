import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function fadeIn(frame: number, start: number, dur = 20) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function slideX(frame: number, start: number, from: number, dur = 24) {
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

/** 메신저 아이콘 — 텔레그램 */
const TelegramIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill={fs.accent} />
    <path
      d="M10 23.5l5.8 2.1 2.2 7 3.2-3.6 6.8 4.5L33 14 10 23.5z"
      fill="#111111"
      fillRule="evenodd"
    />
  </svg>
);

/** 메신저 아이콘 — 디스코드 */
const DiscordIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill={fs.accent} />
    <path
      d="M32.5 15A20.3 20.3 0 0027 13.5c-.2.4-.5.9-.7 1.3a18.8 18.8 0 00-5.6 0 13.5 13.5 0 00-.7-1.3A20.4 20.4 0 0015.5 15C12 20.3 11 25.5 11.5 30.5a20.7 20.7 0 006.3 3.2c.5-.7 1-1.4 1.4-2.2a13.4 13.4 0 01-2.1-1l.5-.4a14.8 14.8 0 0012.8 0l.5.4a13.3 13.3 0 01-2.1 1c.4.8.9 1.5 1.4 2.2a20.6 20.6 0 006.3-3.2c.5-5.6-.9-10.7-3.9-15.5zM19 27.5c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5 2.2 1.1 2.2 2.5-1 2.5-2.2 2.5zm10 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5 2.2 1.1 2.2 2.5-1 2.5-2.2 2.5z"
      fill="#111111"
    />
  </svg>
);

/** 메시지 버블 */
const MessageBubble: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  fromLeft?: boolean;
}> = ({ text, frame, startFrame, fromLeft = true }) => {
  const op = fadeIn(frame, startFrame, 14);
  const tx = slideX(frame, startFrame, fromLeft ? -30 : 30, 14);
  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${tx}px)`,
        background: 'rgba(255,197,5,0.12)',
        border: '1px solid rgba(255,197,5,0.25)',
        borderRadius: 12,
        padding: '8px 14px',
        fontFamily: fs.font,
        fontSize: 18,
        color: fs.text,
        whiteSpace: 'nowrap',
        letterSpacing: fs.letterSpacing,
      }}
    >
      {text}
    </div>
  );
};

/** 터미널 세션 패널 */
const TerminalPanel: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const op = fadeIn(frame, startFrame, 20);
  const lines = [
    '> claude --session work-session',
    '  Session restored. 42 messages.',
    '> analyze this PR and summarize',
    '  Analyzing...',
    '  [████████░░] 80%',
  ];
  return (
    <div style={{ opacity: op }}>
      <GlassCard
        style={{
          width: 360,
          minHeight: 200,
          padding: 24,
        }}
      >
        <div
          style={{
            fontFamily: fs.mono,
            fontSize: 15,
            color: fs.accent,
            marginBottom: 12,
            letterSpacing: '0.02em',
          }}
        >
          ● claude session
        </div>
        {lines.map((line, i) => {
          const lineOp = fadeIn(frame, startFrame + 8 + i * 10, 12);
          return (
            <div
              key={i}
              style={{
                opacity: lineOp,
                fontFamily: fs.mono,
                fontSize: 14,
                color: i % 2 === 0 ? fs.accent : fs.textDim,
                lineHeight: 1.7,
                letterSpacing: '0.01em',
              }}
            >
              {line}
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
};

/** 장소 아이콘 행 */
const LocationIcons: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const locations = [
    { emoji: '🏢', label: '회의실' },
    { emoji: '☕', label: '카페' },
    { emoji: '🚇', label: '이동 중' },
  ];
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {locations.map((loc, i) => {
        const op = fadeIn(frame, startFrame + i * 18, 16);
        const ty = interpolate(
          frame,
          [startFrame + i * 18, startFrame + i * 18 + 16],
          [20, 0],
          { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              opacity: op,
              transform: `translateY(${ty}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                background: 'rgba(255,197,5,0.1)',
                border: `1px solid rgba(255,197,5,0.3)`,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              {loc.emoji}
            </div>
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 16,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
              }}
            >
              {loc.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** 하단 타임라인 바 */
const TimelineBar: React.FC<{ frame: number; startFrame: number; totalFrames: number }> = ({
  frame,
  startFrame,
  totalFrames,
}) => {
  const op = fadeIn(frame, startFrame, 20);
  const progress = interpolate(
    frame,
    [startFrame, startFrame + totalFrames - 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const dots = ['채널즈 연결', '세션 동기화', '명령 전달', '결과 수신', '맥락 유지'];
  return (
    <div style={{ opacity: op, width: '100%', paddingTop: 8 }}>
      {/* 바 트랙 */}
      <div
        style={{
          position: 'relative',
          height: 4,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${fs.accent}, ${fs.accentLight})`,
            borderRadius: 2,
            boxShadow: `0 0 8px rgba(255,197,5,0.5)`,
          }}
        />
        {dots.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i / (dots.length - 1)) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: progress >= i / (dots.length - 1) ? fs.accent : 'rgba(255,255,255,0.2)',
              border: `2px solid ${fs.bg}`,
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      {/* 라벨 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {dots.map((label, i) => (
          <span
            key={i}
            style={{
              fontFamily: fs.font,
              fontSize: 13,
              color:
                progress >= i / (dots.length - 1) ? fs.accent : fs.textMuted,
              letterSpacing: fs.letterSpacing,
              opacity: progress >= i / (dots.length - 1) ? 1 : 0.5,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Scene03Channels: React.FC = () => {
  const frame = useCurrentFrame();
  const DURATION = 1742;

  // sceneOut: 마지막 30f
  const sceneOutOpacity = interpolate(
    frame,
    [DURATION - 30, DURATION],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 블록별 타이밍 (timing_v2, Block 18 재합성 반영)
  const B15 = 0;
  const B16 = 242;
  const B17 = 414;
  const B18 = 567;
  const B19 = 871;
  const B20 = 1108;
  const B21 = 1302;
  const B22 = 1606;

  // 텔레그램 좌측 슬라이드인 (B16 - 12)
  const telegramOpacity = fadeIn(frame, B16 - 12, 24);
  const telegramX = slideX(frame, B16 - 12, -80, 24);

  // 디스코드 우측 슬라이드인 (B16 - 12)
  const discordOpacity = fadeIn(frame, B16 - 12, 24);
  const discordX = slideX(frame, B16 - 12, 80, 24);

  // 터미널 (B17 - 12)
  const terminalStart = B17 - 12;

  // DataFlow 화살표 (B18 - 10)
  const arrowOpacity = fadeIn(frame, B18 - 10, 20);

  // 장소 아이콘 (B20 - 9)
  const locationStart = B20 - 9;

  // "맥락 전환 비용" 뱃지 (B21 - 12)
  const costBadgeOp = fadeIn(frame, B21 - 12, 20);
  const costBadgeScale = interpolate(
    frame,
    [B21 - 12, B21 - 12 + 20],
    [0.85, 1],
    { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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

      {/* ─── 헤더 자막 (B15) ─── */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 80,
          right: 80,
        }}
      >
        <SlideUpFade startFrame={B15} duration={22}>
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 28,
              color: fs.accent,
              fontWeight: 600,
              letterSpacing: fs.letterSpacing,
              marginBottom: 12,
            }}
          >
            채널즈 — Channels
          </div>
        </SlideUpFade>
        <BlurReveal
          text="채널즈입니다. 3월 20일"
          startFrame={B15 + 8}
          fontSize={52}
          fontWeight={700}
          stagger={5}
        />
      </div>

      {/* ─── Bento Grid 메인 영역 ─── */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 80,
          right: 80,
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 24,
        }}
      >
        {/* 좌: 텔레그램 패널 */}
        <div
          style={{
            opacity: telegramOpacity,
            transform: `translateX(${telegramX}px)`,
          }}
        >
          <GlassCard style={{ padding: 28, minHeight: 220 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <TelegramIcon size={52} />
              <div
                style={{
                  fontFamily: fs.font,
                  fontSize: 20,
                  fontWeight: 600,
                  color: fs.text,
                  letterSpacing: fs.letterSpacing,
                }}
              >
                텔레그램
              </div>

              {/* 메시지 버블들 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%',
                }}
              >
                <MessageBubble
                  text="/analyze PR"
                  frame={frame}
                  startFrame={B16 + 20}
                  fromLeft
                />
                <MessageBubble
                  text="/status"
                  frame={frame}
                  startFrame={B16 + 48}
                  fromLeft
                />
                <MessageBubble
                  text="/run tests"
                  frame={frame}
                  startFrame={B18 + 10}
                  fromLeft
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 중앙: 터미널 세션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <TerminalPanel frame={frame} startFrame={terminalStart} />

          {/* DataFlow 화살표 */}
          <div
            style={{
              opacity: arrowOpacity,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 8,
            }}
          >
            {/* 좌→중 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${fs.accent})`,
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `8px solid ${fs.accent}`,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                }}
              />
            </div>
            <div
              style={{
                fontFamily: fs.mono,
                fontSize: 13,
                color: fs.accent,
                letterSpacing: '0.02em',
              }}
            >
              명령 수신
            </div>
            {/* 중→우 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: `linear-gradient(90deg, ${fs.accent}, transparent)`,
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `8px solid ${fs.accent}`,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                }}
              />
            </div>
          </div>

          {/* "기획자 관점" 자막 (B17) */}
          <SlideUpFade startFrame={B17} duration={20} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: fs.font,
                fontSize: 22,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
                lineHeight: 1.4,
                wordBreak: 'keep-all',
              }}
            >
              기획자 관점에서 생각
            </div>
          </SlideUpFade>
        </div>

        {/* 우: 디스코드 패널 */}
        <div
          style={{
            opacity: discordOpacity,
            transform: `translateX(${discordX}px)`,
          }}
        >
          <GlassCard style={{ padding: 28, minHeight: 220 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <DiscordIcon size={52} />
              <div
                style={{
                  fontFamily: fs.font,
                  fontSize: 20,
                  fontWeight: 600,
                  color: fs.text,
                  letterSpacing: fs.letterSpacing,
                }}
              >
                디스코드
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%',
                }}
              >
                <MessageBubble
                  text="!summarize"
                  frame={frame}
                  startFrame={B16 + 32}
                  fromLeft={false}
                />
                <MessageBubble
                  text="!deploy prod"
                  frame={frame}
                  startFrame={B16 + 60}
                  fromLeft={false}
                />
                <MessageBubble
                  text="!review"
                  frame={frame}
                  startFrame={B19 + 10}
                  fromLeft={false}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ─── "오픈클로 킬러" 뱃지 (B19) ─── */}
      <SlideUpFade
        startFrame={B19 - 12}
        duration={22}
        style={{
          position: 'absolute',
          top: 540,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, rgba(255,197,5,0.18), rgba(255,197,5,0.06))`,
            border: `1.5px solid ${fs.accent}`,
            borderRadius: 100,
            padding: '10px 28px',
            fontFamily: fs.font,
            fontSize: 20,
            fontWeight: 700,
            color: fs.accent,
            letterSpacing: fs.letterSpacing,
            boxShadow: fs.glow('accent', 0.2),
            whiteSpace: 'nowrap',
          }}
        >
          "오픈클로 킬러"
        </div>
      </SlideUpFade>

      {/* ─── 장소 아이콘 행 (B20) ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 335,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <LocationIcons frame={frame} startFrame={locationStart} />
      </div>

      {/* ─── "맥락 전환 비용" 뱃지 (B21) ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 280,
          left: 80,
          opacity: costBadgeOp,
          transform: `scale(${costBadgeScale})`,
          transformOrigin: 'left center',
        }}
      >
        <GlassCard style={{ padding: '14px 28px' }} glow glowColor="danger">
          <div
            style={{
              fontFamily: fs.font,
              fontSize: 24,
              fontWeight: 700,
              color: fs.danger,
              letterSpacing: fs.letterSpacing,
              wordBreak: 'keep-all',
            }}
          >
            맥락 전환 비용
          </div>
        </GlassCard>
      </div>

      {/* ─── "맥락 전환 비용을 줄여주는" (B22) ─── */}
      <SlideUpFade
        startFrame={B22 - 9}
        duration={22}
        style={{
          position: 'absolute',
          bottom: 215,
          left: 80,
          right: 80,
        }}
      >
        <BlurReveal
          text="맥락 전환 비용을 줄여주는"
          startFrame={B22}
          fontSize={40}
          fontWeight={700}
          color={fs.accent}
          stagger={4}
        />
      </SlideUpFade>

      {/* ─── 하단 타임라인 바 ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 80,
          right: 80,
        }}
      >
        <TimelineBar frame={frame} startFrame={B16} totalFrames={DURATION - B16} />
      </div>

      {/* ─── 외부 회의 자막 (B18) ─── */}
      <SlideUpFade
        startFrame={B18 - 9}
        duration={20}
        style={{
          position: 'absolute',
          top: 140,
          right: 80,
        }}
      >
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 20,
            color: fs.textDim,
            letterSpacing: fs.letterSpacing,
            lineHeight: 1.4,
            wordBreak: 'keep-all',
            textAlign: 'right',
          }}
        >
          외부 회의를 하다가
        </div>
      </SlideUpFade>
    </AbsoluteFill>
  );
};
