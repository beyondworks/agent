import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard, TypingCursor } from '../components';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 2173;

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
    <filter id="grain02">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain02)" />
  </svg>
);

// 스페이스바 키 컴포넌트
const SpacebarKey: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  // 키 등장
  const mountOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mountY = interpolate(frame, [startFrame, startFrame + 15], [20, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 눌리는 애니메이션: 주기적으로 반복 (2.5초 주기)
  const cycleLen = 75;
  const localCycle = (frame - startFrame) % cycleLen;
  const pressProgress = interpolate(localCycle, [0, 8, 16, 24], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const keyScale = interpolate(pressProgress, [0, 1], [1, 0.94]);
  const keyBrightness = interpolate(pressProgress, [0, 1], [1, 1.4]);
  const shadowOpacity = interpolate(pressProgress, [0, 1], [0.3, 0.6]);

  return (
    <div
      style={{
        opacity: mountOpacity,
        transform: `translateY(${mountY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 280,
          height: 64,
          background: 'rgba(255,255,255,0.06)',
          border: `2px solid rgba(255,197,5,${0.3 + pressProgress * 0.5})`,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scaleY(${keyScale})`,
          transformOrigin: 'bottom center',
          boxShadow: `0 ${4 + pressProgress * 4}px 20px rgba(255,197,5,${shadowOpacity}), inset 0 1px 0 rgba(255,255,255,0.1)`,
          filter: `brightness(${keyBrightness})`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontFamily: fs.mono,
            fontSize: 18,
            color: `rgba(255,197,5,${0.6 + pressProgress * 0.4})`,
            letterSpacing: '0.1em',
          }}
        >
          SPACE
        </span>
      </div>
      <div
        style={{
          fontFamily: fs.font,
          fontSize: 16,
          color: fs.textMuted,
          letterSpacing: fs.letterSpacing,
        }}
      >
        누르고 말하기
      </div>
    </div>
  );
};

// 음파 파형 (골드)
const AudioWaveform: React.FC<{ startFrame: number; active?: boolean }> = ({
  startFrame,
  active = true,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bars = 20;
  return (
    <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 5, height: 80 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const phase = (i / bars) * Math.PI * 2;
        const amp = active
          ? Math.abs(Math.sin(frame * 0.12 + phase)) * 0.7 + 0.3
          : 0.15;
        const h = 10 + amp * 60;
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 2,
              background: `rgba(255,197,5,${0.3 + amp * 0.7})`,
              transform: `scaleY(1)`,
              transformOrigin: 'center',
            }}
          />
        );
      })}
    </div>
  );
};

// 터미널 화면 컴포넌트
const TerminalWindow: React.FC<{
  startFrame: number;
  lines: Array<{ text: string; frame: number; prompt?: boolean }>;
  style?: React.CSSProperties;
}> = ({ startFrame, lines, style }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const mountOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: mountOpacity,
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* 터미널 타이틀바 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F' }} />
        <span
          style={{
            fontFamily: fs.mono,
            fontSize: 13,
            color: fs.textMuted,
            marginLeft: 8,
          }}
        >
          claude — bash
        </span>
      </div>
      {/* 터미널 본문 */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {lines.map((line, i) => {
          if (frame < line.frame) return null;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {line.prompt && (
                <span style={{ fontFamily: fs.mono, fontSize: 16, color: fs.accent }}>$</span>
              )}
              <TypingCursor
                text={line.text}
                startFrame={line.frame}
                speed={2}
                fontSize={16}
                color={line.prompt ? fs.text : fs.textDim}
                cursorColor={fs.accent}
                mono
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 20개 언어 플래그 슬라이드업
const LANGUAGES = [
  { flag: '🇰🇷', name: '한국어' },
  { flag: '🇺🇸', name: 'English' },
  { flag: '🇯🇵', name: '日本語' },
  { flag: '🇨🇳', name: '中文' },
  { flag: '🇩🇪', name: 'Deutsch' },
  { flag: '🇫🇷', name: 'Français' },
  { flag: '🇪🇸', name: 'Español' },
  { flag: '🇮🇹', name: 'Italiano' },
  { flag: '🇵🇹', name: 'Português' },
  { flag: '🇷🇺', name: 'Русский' },
  { flag: '🇮🇳', name: 'हिन्दी' },
  { flag: '🇦🇷', name: 'Español AR' },
  { flag: '🇳🇱', name: 'Nederlands' },
  { flag: '🇸🇪', name: 'Svenska' },
  { flag: '🇵🇱', name: 'Polski' },
  { flag: '🇹🇷', name: 'Türkçe' },
  { flag: '🇸🇦', name: 'العربية' },
  { flag: '🇹🇭', name: 'ภาษาไทย' },
  { flag: '🇻🇳', name: 'Tiếng Việt' },
  { flag: '🇮🇩', name: 'Bahasa' },
];

const LanguageFlags: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 12px',
        justifyContent: 'center',
        maxWidth: 680,
      }}
    >
      {LANGUAGES.map((lang, i) => {
        const itemStart = startFrame + i * 5;
        const opacity = interpolate(frame, [itemStart, itemStart + 12], [0, 1], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateY = interpolate(frame, [itemStart, itemStart + 12], [16, 0], {
          easing: ease,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '6px 12px',
            }}
          >
            <span style={{ fontSize: 18 }}>{lang.flag}</span>
            <span
              style={{
                fontFamily: fs.font,
                fontSize: 13,
                color: fs.textDim,
                letterSpacing: fs.letterSpacing,
              }}
            >
              {lang.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 타이핑 vs 음성 비교 카드
const ComparisonCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [startFrame, startFrame + 20], [30, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rows = [
    { label: '짧은 지시', typing: '빠름', voice: '비슷', winner: 'typing' },
    { label: '복잡한 요구사항', typing: '느림', voice: '3x 빠름', winner: 'voice' },
    { label: '맥락 설명', typing: '느림', voice: '자연스러움', winner: 'voice' },
    { label: '코드 수정', typing: '정확', voice: '텍스트 보완', winner: 'both' },
  ];

  return (
    <GlassCard
      glow
      glowColor="accent"
      padding={32}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* 헤더 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            paddingBottom: 12,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 12,
          }}
        >
          <span style={{ fontFamily: fs.font, fontSize: 14, color: fs.textMuted }}>상황</span>
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 14,
              color: fs.textMuted,
              textAlign: 'center',
            }}
          >
            ⌨️ 타이핑
          </span>
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 14,
              color: fs.accent,
              textAlign: 'center',
            }}
          >
            🎙️ 음성
          </span>
        </div>
        {rows.map((row, i) => {
          const rowStart = startFrame + 20 + i * 12;
          const rowOpacity = interpolate(frame, [rowStart, rowStart + 10], [0, 1], {
            easing: ease,
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                padding: '10px 0',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: rowOpacity,
              }}
            >
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 15,
                  color: fs.text,
                  wordBreak: 'keep-all',
                  lineHeight: 1.3,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 15,
                  color:
                    row.winner === 'typing' ? fs.accent : fs.textDim,
                  textAlign: 'center',
                  fontWeight: row.winner === 'typing' ? 700 : 400,
                }}
              >
                {row.typing}
              </span>
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 15,
                  color:
                    row.winner === 'voice' || row.winner === 'both' ? fs.accent : fs.textDim,
                  textAlign: 'center',
                  fontWeight: row.winner === 'voice' || row.winner === 'both' ? 700 : 400,
                }}
              >
                {row.voice}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// ─── 전반부 레이아웃 (f0~f788): Full-bleed 터미널 + 스페이스바 ───────────────

const FrontHalf: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 20, endFrame - 20, endFrame], [0, 1, 1, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const terminalLines = [
    { text: 'claude', frame: startFrame + 10, prompt: true },
    { text: '> Voice Mode: ON  ·  스페이스바를 누르고 말하세요', frame: startFrame + 25, prompt: false },
    { text: '> 20개 언어 지원  ·  푸시투톡 방식', frame: startFrame + 278, prompt: false },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        padding: '80px 120px',
      }}
    >
      {/* 타이틀 */}
      <SlideUpFade startFrame={startFrame}>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 22,
            color: fs.accent,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            fontWeight: 600,
          }}
        >
          Voice Mode
        </div>
      </SlideUpFade>

      {/* 터미널 */}
      <TerminalWindow
        startFrame={startFrame + 5}
        lines={terminalLines.slice(0, 2)}
        style={{ width: '100%', maxWidth: 720 }}
      />

      {/* 스페이스바 + 파형 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <SpacebarKey startFrame={startFrame + 30} />
        <AudioWaveform startFrame={startFrame + 50} active />
      </div>

      {/* Block 6: 푸시투톡 + 20개 언어 */}
      {frame >= startFrame + 148 && (
        <SlideUpFade startFrame={startFrame + 148}>
          <LanguageFlags startFrame={startFrame + 148 + 20} />
        </SlideUpFade>
      )}
    </AbsoluteFill>
  );
};

// ─── 후반부 레이아웃 (f788~): Split Screen ────────────────────────────────────

const BackHalf: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 20, endFrame - 30, endFrame], [0, 1, 1, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 후반부 터미널 라인들
  // Block 9=f806(+0), 10=f1000(+194), 11=f1227(+421), 12=f1382(+576), 14=f1936(+1130)
  const terminalLines = [
    { text: '버튼 색상을 골드(#FFC505)로 바꿔줘', frame: startFrame + 10, prompt: true },
    { text: '✓  Button.tsx 수정 완료', frame: startFrame + 50, prompt: false },
    { text: '타이핑 대신 말로 브리프—3x 더 빠릅니다', frame: startFrame + 421, prompt: false },
    { text: '복잡한 요구사항도 구두로 전달 가능', frame: startFrame + 576, prompt: false },
    { text: '핵심 지시는 텍스트, 맥락은 음성으로', frame: startFrame + 1130, prompt: false },
  ];

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 80px',
      }}
    >
      {/* 좌우 컬럼을 하나의 flex 컨테이너로 묶어 수직 중앙 정렬 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 60,
          width: '100%',
          minHeight: 0,
        }}
      >
        {/* 좌: 터미널 + 텍스트 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            minWidth: 0,
          }}
        >
          <TerminalWindow
            startFrame={startFrame}
            lines={terminalLines}
            style={{ width: '100%' }}
          />

          {/* Block 9: 타이핑 대신 말로 — 터미널 바로 아래 (marginTop: 24) */}
          {frame >= startFrame + 22 && (
            <div style={{ marginTop: 24 }}>
              <BlurReveal
                text="타이핑 대신 말로"
                startFrame={startFrame + 22}
                stagger={5}
                fontSize={36}
                color={fs.text}
                fontWeight={700}
              />
            </div>
          )}

          {/* Block 11: 타이핑보다 빠르다 (offset 421) */}
          {frame >= startFrame + 421 && (
            <SlideUpFade startFrame={startFrame + 421}>
              <div
                style={{
                  fontFamily: fs.font,
                  fontSize: 48,
                  fontWeight: 800,
                  color: fs.accent,
                  letterSpacing: fs.letterSpacing,
                  wordBreak: 'keep-all',
                  lineHeight: 1.3,
                }}
              >
                타이핑보다
                <br />
                <span style={{ color: fs.text }}>빠르다</span>
              </div>
            </SlideUpFade>
          )}
        </div>

        {/* 우: 음파 파형 + 비교 카드 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 32,
            minWidth: 0,
          }}
        >
          {/* 음파 파형 */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AudioWaveform startFrame={startFrame} active={frame < startFrame + 800} />
          </div>

          {/* Block 12: 비교 카드 (offset 576) */}
          <ComparisonCard startFrame={startFrame + 576} />

          {/* Block 13: 음성 인식 정확도 (offset 881) */}
          {frame >= startFrame + 881 && (
            <SlideUpFade startFrame={startFrame + 881}>
              <GlassCard padding={24} style={{ borderColor: 'rgba(255,77,77,0.2)' }}>
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 17,
                    color: fs.text,
                    wordBreak: 'keep-all',
                    lineHeight: 1.4,
                    letterSpacing: fs.letterSpacing,
                  }}
                >
                  <span style={{ color: fs.danger }}>⚠ </span>
                  음성 인식 정확도가 완벽하지 않을 수 있습니다
                </div>
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 15,
                    color: fs.textDim,
                    marginTop: 8,
                    wordBreak: 'keep-all',
                    lineHeight: 1.4,
                    letterSpacing: fs.letterSpacing,
                  }}
                >
                  핵심 지시는 텍스트로 + 맥락은 음성으로
                </div>
              </GlassCard>
            </SlideUpFade>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene02Voice: React.FC = () => {
  const frame = useCurrentFrame();

  // 전반부/후반부 분기 (Block 9 시작: f806)
  const SPLIT = 806;

  // Scene-out: 마지막 30f fade-out
  const sceneOutOpacity = interpolate(frame, [DURATION - 30, DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: fs.bg, opacity: sceneOutOpacity }}>
      <GrainOverlay />

      {/* 전반부: f0 ~ f788 */}
      {frame < SPLIT + 20 && (
        <FrontHalf startFrame={0} endFrame={SPLIT} />
      )}

      {/* 후반부: f788 ~ DURATION */}
      {frame >= SPLIT - 20 && (
        <BackHalf startFrame={SPLIT} endFrame={DURATION} />
      )}
    </AbsoluteFill>
  );
};
