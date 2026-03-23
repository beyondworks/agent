import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from 'remotion';

// ─── 색상 팔레트 ───
const C = {
  bg: '#0a0a0a',
  card: '#18181b',
  cardBorder: '#27272a',
  accent: '#006FEE',
  accentLight: '#338ef7',
  accentGlow: 'rgba(0,111,238,0.15)',
  success: '#17c964',
  warning: '#f5a524',
  danger: '#f31260',
  text: '#ecedee',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  white: '#ffffff',
  codeBg: '#1e1e2e',
  codeGreen: '#a6e3a1',
  codeBlue: '#89b4fa',
  codePurple: '#cba6f7',
  codeYellow: '#f9e2af',
  codeOrange: '#fab387',
};

// ─── SVG 아이콘 컴포넌트들 ───

function MoneyIcon({ size = 48, color = C.danger }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ClockIcon({ size = 48, color = C.success }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CodeIcon({ size = 48, color = C.codeBlue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function RobotIcon({ size = 48, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
    </svg>
  );
}

function ChartIcon({ size = 48, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function TerminalIcon({ size = 48, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function TargetIcon({ size = 48, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function XIcon({ size = 24, color = C.danger }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon({ size = 24, color = C.success }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ServerIcon({ size = 48, color = C.codeGreen }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function SendIcon({ size = 24, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ─── 유틸 ───

function ease(frame: number, from: number, to: number, start: number, end: number) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function splitSubtitle(text: string, maxChars = 28): string[] {
  if (!text) return [];
  const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  const segments: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxChars) { segments.push(sentence); continue; }
    const clauses = sentence.split(/(?<=[,;])\s*/).map(s => s.trim()).filter(Boolean);
    let buffer = '';
    for (const clause of clauses) {
      if (buffer && (buffer + ' ' + clause).length > maxChars) {
        segments.push(buffer); buffer = clause;
      } else {
        buffer = buffer ? buffer + ' ' + clause : clause;
      }
    }
    if (buffer.length > maxChars) {
      const words = buffer.split(/\s+/);
      let line = '';
      for (const word of words) {
        if (line && (line + ' ' + word).length > maxChars) { segments.push(line); line = word; }
        else { line = line ? line + ' ' + word : word; }
      }
      if (line) segments.push(line);
    } else if (buffer) { segments.push(buffer); }
  }
  return segments.length > 0 ? segments : [text.slice(0, maxChars)];
}

/** 나레이션에서 핵심 키워드 추출 */
function extractKeyPhrases(narration: string): string[] {
  const phrases: string[] = [];
  // 숫자+단위
  const nums = narration.match(/\d+[\d,.]*\s*[만천백억]?\s*[원시간분초개달러%]+/g);
  if (nums) phrases.push(...nums.slice(0, 2));
  // 따옴표 텍스트
  const quoted = narration.match(/[''""'"]([^''""'"]{2,15})[''""'"]/g);
  if (quoted) phrases.push(...quoted.slice(0, 2).map(q => q.replace(/[''""'"]/g, '')));
  // 강조어
  if (phrases.length < 2) {
    const emphatic = narration.match(/(?:가장|완벽|확실|진짜|바로)\s*\S{2,8}/g);
    if (emphatic) phrases.push(...emphatic.slice(0, 1));
  }
  return phrases.slice(0, 3);
}

// ─── 공통 자막 레이어 ───

function SubtitleLayer({ narration, audioDurationSec, durationInFrames, fps }: {
  narration: string;
  audioDurationSec?: number;
  durationInFrames: number;
  fps: number;
}) {
  const frame = useCurrentFrame();
  const segments = splitSubtitle(narration);
  const totalSegments = segments.length;
  const audioDuration = audioDurationSec
    ? Math.round(audioDurationSec * fps)
    : durationInFrames;
  const subtitleDuration = Math.min(audioDuration, durationInFrames);
  const framesPerSegment = totalSegments > 0
    ? Math.floor(subtitleDuration / totalSegments) : durationInFrames;
  const currentIdx = frame < subtitleDuration
    ? Math.min(Math.floor(frame / framesPerSegment), totalSegments - 1) : -1;
  const current = currentIdx >= 0 ? (segments[currentIdx] ?? '') : '';

  const segStart = currentIdx >= 0 ? currentIdx * framesPerSegment : 0;
  const subOpacity = currentIdx >= 0
    ? interpolate(frame, [segStart, segStart + Math.min(fps * 0.12, framesPerSegment * 0.08)], [0, 1], {
        extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
      })
    : 0;

  if (!current) return null;

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 10,
          paddingLeft: 32,
          paddingRight: 32,
          paddingTop: 12,
          paddingBottom: 12,
          maxWidth: '85%',
          opacity: subOpacity,
          transform: `translateY(${interpolate(subOpacity, [0, 1], [6, 0])}px)`,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p
          style={{
            color: C.white,
            fontSize: 38,
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.5,
            margin: 0,
            fontFamily: 'Pretendard, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {current}
        </p>
      </div>
    </AbsoluteFill>
  );
}

// ─── 키워드 오버레이 (나레이션 기반 시간차 등장) ───

function KeywordOverlay({ narration, fps }: { narration: string; fps: number }) {
  const frame = useCurrentFrame();
  const keywords = extractKeyPhrases(narration);
  if (keywords.length === 0) return null;

  const kwStart = Math.round(fps * 0.6);
  const kwDuration = Math.round(fps * 2.5);

  return (
    <>
      {keywords.map((kw, i) => {
        const offset = kwStart + i * Math.round(fps * 0.8);
        const kwSpring = spring({ frame: frame - offset, fps, config: { damping: 12, stiffness: 100 } });
        const fadeOut = interpolate(
          frame,
          [offset + kwDuration, offset + kwDuration + Math.round(fps * 0.3)],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        const visible = frame >= offset && frame < offset + kwDuration + Math.round(fps * 0.3);
        if (!visible) return null;

        const scale = interpolate(kwSpring, [0, 1], [0.5, 1]);
        const opacity = Math.min(kwSpring, fadeOut);
        const yPositions = [130, 190, 250];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: yPositions[i % 3],
              left: '50%',
              opacity,
              transform: `translateX(-50%) scale(${scale})`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(0,111,238,0.12)',
                border: '1px solid rgba(0,111,238,0.3)',
                borderRadius: 12,
                padding: '8px 20px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: C.accentLight,
                  fontFamily: 'Pretendard, sans-serif',
                  textShadow: '0 2px 12px rgba(0,111,238,0.4)',
                }}
              >
                {kw}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 1: 89만원 맥미니 — 비싼 장비 경고
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene1({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 가격 카운터 애니메이션
  const priceProgress = ease(frame, 0, 890000, 15, 60);
  const priceShake = frame > 50 && frame < 70 ? Math.sin(frame * 1.5) * 3 : 0;

  // 장바구니 → X 표시
  const cartScale = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 80 } });
  const xScale = spring({ frame: frame - 70, fps, config: { damping: 8, stiffness: 120 } });

  // 하강 그래프
  const graphProgress = ease(frame, 0, 1, 80, 160);

  // 페이드
  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* 배경 그리드 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* 중앙 콘텐츠 */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
          {/* 가격 카드 */}
          <div
            style={{
              backgroundColor: C.card,
              borderRadius: 16,
              border: `1px solid ${C.cardBorder}`,
              padding: '40px 60px',
              transform: `scale(${cartScale}) translateX(${priceShake}px)`,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
              <MoneyIcon size={40} color={C.danger} />
              <span style={{ fontSize: 18, color: C.textMuted, fontFamily: 'Pretendard, sans-serif' }}>
                최신형 맥 미니
              </span>
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: C.danger,
                fontFamily: 'Pretendard, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {Math.round(priceProgress).toLocaleString()}
              <span style={{ fontSize: 28, color: C.textMuted }}>원</span>
            </div>

            {/* X 오버레이 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${xScale})`,
                opacity: xScale,
              }}
            >
              <XIcon size={120} color={C.danger} />
            </div>
          </div>

          {/* 하강 그래프 */}
          <div
            style={{
              width: 500,
              height: 120,
              opacity: ease(frame, 0, 1, 75, 90),
            }}
          >
            <svg width="500" height="120" viewBox="0 0 500 120">
              <path
                d="M0,20 C80,25 150,40 250,65 S400,100 500,110"
                fill="none"
                stroke={C.danger}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={600}
                strokeDashoffset={600 * (1 - graphProgress)}
              />
              {/* 그래프 아래 영역 */}
              <path
                d="M0,20 C80,25 150,40 250,65 S400,100 500,110 L500,120 L0,120 Z"
                fill={`${C.danger}08`}
                style={{ clipPath: `inset(0 ${100 - graphProgress * 100}% 0 0)` }}
              />
            </svg>
            <div style={{ textAlign: 'center', fontSize: 14, color: C.textDim, fontFamily: 'Pretendard, sans-serif', marginTop: 8 }}>
              투자 대비 효율 하락
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 2: 퇴근 시간 앞당기기 — 시간 절약
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene2({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 시계 바늘 회전
  const hourAngle = interpolate(frame, [0, durationInFrames], [0, 360], { extrapolateRight: 'clamp' });
  const minuteAngle = interpolate(frame, [0, durationInFrames], [0, 360 * 4], { extrapolateRight: 'clamp' });

  // 로드맵 항목 등장
  const roadmapItems = ['코딩 학습', '서버 구축', '자동화 설정', '퇴근 후 자유'];

  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* fix: 명시적 flexDirection row — 시계(왼쪽)와 로드맵(오른쪽)이 나란히 */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', padding: 80, gap: 60 }}>
        {/* 왼쪽: 시계 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: `3px solid ${C.cardBorder}`,
              position: 'relative',
              backgroundColor: C.card,
              boxShadow: `0 0 60px ${C.accentGlow}`,
              transform: `scale(${spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 60 } })})`,
            }}
          >
            {/* 시침 */}
            <div
              style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                width: 4,
                height: 80,
                backgroundColor: C.text,
                borderRadius: 2,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              }}
            />
            {/* 분침 */}
            <div
              style={{
                position: 'absolute',
                bottom: '50%',
                left: '50%',
                width: 2,
                height: 110,
                backgroundColor: C.accent,
                borderRadius: 2,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              }}
            />
            {/* 중심점 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: C.accent,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* 오른쪽: 로드맵 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
          <div style={{
            fontSize: 16, fontWeight: 500, color: C.accentLight,
            fontFamily: 'Pretendard, sans-serif', letterSpacing: '0.08em',
            opacity: ease(frame, 0, 1, 10, 25),
          }}>
            ROADMAP
          </div>
          {roadmapItems.map((item, i) => {
            const delay = 30 + i * 25;
            const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
            const isLast = i === roadmapItems.length - 1;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: itemSpring, transform: `translateX(${interpolate(itemSpring, [0, 1], [40, 0])}px)` }}>
                {/* 커넥터 라인 */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: isLast ? C.success : `${C.accent}20`,
                  border: `2px solid ${isLast ? C.success : C.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {isLast ? <CheckIcon size={18} color={C.white} /> : (
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.accent, fontFamily: 'Pretendard, sans-serif' }}>{i + 1}</span>
                  )}
                </div>
                <div style={{
                  backgroundColor: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`,
                  padding: '14px 24px', flex: 1,
                }}>
                  <span style={{
                    fontSize: 20, fontWeight: 600,
                    color: isLast ? C.success : C.text,
                    fontFamily: 'Pretendard, sans-serif',
                  }}>
                    {item}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 3: 바이브 코딩 — 코드 없이 결과물
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene3({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 코드 블록이 흐려지고 자연어가 등장
  const codeOpacity = ease(frame, 0.9, 0.15, 30, 80);
  const nlOpacity = ease(frame, 0, 1, 60, 90);

  // 플로우: 자연어 → AI → 결과물
  const flowItems = [
    { label: '자연어 지시', icon: 'speak' },
    { label: 'AI 해석', icon: 'robot' },
    { label: '결과물 생성', icon: 'check' },
  ];

  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0c0c1d', opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* fix: 명시적 flexDirection column — 코드카드(위)와 플로우차트(아래)가 세로 */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 50 }}>
        {/* 상단: 코드 → 자연어 전환 */}
        <div style={{ position: 'relative', width: 700, height: 180 }}>
          {/* 코드 블록 (페이드 아웃) */}
          <div style={{
            position: 'absolute', inset: 0, opacity: codeOpacity,
            backgroundColor: C.codeBg, borderRadius: 16, padding: 24,
            border: `1px solid ${C.cardBorder}`,
            filter: `blur(${ease(frame, 0, 4, 40, 80)}px)`,
          }}>
            {['const app = express();', 'app.use(cors());', 'app.listen(3000, () => {', '  console.log("ready");', '});'].map((line, i) => (
              <div key={i} style={{ fontSize: 18, fontFamily: '"SF Mono", monospace', color: C.codeGreen, height: 28, opacity: 0.8 }}>
                {line}
              </div>
            ))}
          </div>

          {/* 자연어 카드 (페이드 인) — 중앙 정렬 */}
          <div style={{
            position: 'absolute', inset: 0, opacity: nlOpacity,
            backgroundColor: C.card, borderRadius: 16, padding: 24,
            border: `1px solid ${C.accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
            boxShadow: `0 0 30px ${C.accentGlow}`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: `linear-gradient(135deg, ${C.accent}, ${C.codePurple})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CodeIcon size={28} color={C.white} />
            </div>
            <div>
              <div style={{ fontSize: 14, color: C.textMuted, fontFamily: 'Pretendard, sans-serif', marginBottom: 6 }}>바이브 코딩</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.white, fontFamily: 'Pretendard, sans-serif' }}>
                "경쟁사 분석 자동화 시스템 만들어줘"
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 플로우차트 — 가로 배치 */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, opacity: ease(frame, 0, 1, 80, 100) }}>
          {flowItems.map((item, i) => {
            const delay = 90 + i * 20;
            const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                <div
                  style={{
                    backgroundColor: C.card,
                    borderRadius: 16,
                    border: `1px solid ${C.cardBorder}`,
                    padding: '16px 28px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    transform: `scale(${itemSpring})`,
                    opacity: itemSpring,
                  }}
                >
                  {item.icon === 'speak' && <SendIcon size={22} color={C.accent} />}
                  {item.icon === 'robot' && <RobotIcon size={22} color={C.codePurple} />}
                  {item.icon === 'check' && <CheckIcon size={22} color={C.success} />}
                  <span style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: 'Pretendard, sans-serif' }}>
                    {item.label}
                  </span>
                </div>
                {i < flowItems.length - 1 && (
                  <div style={{ opacity: ease(frame, 0, 1, delay + 10, delay + 18) }}>
                    <ArrowRightIcon size={28} color={C.textDim} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 4: 에이전트 AI — 도서관 사서 vs 행동 대장
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene4({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const leftDim = ease(frame, 1, 0.4, 90, 130);
  const rightGlow = ease(frame, 0, 1, 100, 140);

  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* fix: 명시적 flexDirection row — 왼쪽 카드·VS·오른쪽 카드가 나란히 */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', padding: 80, gap: 40 }}>
        {/* 왼쪽: 도서관 사서 (수동) */}
        <div style={{
          flex: 1, backgroundColor: C.card, borderRadius: 16,
          border: `1px solid ${C.cardBorder}`, padding: 40,
          opacity: leftDim,
          transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 80 } })})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            backgroundColor: `${C.textDim}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TerminalIcon size={40} color={C.textDim} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.text, fontFamily: 'Pretendard, sans-serif' }}>
            대화형 AI
          </div>
          <div style={{ fontSize: 15, color: C.textMuted, fontFamily: 'Pretendard, sans-serif', textAlign: 'center', lineHeight: 1.6 }}>
            질문하면 답변
          </div>
          <div style={{
            fontSize: 14, color: C.textDim, fontFamily: 'Pretendard, sans-serif',
            padding: '6px 16px', borderRadius: 8, backgroundColor: `${C.textDim}10`,
            opacity: ease(frame, 0, 1, 50, 65),
          }}>
            도서관 사서
          </div>

          {/* 수동 깜빡임 */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '80%', height: 8, borderRadius: 4,
              backgroundColor: `${C.textDim}15`,
              opacity: 0.3 + (Math.sin(frame * 0.05 + i) > 0 ? 0.3 : 0),
            }} />
          ))}
        </div>

        {/* VS 구분선 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: ease(frame, 0, 1, 40, 60),
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            backgroundColor: C.card, border: `2px solid ${C.cardBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: C.textMuted, fontFamily: 'Pretendard, sans-serif',
          }}>
            VS
          </div>
        </div>

        {/* 오른쪽: 행동 대장 (에이전트) */}
        <div style={{
          flex: 1, backgroundColor: C.card, borderRadius: 16,
          border: `1px solid ${C.accent}40`, padding: 40,
          transform: `scale(${spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 80 } })})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
          boxShadow: `0 0 ${40 * rightGlow}px ${C.accentGlow}`,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: `linear-gradient(135deg, ${C.accent}20, ${C.codePurple}20)`,
            border: `1px solid ${C.accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RobotIcon size={40} color={C.accent} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.white, fontFamily: 'Pretendard, sans-serif' }}>
            에이전트 AI
          </div>
          <div style={{ fontSize: 15, color: C.textMuted, fontFamily: 'Pretendard, sans-serif', textAlign: 'center', lineHeight: 1.6 }}>
            권한 위임받아 자율 행동
          </div>
          <div style={{
            fontSize: 14, color: C.accent, fontFamily: 'Pretendard, sans-serif',
            padding: '6px 16px', borderRadius: 8,
            backgroundColor: `${C.accent}10`, border: `1px solid ${C.accent}30`,
            opacity: ease(frame, 0, 1, 70, 85),
          }}>
            행동 대장
          </div>

          {/* 활발한 액션 바 */}
          {[0, 1, 2].map(i => {
            const barDelay = 100 + i * 15;
            const barWidth = ease(frame, 0, 60 + i * 15, barDelay, barDelay + 30);
            return (
              <div key={i} style={{
                width: '80%', height: 8, borderRadius: 4,
                backgroundColor: `${C.accent}10`,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${barWidth}%`, height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${C.accent}, ${C.codePurple})`,
                }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 5: 2만원으로 24시간 AI 비서
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene5({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 도넛 차트 (24시간)
  const donutProgress = ease(frame, 0, 1, 20, 90);
  const circumference = 2 * Math.PI * 85;

  // 아키텍처 항목들
  const archItems = [
    { label: '경쟁사 모니터링', color: C.accent },
    { label: 'B2B 리드 수집', color: C.success },
    { label: '일일 리포트', color: C.codeOrange },
    { label: '텔레그램 전송', color: C.codePurple },
  ];

  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* fix: 명시적 flexDirection row — 도넛(왼쪽)과 아키텍처(오른쪽)이 나란히 */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', padding: 80, gap: 60 }}>
        {/* 왼쪽: 도넛 + 가격 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          {/* 헤더 */}
          <div style={{ opacity: ease(frame, 0, 1, 5, 20) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 6, height: 24, borderRadius: 3, background: C.accent }} />
              <span style={{ fontSize: 15, fontWeight: 500, color: C.accentLight, fontFamily: 'Pretendard, sans-serif', letterSpacing: '0.08em' }}>
                COST
              </span>
            </div>
          </div>

          <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 60 } })})` }}>
            <circle cx="110" cy="110" r="85" fill="none" stroke={C.cardBorder} strokeWidth="14" />
            <circle
              cx="110" cy="110" r="85"
              fill="none" stroke={C.accent} strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={circumference * (1 - donutProgress)}
              transform="rotate(-90 110 110)"
            />
            <text x="110" y="100" textAnchor="middle" fontSize="18" fill={C.textMuted} fontFamily="Pretendard, sans-serif">
              월
            </text>
            <text x="110" y="130" textAnchor="middle" fontSize="36" fontWeight="800" fill={C.white} fontFamily="Pretendard, sans-serif">
              2만원
            </text>
          </svg>

          <div style={{
            backgroundColor: `${C.success}10`,
            border: `1px solid ${C.success}30`,
            borderRadius: 16, padding: '10px 24px',
            opacity: ease(frame, 0, 1, 90, 110),
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.success, fontFamily: 'Pretendard, sans-serif' }}>
              24시간 무중단 가동
            </span>
          </div>
        </div>

        {/* 오른쪽: 아키텍처 플로우 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          {archItems.map((item, i) => {
            const delay = 40 + i * 22;
            const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80 } });
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                opacity: itemSpring,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [50, 0])}px)`,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  backgroundColor: `${item.color}12`,
                  border: `1px solid ${item.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ChartIcon size={22} color={item.color} />
                </div>
                <div style={{
                  flex: 1, backgroundColor: C.card, borderRadius: 16,
                  border: `1px solid ${C.cardBorder}`, padding: '14px 20px',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: 'Pretendard, sans-serif' }}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* 연결선: 전체 → 텔레그램 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginTop: 12,
            opacity: ease(frame, 0, 1, 130, 150),
            transform: `translateY(${ease(frame, 15, 0, 130, 150)}px)`,
          }}>
            <ArrowRightIcon size={20} color={C.codePurple} />
            <div style={{
              backgroundColor: `${C.codePurple}12`, border: `1px solid ${C.codePurple}30`,
              borderRadius: 16, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.codePurple, fontFamily: 'Pretendard, sans-serif' }}>
                매일 아침 8시 자동 보고
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 6: 터미널 공포 — 비개발자의 벽
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene6({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 터미널 줄 등장
  const termLines = [
    '$ docker compose up -d',
    'ERROR: Cannot connect to daemon',
    '$ export DOCKER_HOST=unix:///var',
    'permission denied',
    '$ sudo systemctl start docker',
    'Failed to start docker.service',
  ];

  // 커서 깜빡
  const cursorBlink = Math.sin(frame * 0.2) > 0;

  // 혼란 파동
  const confusionScale = 1 + Math.sin(frame * 0.06) * 0.015;

  const fadeIn = ease(frame, 0, 1, 0, 15);
  const fadeOut = ease(frame, 1, 0, durationInFrames - 15, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050508', opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 터미널 윈도우 */}
        <div
          style={{
            width: 800,
            backgroundColor: '#0d0d0d',
            borderRadius: 16,
            border: `1px solid ${C.cardBorder}`,
            overflow: 'hidden',
            transform: `scale(${confusionScale})`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* 타이틀바 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderBottom: `1px solid ${C.cardBorder}`,
            backgroundColor: '#111',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
            <span style={{ marginLeft: 12, fontSize: 13, color: C.textDim, fontFamily: 'monospace' }}>
              Terminal — zsh
            </span>
          </div>

          {/* 터미널 내용 */}
          <div style={{ padding: '20px 24px', minHeight: 320 }}>
            {termLines.map((line, i) => {
              const lineDelay = 15 + i * 18;
              const lineOpacity = ease(frame, 0, 1, lineDelay, lineDelay + 8);
              const isError = line.includes('ERROR') || line.includes('denied') || line.includes('Failed');

              // 타이핑 효과
              const typingProgress = ease(frame, 0, 1, lineDelay, lineDelay + 12);
              const visibleChars = Math.floor(line.length * typingProgress);

              return (
                <div key={i} style={{ height: 30, opacity: lineOpacity, display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 16,
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    color: isError ? C.danger : C.textMuted,
                    fontWeight: isError ? 600 : 400,
                  }}>
                    {line.slice(0, visibleChars)}
                  </span>
                </div>
              );
            })}
            {/* 마지막 커서 */}
            <div style={{ height: 30, display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontFamily: 'monospace', color: C.textMuted }}>$ </span>
              {cursorBlink && (
                <span style={{ fontSize: 16, fontFamily: 'monospace', color: C.accent }}>█</span>
              )}
            </div>
          </div>
        </div>

        {/* 좌절 표현: 닫기 제스처 — top-center */}
        <div style={{
          position: 'absolute',
          top: 180,
          left: '50%',
          transform: `translateX(-50%) scale(${spring({ frame: frame - 140, fps, config: { damping: 10, stiffness: 100 } })})`,
          opacity: ease(frame, 0, 1, 140, 160),
        }}>
          <div style={{
            backgroundColor: `${C.danger}10`,
            border: `1px solid ${C.danger}30`,
            borderRadius: 16, padding: '12px 24px',
          }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.danger, fontFamily: 'Pretendard, sans-serif' }}>
              조용히 창을 닫습니다
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 씬 7: 우리가 진짜 원하는 건 — 핵심 목표
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Scene7({ scene }: { scene: DemoSceneData }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 복잡한 파이프들이 사라짐
  const pipeOpacity = ease(frame, 0.7, 0, 60, 120);

  // 중앙 목표 등장
  const goalSpring = spring({ frame: frame - 100, fps, config: { damping: 10, stiffness: 60 } });

  // 글로우 펄스
  const glowSize = 30 + Math.sin(frame * 0.05) * 10;

  const fadeIn = ease(frame, 0, 1, 0, 15);
  // 마지막 씬: 페이드아웃 없이 유지 (검은 화면 방지)
  const fadeOut = 1;

  // 복잡한 설정 아이콘들
  const complexIcons = [
    { x: 200, y: 250, label: 'Docker' },
    { x: 400, y: 180, label: '환경변수' },
    { x: 600, y: 300, label: '방화벽' },
    { x: 1300, y: 200, label: 'SSL' },
    { x: 1500, y: 280, label: 'DNS' },
    { x: 1700, y: 220, label: 'CI/CD' },
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.bg} 0%, #0c0c1d 50%, #0a1628 100%)`, opacity: Math.min(fadeIn, fadeOut) }}>
      {scene.audioDataUrl && <Audio src={scene.audioDataUrl} volume={1} />}

      {/* 복잡한 아이콘들 (사라짐) */}
      {complexIcons.map((ic, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: ic.x,
            top: ic.y,
            opacity: pipeOpacity * (0.5 + Math.sin(frame * 0.03 + i) * 0.2),
            transform: `scale(${pipeOpacity})`,
          }}
        >
          <div style={{
            backgroundColor: C.card,
            borderRadius: 10,
            border: `1px solid ${C.cardBorder}`,
            padding: '8px 14px',
          }}>
            <TerminalIcon size={20} color={C.textDim} />
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: 'Pretendard, sans-serif', marginTop: 4 }}>
              {ic.label}
            </div>
          </div>
        </div>
      ))}

      {/* 연결선들 (사라짐) */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: pipeOpacity * 0.3 }}>
        {complexIcons.map((ic, i) => (
          <line key={i}
            x1={ic.x + 30} y1={ic.y + 20}
            x2={960} y2={540}
            stroke={C.cardBorder} strokeWidth="1" strokeDasharray="8 4"
          />
        ))}
      </svg>

      {/* 중앙 목표 */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
            transform: `scale(${goalSpring})`,
            opacity: goalSpring,
          }}
        >
          {/* 글로우 */}
          <div style={{
            position: 'absolute',
            width: 200 + glowSize,
            height: 200 + glowSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }} />

          {/* 타겟 아이콘 */}
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.accent}, ${C.codePurple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 40px ${C.accentGlow}`,
            position: 'relative', zIndex: 1,
          }}>
            <TargetIcon size={48} color={C.white} />
          </div>

          {/* 텍스트 */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 48, fontWeight: 800, color: C.white,
              fontFamily: 'Pretendard, sans-serif', letterSpacing: '-0.02em',
            }}>
              우리가 진짜 원하는 건
            </div>
            <div style={{
              fontSize: 28, fontWeight: 400, color: C.textMuted,
              fontFamily: 'Pretendard, sans-serif', marginTop: 12,
              opacity: ease(frame, 0, 1, 140, 165),
            }}>
              딱 하나입니다
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <KeywordOverlay narration={scene.narration} fps={fps} />
      <SubtitleLayer narration={scene.narration} audioDurationSec={scene.audioDurationSec} durationInFrames={durationInFrames} fps={fps} />
    </AbsoluteFill>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입 + 메인 컴포지션
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface DemoSceneData {
  sceneNumber: number;
  narration: string;
  durationSec: number;
  audioDataUrl?: string;
  audioDurationSec?: number;
}

export interface DemoVideoProps {
  scenes: DemoSceneData[];
  fps: number;
}

const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

export function DemoVideo({ scenes = [], fps = 30 }: DemoVideoProps) {
  const sceneFrames = scenes.map(s => Math.round(s.durationSec * (fps || 30)));
  const transitionFrames = Math.round((fps || 30) * 0.3);

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {scenes.map((scene, i) => {
        const SceneComp = SCENE_COMPONENTS[i % SCENE_COMPONENTS.length];
        const from = currentFrame;
        const duration = sceneFrames[i];

        currentFrame += duration - (i < scenes.length - 1 ? transitionFrames : 0);

        return (
          <Sequence
            key={scene.sceneNumber}
            from={from}
            durationInFrames={duration}
            name={`씬 ${scene.sceneNumber}`}
          >
            <SceneComp scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
