import React from 'react';
import { memphisTheme as t, memphisShadowMap } from '../themes/memphis';
import { T } from './typography';
import { MemphisCard } from './MemphisCard';
import { ServiceLogo } from './ServiceLogo';

/* ═══════════════════════════════════════════════════════════
   Slide-level primitives
   — Frame = presentation wrapper (rounded, black shadow)
   — Content components follow Memphis theme (sharp, colored shadow)
   ═══════════════════════════════════════════════════════════ */

const pageStyles: React.CSSProperties = {
  background: t.bgPage,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 48,
  padding: '48px 20px',
};

/* ── Slide frame (presentation wrapper — NOT Memphis-styled) ── */

const SlideFrame: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: '100%', maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <span
      style={{
        fontFamily: t.fontMono,
        fontSize: 12,
        fontWeight: 500,
        color: t.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        border: `3px solid ${t.border}`,
        borderRadius: 12,
        boxShadow: `4px 4px 0 ${t.border}`,
        overflow: 'hidden',
        position: 'relative',
        background: t.bgSlide,
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Slide content (absolute overlay) ── */

const SC: React.FC<{
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ children, bg, style }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg }}>
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: '2%',
        ...style,
      }}
    >
      {children}
    </div>
  </div>
);

/* ── Section marker ── */

const Marker: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = t.textMuted,
}) => (
  <div
    style={{
      fontFamily: t.fontMono,
      fontSize: '0.52vw',
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      opacity: 0.7,
      color,
    }}
  >
    {children}
  </div>
);

/* ── Neutral card (slide bg + Memphis border + colored shadow) ── */

const NeutralCard: React.FC<{
  children: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
}> = ({ children, padding = '2.5% 3%', style: extra }) => (
  <div
    style={{
      border: `${t.borderWidth} solid ${t.border}`,
      borderRadius: t.radius,
      boxShadow: memphisShadowMap.neutral,
      padding,
      background: t.bgSlide,
      wordBreak: 'keep-all',
      ...extra,
    }}
  >
    {children}
  </div>
);

/* ── Memphis card internal title (uppercase, 900) ── */

const mcTitle: React.CSSProperties = {
  fontFamily: t.fontHeading,
  fontSize: '1vw',
  fontWeight: 900,
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5vw',
  wordBreak: 'keep-all',
};

/* ── Memphis card internal body (text-primary, opacity 0.7) ── */

const mcBody: React.CSSProperties = {
  fontSize: '0.7vw',
  lineHeight: 1.7,
  color: t.textPrimary,
  opacity: 0.7,
  wordBreak: 'keep-all',
};

/* ═══════════════════════════════════════════════════════════
   Script 001 — AI 도구가 다 비슷해졌을 때

   Layout sequence (no same family twice in a row):
   01 editorial → 02 split → 03 split(reversed) → 04 center
   → 05 asymmetric(hero-sup) → 06 asymmetric(8-4) → 07 asymmetric(4-8)
   → 08 grid(staggered) → 09 asymmetric(callout) → 10 sequence(zigzag)
   → 11 grid(bento) → 12 bleed
   ═══════════════════════════════════════════════════════════ */

export const Script001Deck: React.FC = () => {
  return (
    <div style={pageStyles}>
      {/* ═══ S01 오프닝 · magazine-editorial · title ═══
          패턴 정체성: 비대칭 타이포, 드라마틱 크기 대비, 에디토리얼 여백
          헤드라인 스케일: title (3.5vw) */}
      <SlideFrame label="01 — 오프닝 · magazine-editorial">
        <SC style={{ padding: '7% 8% 4%', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '75%' }}>
            <div style={T.headline('title')}>
              같은 주에 다섯 곳이
            </div>
            <div style={{ ...T.headline('title'), color: t.pink, marginTop: '0.3vw' }}>
              비슷한 걸 출시했습니다
            </div>
          </div>

          {/* 로고 행 — bottom-right (editorial 비대칭) */}
          <div
            style={{
              position: 'absolute',
              bottom: '18%',
              right: '8%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5vw',
            }}
          >
            {(
              [
                ['anthropic', 'Claude'],
                ['openai', 'ChatGPT'],
                ['perplexity', 'Perplexity'],
                ['google', 'Google'],
                ['microsoft', 'Microsoft'],
              ] as const
            ).map(([svc, name], i) => (
              <React.Fragment key={svc}>
                {i > 0 && (
                  <span style={{ opacity: 0.3, fontSize: '0.75vw', color: t.textMuted }}>·</span>
                )}
                <ServiceLogo service={svc} size="sm" />
                <span style={{ fontFamily: t.fontBody, fontSize: '0.75vw', color: t.textMuted }}>
                  {name}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: '5%', left: '8%' }}>
            <div style={T.cli}>$ compare --tools all --week 2026-03-13</div>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S02 ChatGPT · split-7-5 · section ═══
          패턴: split (텍스트 좌 + 카드 우)
          헤드라인 스케일: section (2.2vw) */}
      <SlideFrame label="02 — ChatGPT 시각화 · split-7-5">
        <SC
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '6% 6% 4%',
            gap: '4%',
          }}
        >
          <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', gap: '1.2vw' }}>
            <Marker color={t.yellow}>CHATGPT VISUALIZATION</Marker>
            <div style={T.headline('section')}>
              사전 제작
              <br />
              라이브러리 방식
            </div>
            <div style={{ ...T.body, maxWidth: '90%', color: t.textSecondary }}>
              미리 만들어놓은 인터랙티브 모델에서
              <br />
              매칭하는 방식입니다. 피타고라스, 옴의 법칙 같은
              <br />
              주제를 요청하면 즉시 로드됩니다.
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <MemphisCard color="yellow" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
                <div style={mcTitle}>
                  <ServiceLogo service="openai" size="md" />
                  ChatGPT
                </div>
                <div style={mcBody}>사전 제작 라이브러리</div>
                <div style={mcBody}>즉시 로드</div>
                <div style={mcBody}>수학·과학 주제 한정</div>
              </div>
            </MemphisCard>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S03 Claude · split-5-7 · section ═══
          패턴: split reversed (카드 좌 + 텍스트 우) */}
      <SlideFrame label="03 — Claude 시각화 · split-5-7">
        <SC
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '6% 6% 4%',
            gap: '18%',
          }}
        >
          <div style={{ flex: 1 }}>
            <MemphisCard color="teal" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5vw' }}>
                <div style={mcTitle}>
                  <ServiceLogo service="anthropic" size="md" />
                  Claude
                </div>
                <div style={mcBody}>실시간 코드 생성</div>
                <div style={mcBody}>커스텀 시각화 가능</div>
                <div style={mcBody}>무료 플랜 포함</div>
              </div>
            </MemphisCard>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2vw' }}>
            <Marker color={t.teal}>CLAUDE VISUALIZATION</Marker>
            <div style={T.headline('section')}>
              실시간
              <br />
              코드 생성 방식
            </div>
            <div style={{ ...T.body, maxWidth: '90%', color: t.textSecondary }}>
              요청을 받으면 처음부터 코드를 작성해서
              <br />
              시각화를 만듭니다. AI 모델 타임라인이나
              <br />
              기업 지도 같은 커스텀도 가능합니다.
            </div>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S04 핵심 메시지 · quote-spotlight · section ═══
          패턴: center (80%+ 여백, 인용문만)
          헤드라인 스케일: section (2.0vw — 인용문) */}
      <SlideFrame label="04 — 핵심 메시지 · quote-spotlight">
        <SC
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10% 15% 6%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5vw',
            }}
          >
            <div style={{ width: '30%', height: 3, background: t.border }} />
            <div>
              <div
                style={{
                  fontFamily: t.fontHeading,
                  fontSize: '2.0vw',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  wordBreak: 'keep-all',
                }}
              >
                차이를 만드는 건 도구가 아니라
              </div>
              <div
                style={{
                  fontFamily: t.fontHeading,
                  fontSize: '2.0vw',
                  fontWeight: 800,
                  lineHeight: 1.4,
                  wordBreak: 'keep-all',
                }}
              >
                무엇을 시키는지를 아는 사람이다
              </div>
            </div>
            <div style={{ width: '30%', height: 3, background: t.border }} />
            <div
              style={{
                fontFamily: t.fontMono,
                fontSize: '0.65vw',
                color: t.textMuted,
                marginTop: '0.5vw',
              }}
            >
              — Tools converge, designers diverge
            </div>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S05 Canva · hero-supporting (VERTICAL) · detail ═══
          패턴: hero-supporting (상단 hero 70% + 하단 spec 행 30%)
          헤드라인 스케일: detail (1.6vw) */}
      <SlideFrame label="05 — Canva Magic Layers · hero-supporting">
        <SC style={{ padding: '5% 7% 4%', gap: '0.8vw' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MemphisCard color="pink" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6vw' }}>
                <Marker color={t.textPrimary}>CANVA UPDATE</Marker>
                <div
                  style={{
                    fontFamily: t.fontHeading,
                    fontSize: '1.6vw',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6vw',
                  }}
                >
                  <ServiceLogo service="canva" size="md" />
                  Magic Layers
                </div>
                <div
                  style={{
                    fontSize: '0.8vw',
                    lineHeight: 1.75,
                    color: t.textPrimary,
                    opacity: 0.7,
                    wordBreak: 'keep-all',
                    maxWidth: '80%',
                  }}
                >
                  AI로 생성한 이미지를 자동으로 레이어 분리.
                  <br />
                  배경, 인물, 오브젝트가 개별 레이어로 분리되어
                  <br />
                  포토샵 없이 클릭 한 번으로 누끼 작업이 끝납니다.
                </div>
              </div>
            </MemphisCard>
          </div>

          <div style={{ display: 'flex', gap: '2%' }}>
            {[
              { label: '레이어 분리', desc: '배경·인물·오브젝트' },
              { label: '실사 사진 지원', desc: 'AI 이미지 + 실제 사진' },
              { label: '모든 플랜 무료', desc: 'Free·Pro·Teams' },
            ].map(({ label, desc }) => (
              <NeutralCard
                key={label}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '0.3vw',
                }}
              >
                <div
                  style={{
                    fontFamily: t.fontHeading,
                    fontSize: '0.75vw',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    wordBreak: 'keep-all',
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: '0.6vw', color: t.textSecondary, wordBreak: 'keep-all' }}>
                  {desc}
                </div>
              </NeutralCard>
            ))}
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S06 Perplexity · asymmetric-8-4 · detail ═══
          패턴: asymmetric (텍스트 60% + 카드 40%)
          헤드라인 스케일: detail (1.6vw) */}
      <SlideFrame label="06 — Perplexity Computer · asymmetric-8-4">
        <SC
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '6% 6% 4%',
            gap: '4%',
          }}
        >
          <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', gap: '1vw' }}>
            <Marker color={t.purple}>PERPLEXITY COMPUTER</Marker>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6vw' }}>
              <ServiceLogo service="perplexity" size="md" />
              <span style={T.headline('detail')}>24시간 AI 에이전트</span>
            </div>
            <div style={{ ...T.body, maxWidth: '85%', color: t.textSecondary }}>
              Mac Mini 기반의 24시간 AI 에이전트.
              <br />
              Slack, Notion, Gmail에 연결해서
              <br />
              자동으로 작업을 시킬 수 있습니다.
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <MemphisCard color="purple" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6vw' }}>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, color: '#fff', fontWeight: 900 }}>
                  MAC MINI 기반
                </div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                  Slack · Notion 연동
                </div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                  Pro $20/월
                </div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                  보너스 4,000 크레딧
                </div>
              </div>
            </MemphisCard>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S07 Claude Code · asymmetric-4-8 · detail ═══
          패턴: asymmetric reversed (카드 33% + 텍스트 67%) */}
      <SlideFrame label="07 — Claude Code · asymmetric-4-8">
        <SC
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '6% 6% 4%',
            gap: '4%',
          }}
        >
          <div style={{ flex: '0 0 33%' }}>
            <MemphisCard color="teal" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6vw' }}>
                <div style={{ marginBottom: '0.3vw' }}>
                  <ServiceLogo service="anthropic" size="md" />
                </div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, fontWeight: 900 }}>예약 작업</div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, opacity: 0.7 }}>코드 리뷰 자동화</div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, opacity: 0.7 }}>의존성 감사</div>
                <div style={{ fontSize: '0.7vw', lineHeight: 1.8, opacity: 0.7 }}>
                  Anthropic 내부 검증
                </div>
              </div>
            </MemphisCard>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1vw' }}>
            <Marker color={t.teal}>CLAUDE CODE TASKS</Marker>
            <div style={T.headline('detail')}>예약 작업 + 코드 리뷰</div>
            <div style={{ ...T.body, maxWidth: '85%', color: t.textSecondary }}>
              매일 오전 9시 코드 리뷰 자동 실행,
              <br />
              매주 월요일 의존성 감사. PR이 열리면
              <br />
              에이전트 팀이 병렬로 버그를 탐색합니다.
            </div>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S08 선택 기준 · staggered-rows · section ═══
          패턴: staggered (행마다 좌우 엇갈림)
          헤드라인 스케일: section (2.2vw) */}
      <SlideFrame label="08 — 기획자의 선택 기준 · staggered-rows">
        <SC style={{ padding: '8% 7% 6%', gap: '1.2vw' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw' }}>
            <Marker color={t.purple}>SELECTION CRITERIA</Marker>
            <div style={T.headline('section')}>기획자의 선택 기준</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8vw',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {[
              { align: 'flex-start' as const, color: 'yellow' as const, text: '내 워크플로우의 어디를 대체하는가' },
              { align: 'flex-end' as const, color: 'pink' as const, text: '설계를 이해하는 도구인가' },
              { align: 'flex-start' as const, color: 'teal' as const, text: '당장 쓸 수 있는가' },
            ].map(({ align, color, text }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: align }}>
                <div style={{ width: '58%' }}>
                  <MemphisCard color={color} padding="sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3%', padding: '0.3vw 0.8vw' }}>
                      <span
                        style={{
                          fontFamily: t.fontMono,
                          fontSize: '0.85vw',
                          fontWeight: 900,
                          opacity: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          fontFamily: t.fontHeading,
                          fontSize: '0.9vw',
                          fontWeight: 900,
                          wordBreak: 'keep-all',
                          textTransform: 'uppercase',
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  </MemphisCard>
                </div>
              </div>
            ))}
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S09 Karpathy · feature-callout · section ═══
          패턴: feature-callout (main 60% + supporting 40% 세로)
          헤드라인 스케일: section (2.2vw) */}
      <SlideFrame label="09 — Karpathy Autoresearch · feature-callout">
        <SC style={{ padding: '6% 7% 5%', gap: '1.2vw' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw' }}>
            <Marker color={t.yellow}>KARPATHY AUTORESEARCH</Marker>
            <div style={T.headline('section')}>
              AI가 밤새 스스로 최적화한다
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '0.8vw',
              flex: 1,
              minHeight: 0,
            }}
          >
            <div style={{ gridRow: '1 / 3' }}>
              <MemphisCard color="yellow" padding="lg">
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.6vw',
                  }}
                >
                  <div
                    style={{
                      fontFamily: t.fontHeading,
                      fontSize: '1.1vw',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      wordBreak: 'keep-all',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5vw',
                    }}
                  >
                    <ServiceLogo service="github" size="md" />
                    Autoresearch
                  </div>
                  <div
                    style={{
                      fontSize: '0.75vw',
                      lineHeight: 1.75,
                      color: t.textPrimary,
                      opacity: 0.7,
                      wordBreak: 'keep-all',
                    }}
                  >
                    Karpathy가 오픈소스로 공개한 시스템.
                    <br />
                    코드를 수정하고, 5분간 학습하고,
                    <br />
                    결과를 확인하고, 밤새 반복합니다.
                  </div>
                </div>
              </MemphisCard>
            </div>

            <NeutralCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.3vw',
                padding: '5% 7%',
              }}
            >
              <div style={{ fontFamily: t.fontHeading, fontSize: '0.85vw', fontWeight: 900, textTransform: 'uppercase' }}>
                작동 방식
              </div>
              <div style={{ fontSize: '0.65vw', lineHeight: 1.65, color: t.textPrimary, opacity: 0.7 }}>
                코드 수정 → 5분 학습 →
                <br />
                결과 확인 → 유지/폐기 →
                <br />
                반복 (밤새 자동)
              </div>
            </NeutralCard>
            <NeutralCard
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.3vw',
                padding: '5% 7%',
              }}
            >
              <div style={{ fontFamily: t.fontHeading, fontSize: '0.85vw', fontWeight: 900, textTransform: 'uppercase' }}>
                Karpathy의 표현
              </div>
              <div style={{ fontSize: '0.65vw', lineHeight: 1.65, color: t.textPrimary, opacity: 0.7, fontStyle: 'italic' }}>
                &ldquo;Part code, part sci-fi,
                <br />
                and a pinch of psychosis&rdquo;
              </div>
            </NeutralCard>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S10 Meta · alternating-zigzag · section ═══
          패턴: zigzag (좌→우 교차, FACT/ANALYSIS 라벨)
          비교 규칙: Before 30% (muted) / After 70% (bold) */}
      <SlideFrame label="10 — Meta + Moltbook · alternating-zigzag">
        <SC style={{ padding: '8% 7% 6%', gap: '1.2vw' }}>
          <div>
            <Marker color={t.pink}>META + MOLTBOOK</Marker>
            <div style={{ ...T.headline('section'), marginTop: '0.4vw' }}>
              AI 소셜 네트워크의 의미
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1vw', flex: 1, justifyContent: 'center' }}>
            {/* FACT — left, muted (Before 30% weight) */}
            <div style={{ width: '55%', alignSelf: 'flex-start' }}>
              <MemphisCard color="yellow" padding="sm">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw', padding: '0.3vw 0.5vw' }}>
                  <div style={{ ...mcTitle, opacity: 0.6 }}>
                    <ServiceLogo service="meta" size="md" />
                    FACT
                  </div>
                  <div style={mcBody}>
                    AI 에이전트 전용 소셜 네트워크
                    <br />
                    제작자를 채용
                  </div>
                </div>
              </MemphisCard>
            </div>

            {/* ANALYSIS — right, bold (After 70% weight) */}
            <div style={{ width: '55%', alignSelf: 'flex-end' }}>
              <MemphisCard color="pink" padding="sm">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw', padding: '0.3vw 0.5vw' }}>
                  <div style={mcTitle}>ANALYSIS</div>
                  <div
                    style={{
                      fontFamily: t.fontHeading,
                      fontSize: '1.0vw',
                      fontWeight: 900,
                      wordBreak: 'keep-all',
                    }}
                  >
                    두 가지 해석
                  </div>
                  <div style={mcBody}>
                    1. 크리에이터 비용 절감
                    <br />
                    2. 에이전트 대상 광고
                  </div>
                </div>
              </MemphisCard>
            </div>
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S11 종합 · bento-grid · section ═══
          패턴: bento (카드 크기 2가지 이상 혼합, CSS Grid)
          헤드라인 스케일: section (2.2vw) */}
      <SlideFrame label="11 — 이번 주가 의미하는 것 · bento-grid">
        <SC style={{ padding: '8% 7% 6%', gap: '1.2vw' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4vw' }}>
            <Marker color={t.teal}>THIS WEEK&apos;S TAKEAWAYS</Marker>
            <div style={T.headline('section')}>
              기획자에게 이번 주가 의미하는 것
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: '0.8vw',
              flex: 1,
              minHeight: 0,
            }}
          >
            {[
              { color: 'pink' as const, title: '도구 수렴', desc: '한 곳이 만들면 다른 곳도 따라 만든다' },
              { color: 'yellow' as const, title: '설계 차별화', desc: '무엇을 시킬지를 아는 사람이 차이를 만든다' },
              { color: 'teal' as const, title: '무료부터 시작', desc: 'Canva, Claude 시각화 모두 무료 플랜 가능' },
              { color: 'purple' as const, title: '에이전트 시대', desc: '기획자의 역할은 설계하고 지시하는 것' },
            ].map(({ color, title, desc }) => (
              <MemphisCard key={title} color={color} padding="sm">
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.5vw',
                  }}
                >
                  <div
                    style={{
                      fontFamily: t.fontHeading,
                      fontSize: '1.1vw',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      wordBreak: 'keep-all',
                      color: color === 'purple' ? '#fff' : t.textPrimary,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75vw',
                      lineHeight: 1.7,
                      color: color === 'purple' ? 'rgba(255,255,255,0.8)' : t.textPrimary,
                      opacity: color === 'purple' ? 1 : 0.7,
                      wordBreak: 'keep-all',
                    }}
                  >
                    {desc}
                  </div>
                </div>
              </MemphisCard>
            ))}
          </div>
        </SC>
      </SlideFrame>

      {/* ═══ S12 마무리 · full-bleed · title ═══
          패턴: full-bleed (배경색 전체, 전환 느낌)
          헤드라인 스케일: title (2.5vw — closing) */}
      <SlideFrame label="12 — 마무리 · full-bleed">
        <SC
          bg="#1a1a1a"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10% 12% 6%',
            gap: '1vw',
          }}
        >
          <div
            style={{
              fontFamily: t.fontHeading,
              fontSize: '2.5vw',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '-0.03em',
              wordBreak: 'keep-all',
            }}
          >
            도구가 비슷해질수록
          </div>
          <div
            style={{
              fontFamily: t.fontHeading,
              fontSize: '2.5vw',
              fontWeight: 900,
              color: t.pink,
              lineHeight: 1.3,
              letterSpacing: '-0.03em',
              wordBreak: 'keep-all',
            }}
          >
            설계가 차이를 만듭니다
          </div>

          <div style={{ width: '20%', height: 2, background: t.pink, opacity: 0.4, marginTop: '0.5vw' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4vw', marginTop: '0.3vw' }}>
            <ServiceLogo service="anthropic" size="sm" color="#ffffff" />
            <span
              style={{
                fontFamily: t.fontBody,
                fontSize: '0.85vw',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                whiteSpace: 'nowrap',
              }}
            >
              오늘 Claude에서 시각화를 만들어보세요
            </span>
          </div>
        </SC>
      </SlideFrame>
    </div>
  );
};
