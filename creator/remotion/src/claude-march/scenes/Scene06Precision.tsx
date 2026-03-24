import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { fs } from '../theme';
import { BlurReveal, SlideUpFade, GlassCard, TypingCursor } from '../components';

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const DURATION = 2373;
const FADE_START = DURATION - 30;

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
    <filter id="grain06">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain06)" />
  </svg>
);

// 섹션 전환 페이드
const useSectionFade = (inStart: number, outStart: number) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [inStart, inStart + 30], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [outStart, outStart + 25], [1, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(fadeIn, fadeOut);
};

// ─────────────────────────────────────────────
// PART 1: /loop — 터미널 (f0 ~ f600)
// ─────────────────────────────────────────────

// 타이머 펄스 아이콘
const TimerPulse: React.FC<{ startFrame: number; index: number }> = ({ startFrame, index }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0) return null;

  const CYCLE = 30;
  const phase = ((local - index * 12) % CYCLE) / CYCLE;
  const pulseOpacity = phase < 0.5
    ? interpolate(phase, [0, 0.3], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(phase, [0.5, 1], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const appear = interpolate(frame, [startFrame + index * 15, startFrame + index * 15 + 20], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: appear * pulseOpacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: fs.accent,
          boxShadow: `0 0 12px ${fs.accent}`,
        }}
      />
      <span
        style={{
          fontFamily: fs.mono,
          fontSize: 13,
          color: fs.accent,
          opacity: 0.7,
        }}
      >
        5m
      </span>
    </div>
  );
};

const LoopSection: React.FC = () => {
  const frame = useCurrentFrame();

  // 섹션 가시성: f0 진입 ~ f704 페이드 아웃
  const opacity = useSectionFade(0, 734);

  // 터미널 카드 슬라이드 인: f0-15 (키 f0보다 0f, 카드는 즉시)
  const cardSlide = interpolate(frame, [0, 20], [-60, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 배지 라벨
  const badgeOpacity = interpolate(frame, [10, 30], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 타이핑: f0에서 시작 (블록 [34])
  // 블록 [35] f216: 5분마다 배포 상태 → 예시 텍스트 추가 출력
  // 블록 [36] f434: 이커머스 예시

  const showDeployExample = frame >= 205; // 220 - 15f
  const showEcomExample = frame >= 445;   // 460 - 15f

  // 타이머 펄스: f250 이후 순차적
  const showTimers = frame >= 250;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 배경 glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, rgba(255,197,5,0.03) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
          gap: 40,
        }}
      >
        {/* 커맨드 배지 */}
        <div
          style={{
            opacity: badgeOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,197,5,0.08)',
            border: '1px solid rgba(255,197,5,0.25)',
            borderRadius: 100,
            padding: '6px 18px',
          }}
        >
          <span
            style={{
              fontFamily: fs.mono,
              fontSize: 14,
              color: fs.accent,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            /loop
          </span>
          <span
            style={{
              fontFamily: fs.font,
              fontSize: 13,
              color: fs.textMuted,
            }}
          >
            반복 실행
          </span>
        </div>

        {/* 터미널 카드 */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `translateX(${cardSlide}px)`,
            width: '100%',
            maxWidth: 860,
          }}
        >
          <GlassCard
            padding={48}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
            }}
          >
            {/* 터미널 헤더 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 32,
              }}
            >
              {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: c,
                    opacity: 0.8,
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: fs.mono,
                  fontSize: 12,
                  color: fs.textMuted,
                  marginLeft: 8,
                }}
              >
                claude — terminal
              </span>
            </div>

            {/* 블록 [34]: /loop 타이핑 */}
            <div style={{ marginBottom: 20 }}>
              <TypingCursor
                text="/loop 5m check deploy"
                startFrame={0}
                speed={3}
                fontSize={28}
                mono
                color={fs.text}
                cursorColor={fs.accent}
              />
            </div>

            {/* 블록 [35]: 배포 상태 확인 예시 */}
            {showDeployExample && (
              <SlideUpFade startFrame={201} distance={20}>
                <div
                  style={{
                    fontFamily: fs.mono,
                    fontSize: 14,
                    color: 'rgba(100,220,100,0.8)',
                    lineHeight: 1.8,
                    borderLeft: '2px solid rgba(100,220,100,0.3)',
                    paddingLeft: 16,
                    marginBottom: 20,
                  }}
                >
                  <div>✓ 매 5분마다 배포 상태 확인 중...</div>
                  <div style={{ color: fs.textMuted }}>→ vercel deploy --check</div>
                </div>
              </SlideUpFade>
            )}

            {/* 블록 [36]: 이커머스 예시 */}
            {showEcomExample && (
              <SlideUpFade startFrame={419} distance={20}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: 'rgba(255,197,5,0.04)',
                    border: '1px solid rgba(255,197,5,0.12)',
                    borderRadius: 10,
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ fontSize: 16 }}>🛒</span>
                  <div>
                    <div
                      style={{
                        fontFamily: fs.mono,
                        fontSize: 13,
                        color: fs.accent,
                        marginBottom: 4,
                      }}
                    >
                      /loop 10m check inventory
                    </div>
                    <div
                      style={{
                        fontFamily: fs.font,
                        fontSize: 13,
                        color: fs.textDim,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      이커머스 프로모션 재고 확인
                    </div>
                  </div>
                </div>
              </SlideUpFade>
            )}
          </GlassCard>
        </div>

        {/* 타이머 펄스 행 */}
        {showTimers && (
          <SlideUpFade startFrame={250} distance={15}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <TimerPulse key={i} startFrame={250} index={i} />
              ))}
            </div>
          </SlideUpFade>
        )}

        {/* 블록 [34] 자막 */}
        <BlurReveal
          text="루프 명령어 — 슬래시 루프"
          startFrame={0}
          fontSize={20}
          color={fs.textMuted}
          stagger={4}
          style={{ justifyContent: 'center' }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// PART 2: /effort — 슬라이더 (f660 ~ f1400)
// ─────────────────────────────────────────────

const EFFORT_LEVELS = [
  { label: 'Low', color: 'rgba(255,255,255,0.4)', desc: '빠른 초안 / 스케치 수준', emoji: '⚡' },
  { label: 'Medium', color: fs.accent, desc: '표준 품질 / 균형 잡힌 깊이', emoji: '⚖️' },
  { label: 'High', color: '#FF4D4D', desc: '심층 분석 / 최대 정밀도', emoji: '🔬' },
];

const EffortSlider: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0) return null;

  // 드래그 애니메이션: Low(0) → High(2) → Medium(1)
  // f0~60: Low, f60~120: → High 드래그, f120~200: 유지, f200~260: → Medium
  const rawLevel = (() => {
    if (local < 60) return 0;
    if (local < 130) return interpolate(local, [60, 130], [0, 2], {
      easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    if (local < 250) return 2;
    return interpolate(local, [250, 320], [2, 1], {
      easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  })();

  const activeIndex = Math.round(rawLevel);
  const sliderPercent = (rawLevel / 2) * 100;

  const appear = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
    easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity: appear, width: '100%' }}>
      {/* 트랙 */}
      <div
        style={{
          position: 'relative',
          height: 6,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 100,
          marginBottom: 24,
        }}
      >
        {/* 채워진 트랙 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${sliderPercent}%`,
            background: `linear-gradient(90deg, rgba(255,255,255,0.3), ${EFFORT_LEVELS[activeIndex].color})`,
            borderRadius: 100,
            transition: 'none',
          }}
        />
        {/* 썸 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderPercent}%`,
            transform: 'translate(-50%, -50%)',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: EFFORT_LEVELS[activeIndex].color,
            boxShadow: `0 0 16px ${EFFORT_LEVELS[activeIndex].color}`,
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        />
        {/* 단계 마커 */}
        {[0, 50, 100].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i <= activeIndex ? EFFORT_LEVELS[i].color : 'rgba(255,255,255,0.15)',
              border: `2px solid ${i <= activeIndex ? EFFORT_LEVELS[i].color : 'rgba(255,255,255,0.08)'}`,
            }}
          />
        ))}
      </div>

      {/* 레벨 라벨 */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {EFFORT_LEVELS.map((level, i) => {
          const isActive = i === activeIndex;
          const labelOpacity = isActive ? 1 : 0.3;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center',
                opacity: labelOpacity,
                transition: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 18,
                  fontWeight: 700,
                  color: level.color,
                  letterSpacing: '-0.02em',
                }}
              >
                {level.label}
              </span>
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 12,
                  color: fs.textMuted,
                  marginTop: 4,
                  wordBreak: 'keep-all',
                  lineHeight: 1.3,
                  maxWidth: 100,
                  textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center',
                }}
              >
                {level.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EffortSection: React.FC = () => {
  const frame = useCurrentFrame();
  const SECTION_IN = 740;
  const SECTION_OUT = 1543;

  const opacity = useSectionFade(SECTION_IN, SECTION_OUT);

  // 슬라이더 등장: 725 (15f 앞)
  const sliderStart = 725;

  // 블록 [38] f998: Low/High 비유 텍스트 → f983 (15f 앞)
  const analogyStart = 983;

  // 블록 [39] f1168: 컨설팅 비유 → f1153 (15f 앞)
  const consultStart = 1153;

  const showAnalogy = frame >= analogyStart;
  const showConsult = frame >= consultStart;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, rgba(255,197,5,0.025) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 100px',
          gap: 80,
        }}
      >
        {/* 좌: 슬라이더 */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          {/* 배지 */}
          <SlideUpFade startFrame={SECTION_IN} distance={20} style={{ marginBottom: 32 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,197,5,0.08)',
                border: '1px solid rgba(255,197,5,0.25)',
                borderRadius: 100,
                padding: '6px 18px',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: fs.mono,
                  fontSize: 14,
                  color: fs.accent,
                  fontWeight: 600,
                }}
              >
                /effort
              </span>
              <span
                style={{
                  fontFamily: fs.font,
                  fontSize: 13,
                  color: fs.textMuted,
                }}
              >
                브리프 깊이 조절
              </span>
            </div>
          </SlideUpFade>

          <SlideUpFade startFrame={SECTION_IN + 10} distance={20} style={{ marginBottom: 48 }}>
            <BlurReveal
              text="브리프의 깊이 3단계"
              startFrame={SECTION_IN + 10}
              fontSize={38}
              fontWeight={700}
              color={fs.text}
              stagger={5}
            />
          </SlideUpFade>

          <EffortSlider startFrame={sliderStart} />
        </div>

        {/* 우: 비유 텍스트 */}
        <div style={{ flex: 1, maxWidth: 440 }}>
          {showAnalogy && (
            <SlideUpFade startFrame={analogyStart} distance={30} style={{ marginBottom: 32 }}>
              <GlassCard padding={36}>
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 24,
                    fontWeight: 700,
                    color: fs.text,
                    letterSpacing: fs.letterSpacing,
                    lineHeight: 1.4,
                    wordBreak: 'keep-all',
                    marginBottom: 16,
                  }}
                >
                  로우로 빠르게,
                  <br />
                  <span style={{ color: fs.accent }}>하이로 깊게</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  {[
                    { level: 'Low', icon: '⚡', text: '빠른 아이디어 발산', color: 'rgba(255,255,255,0.5)' },
                    { level: 'High', icon: '🔬', text: '심층 전략 분석', color: '#FF4D4D' },
                  ].map((item) => (
                    <div
                      key={item.level}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <div>
                        <span
                          style={{
                            fontFamily: fs.mono,
                            fontSize: 12,
                            color: item.color,
                            marginRight: 8,
                          }}
                        >
                          {item.level}
                        </span>
                        <span
                          style={{
                            fontFamily: fs.font,
                            fontSize: 14,
                            color: fs.textDim,
                          }}
                        >
                          {item.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </SlideUpFade>
          )}

          {showConsult && (
            <SlideUpFade startFrame={consultStart} distance={20}>
              <div
                style={{
                  borderLeft: `3px solid rgba(255,197,5,0.4)`,
                  paddingLeft: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 18,
                    color: fs.textDim,
                    lineHeight: 1.5,
                    wordBreak: 'keep-all',
                    letterSpacing: fs.letterSpacing,
                  }}
                >
                  컨설팅할 때 같은 강도로
                  <br />
                  리서치 안 하듯
                </div>
              </div>
            </SlideUpFade>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// PART 3: MCP Elicitation — 채팅 UI (f1406 ~ 끝)
// ─────────────────────────────────────────────

// 채팅 버블 컴포넌트
const ChatBubble: React.FC<{
  text: string;
  isAI: boolean;
  startFrame: number;
  index?: number;
}> = ({ text, isAI, startFrame, index = 0 }) => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideY = interpolate(frame, [startFrame, startFrame + 20], [16, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${slideY}px)`,
        display: 'flex',
        justifyContent: isAI ? 'flex-start' : 'flex-end',
        marginBottom: 12,
      }}
    >
      {isAI && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${fs.accent}, rgba(255,197,5,0.4))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            flexShrink: 0,
            fontSize: 12,
          }}
        >
          ✦
        </div>
      )}
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 16px',
          borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: isAI
            ? 'rgba(255,255,255,0.06)'
            : `rgba(255,197,5,0.12)`,
          border: isAI
            ? '1px solid rgba(255,255,255,0.08)'
            : `1px solid rgba(255,197,5,0.2)`,
          fontFamily: fs.font,
          fontSize: 14,
          color: isAI ? fs.text : fs.accent,
          lineHeight: 1.5,
          wordBreak: 'keep-all',
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 선택지 카드
const ChoiceCard: React.FC<{
  label: string;
  description: string;
  startFrame: number;
  index: number;
}> = ({ label, description, startFrame, index }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [startFrame + index * 12, startFrame + index * 12 + 20], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideX = interpolate(frame, [startFrame + index * 12, startFrame + index * 12 + 20], [20, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${slideX}px)`,
        padding: '12px 18px',
        background: 'rgba(255,197,5,0.05)',
        border: '1px solid rgba(255,197,5,0.2)',
        borderRadius: 12,
        cursor: 'default',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: 'rgba(255,197,5,0.15)',
          border: '1px solid rgba(255,197,5,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: fs.mono,
          fontSize: 11,
          color: fs.accent,
          fontWeight: 700,
        }}
      >
        {index + 1}
      </div>
      <div>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 14,
            fontWeight: 600,
            color: fs.text,
            letterSpacing: '-0.01em',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: fs.font,
            fontSize: 12,
            color: fs.textDim,
            lineHeight: 1.4,
            wordBreak: 'keep-all',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const MCPSection: React.FC = () => {
  const frame = useCurrentFrame();
  const SECTION_IN = 1549;

  const opacity = interpolate(frame, [SECTION_IN, SECTION_IN + 30], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 블록 타이밍 (각 키 프레이즈보다 9-15f 앞서 시각 등장)
  // [40] f1549: 엠시피 엘리시테이션 → 배지 f1534
  // [41] f1810: 작업 중간에 → 첫 AI 버블
  // [42] f2047: 여기 두 가지 → 선택지

  const badgeStart = 1534;
  const bubble1Start = 1537; // 사용자 메시지
  const bubble2Start = 1657; // AI 응답 시작
  const bubble3Start = 1759; // 작업 중간 질문
  const choiceStart = 1987;

  const showBadge = frame >= badgeStart;
  const showBubble1 = frame >= bubble1Start;
  const showBubble2 = frame >= bubble2Start;
  const showBubble3 = frame >= bubble3Start;
  const showChoices = frame >= choiceStart;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 60% 40%, rgba(255,197,5,0.025) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '0 100px',
          gap: 60,
        }}
      >
        {/* 좌: 설명 */}
        <div style={{ flex: '0 0 360px' }}>
          {showBadge && (
            <SlideUpFade startFrame={badgeStart} distance={20} style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,197,5,0.08)',
                  border: '1px solid rgba(255,197,5,0.25)',
                  borderRadius: 100,
                  padding: '6px 18px',
                }}
              >
                <span
                  style={{
                    fontFamily: fs.mono,
                    fontSize: 12,
                    color: fs.accent,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  MCP Elicitation
                </span>
              </div>
            </SlideUpFade>
          )}

          <SlideUpFade startFrame={SECTION_IN + 10} distance={25} style={{ marginBottom: 20 }}>
            <BlurReveal
              text="주문 전달 경로"
              startFrame={SECTION_IN + 10}
              fontSize={40}
              fontWeight={700}
              color={fs.text}
              stagger={5}
            />
          </SlideUpFade>

          {showBubble3 && (
            <SlideUpFade startFrame={1715} distance={20} style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: fs.font,
                  fontSize: 16,
                  color: fs.textDim,
                  lineHeight: 1.5,
                  wordBreak: 'keep-all',
                  letterSpacing: fs.letterSpacing,
                }}
              >
                작업 중간에
                <br />
                <span style={{ color: fs.text, fontWeight: 600 }}>
                  "어떻게 할까요?"
                </span>{' '}
                질문
              </div>
            </SlideUpFade>
          )}

          {showChoices && (
            <SlideUpFade startFrame={1958} distance={15}>
              <div
                style={{
                  fontFamily: fs.font,
                  fontSize: 16,
                  color: fs.textDim,
                  lineHeight: 1.5,
                  wordBreak: 'keep-all',
                  letterSpacing: fs.letterSpacing,
                  borderLeft: `3px solid rgba(255,197,5,0.4)`,
                  paddingLeft: 16,
                }}
              >
                여기 두 가지 선택지가 있는데
              </div>
            </SlideUpFade>
          )}
        </div>

        {/* 우: 채팅 UI 목업 (글래스모피즘) */}
        <div style={{ flex: 1 }}>
          <GlassCard
            padding={28}
            glow
            glowColor="accent"
            style={{
              borderRadius: 20,
              minHeight: 420,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 채팅 헤더 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingBottom: 20,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${fs.accent}, rgba(255,197,5,0.3))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                ✦
              </div>
              <div>
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 13,
                    fontWeight: 600,
                    color: fs.text,
                  }}
                >
                  Claude
                </div>
                <div
                  style={{
                    fontFamily: fs.font,
                    fontSize: 11,
                    color: 'rgba(100,220,100,0.8)',
                  }}
                >
                  ● MCP 연결됨
                </div>
              </div>
            </div>

            {/* 버블들 */}
            <div style={{ flex: 1 }}>
              {showBubble1 && (
                <ChatBubble
                  text="이미지 최적화 작업 시작해줘"
                  isAI={false}
                  startFrame={bubble1Start}
                />
              )}
              {showBubble2 && (
                <ChatBubble
                  text="네, 시작하겠습니다. 작업 중 확인이 필요한 사항이 생겼어요."
                  isAI
                  startFrame={bubble2Start}
                />
              )}
              {showBubble3 && (
                <ChatBubble
                  text="WebP 변환 시 원본 파일을 어떻게 처리할까요?"
                  isAI
                  startFrame={bubble3Start}
                />
              )}

              {/* 선택지 */}
              {showChoices && (
                <div
                  style={{
                    marginLeft: 38,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <ChoiceCard
                    label="원본 보존"
                    description="원본 파일을 /backup 폴더에 유지합니다"
                    startFrame={choiceStart}
                    index={0}
                  />
                  <ChoiceCard
                    label="원본 삭제"
                    description="변환 완료 후 원본을 자동 삭제합니다"
                    startFrame={choiceStart}
                    index={1}
                  />
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// 메인 Scene06
// ─────────────────────────────────────────────

export const Scene06Precision: React.FC = () => {
  const frame = useCurrentFrame();

  // sceneOut fade
  const sceneOpacity = interpolate(frame, [FADE_START, DURATION], [1, 0], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 섹션 가시성 범위
  const showLoop = frame < 740;
  const showEffort = frame >= 740 && frame < 1549;
  const showMCP = frame >= 1534;

  return (
    <AbsoluteFill style={{ background: fs.bg, opacity: sceneOpacity }}>
      <GrainOverlay />

      {/* Part 1: /loop */}
      {showLoop && <LoopSection />}

      {/* Part 2: /effort */}
      {showEffort && <EffortSection />}

      {/* Part 3: MCP Elicitation */}
      {showMCP && <MCPSection />}
    </AbsoluteFill>
  );
};
