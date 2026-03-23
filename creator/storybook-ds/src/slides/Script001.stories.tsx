import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { memphisTheme as t } from '../themes/memphis';
import { T } from './typography';
import { SlideLayout } from './layouts/SlideLayout';
import { SplitLayout } from './layouts/SplitLayout';
import { CenterLayout } from './layouts/CenterLayout';
import { FeatureCalloutLayout } from './layouts/FeatureCalloutLayout';
import { StaggeredLayout } from './layouts/StaggeredLayout';
import { BentoLayout } from './layouts/BentoLayout';
import { ZigzagLayout } from './layouts/ZigzagLayout';
import { MemphisCard } from './MemphisCard';
import { ServiceLogo } from './ServiceLogo';

const SlideContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
);

const Hairline: React.FC<{ width?: string; color?: string }> = ({
  width = '30%',
  color = t.textMuted,
}) => (
  <div style={{ width, height: '1px', background: color, margin: '0 auto' }} />
);

const meta: Meta = {
  title: 'Slides/Script 001 — AI 도구 수렴',
  parameters: {
    backgrounds: { default: 'memphis', values: [{ name: 'memphis', value: t.bgPage }] },
    layout: 'fullscreen',
  },
};

export default meta;

/* ─────────────────── S01 오프닝 ─────────────────── */
export const S01_오프닝: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: '35%',
          }}
        >
          <div>
            <div style={{ ...T.headline('title'), color: t.textPrimary }}>
              AI 도구가 다 비슷해졌을 때
            </div>
            <div style={{ ...T.headline('title'), color: t.pink, marginTop: '0.5vw' }}>
              기획자가 선택하는 기준
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5vw' }}>
            <div style={{ ...T.caption, alignSelf: 'flex-end' }}>
              Claude · ChatGPT · Perplexity · Google · Microsoft
            </div>
            <div style={T.cli}>$ compare --tools all --week 2026-03-13</div>
          </div>
        </div>
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S02 ChatGPT ─────────────────── */
export const S02_ChatGPT: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <SplitLayout
          ratio="7-5"
          left={
            <div>
              <div style={{ ...T.headline('section'), marginBottom: '1.2vw' }}>
                사전 제작된 시각화 라이브러리
              </div>
              <div style={T.subheadline}>
                피타고라스, 옴의 법칙 같은 수학·과학 주제에 한정. 미리 만들어둔 시각화를 즉시 로드.
                빠르지만 커스텀 불가.
              </div>
            </div>
          }
          right={
            <MemphisCard color="yellow" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vw' }}>
                <ServiceLogo service="openai" size="md" />
                <div style={{ ...T.body, textAlign: 'center' }}>
                  <div>수학·과학 주제 한정</div>
                  <div>사전 제작 시각화</div>
                  <div>즉시 로드</div>
                  <div>커스텀 불가</div>
                </div>
              </div>
            </MemphisCard>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S03 Claude ─────────────────── */
export const S03_Claude: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <SplitLayout
          ratio="5-7"
          left={
            <MemphisCard color="teal" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vw' }}>
                <ServiceLogo service="anthropic" size="md" />
                <div style={{ ...T.body, textAlign: 'center' }}>
                  <div>코드 기반 생성</div>
                  <div>1분+ 소요</div>
                  <div>커스텀 가능</div>
                  <div>모든 플랜 무료</div>
                </div>
              </div>
            </MemphisCard>
          }
          right={
            <div>
              <div style={{ ...T.headline('section'), marginBottom: '1.2vw' }}>
                처음부터 코드를 작성하는 방식
              </div>
              <div style={T.subheadline}>
                요청 받으면 코드를 처음부터 작성. 1분+ 소요. 복리 계산, AI 타임라인, 기업 지도 등
                커스텀 가능. 모든 플랜 무료.
              </div>
            </div>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S04 핵심 메시지 ─────────────────── */
export const S04_핵심메시지: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <CenterLayout maxWidth="50%">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vw' }}>
            <Hairline />
            <div style={{ ...T.headline('section'), fontWeight: 400 }}>
              차이를 만드는 건 도구가 아니라
            </div>
            <div style={T.headline('section')}>
              무엇을 시키는지를 아는 사람이다
            </div>
            <Hairline />
            <div style={T.caption}>AI 도구 수렴 시대의 기획자 가이드</div>
          </div>
        </CenterLayout>
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S05 Canva ─────────────────── */
export const S05_Canva: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <FeatureCalloutLayout
          main={
            <MemphisCard color="pink" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw' }}>
                <ServiceLogo service="canva" size="md" />
                <div>
                  <div style={{ ...T.headline('detail'), marginBottom: '0.5vw' }}>Magic Layers</div>
                  <div style={T.body}>
                    사진 속 요소를 레이어별로 분리. 텍스트를 피사체 뒤에 배치하는 등 전문
                    편집 효과를 원클릭으로 구현.
                  </div>
                </div>
              </div>
            </MemphisCard>
          }
          supporting={
            <>
              {['레이어 분리', '실사 사진 지원', '모든 플랜 무료'].map((label) => (
                <MemphisCard color="yellow" padding="sm" key={label}>
                  <div style={{ ...T.body, fontWeight: 700, textAlign: 'center' }}>{label}</div>
                </MemphisCard>
              ))}
            </>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S06 Perplexity ─────────────────── */
export const S06_Perplexity: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <SplitLayout
          ratio="8-4"
          left={
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '1.2vw' }}>
                <ServiceLogo service="perplexity" size="md" />
                <div style={T.headline('detail')}>24시간 AI 에이전트</div>
              </div>
              <div style={T.body}>
                Mac Mini에 항상 켜둔 AI 비서. Slack, Notion과 연동해 질문에 자동 응답. 월 $20
                Pro 플랜으로 4,000 크레딧 제공.
              </div>
            </div>
          }
          right={
            <MemphisCard color="purple" padding="md">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8vw',
                  ...T.body,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                <div>Mac Mini</div>
                <div>Slack·Notion</div>
                <div>$20/월</div>
                <div>4000 크레딧</div>
              </div>
            </MemphisCard>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S07 Claude Code ─────────────────── */
export const S07_ClaudeCode: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <SplitLayout
          ratio="4-8"
          left={
            <MemphisCard color="teal" padding="md">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8vw' }}>
                <ServiceLogo service="anthropic" size="sm" />
                <div style={{ ...T.body, fontWeight: 600, lineHeight: 1.6 }}>
                  <div>Claude Code</div>
                  <div>cron 예약</div>
                  <div>자동 리뷰</div>
                  <div>CI 연동</div>
                </div>
              </div>
            </MemphisCard>
          }
          right={
            <div>
              <div style={{ ...T.headline('detail'), marginBottom: '1.2vw' }}>
                예약 작업 + 자동 코드 리뷰
              </div>
              <div style={T.body}>
                Claude Code에 cron 스케줄링 기능 추가. 매일 새벽 코드 리뷰를 자동 실행하고,
                PR에 코멘트를 남기는 워크플로우를 구축할 수 있음.
              </div>
            </div>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S08 선택 기준 ─────────────────── */
export const S08_선택기준: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <StaggeredLayout
          rows={[
            {
              align: 'left',
              content: (
                <MemphisCard color="yellow" padding="md">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
                    <span style={{ ...T.index, fontSize: '2.2vw', opacity: 0.3 }}>01</span>
                    <span style={{ ...T.headline('detail'), fontWeight: 700 }}>
                      워크플로우의 어디를 대체하는가
                    </span>
                  </div>
                </MemphisCard>
              ),
            },
            {
              align: 'right',
              content: (
                <MemphisCard color="pink" padding="md">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
                    <span style={{ ...T.index, fontSize: '2.2vw', opacity: 0.3 }}>02</span>
                    <span style={{ ...T.headline('detail'), fontWeight: 700 }}>
                      설계를 이해하는 도구인가
                    </span>
                  </div>
                </MemphisCard>
              ),
            },
            {
              align: 'left',
              content: (
                <MemphisCard color="teal" padding="md">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2vw' }}>
                    <span style={{ ...T.index, fontSize: '2.2vw', opacity: 0.3 }}>03</span>
                    <span style={{ ...T.headline('detail'), fontWeight: 700 }}>
                      당장 쓸 수 있는가
                    </span>
                  </div>
                </MemphisCard>
              ),
            },
          ]}
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S09 Karpathy ─────────────────── */
export const S09_Karpathy: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <FeatureCalloutLayout
          main={
            <MemphisCard color="yellow" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '1vw' }}>
                <ServiceLogo service="github" size="sm" />
                <div style={T.headline('section')}>AI가 밤새 스스로 최적화한다</div>
              </div>
              <div style={T.body}>
                Karpathy의 실험: AI 에이전트에게 코드 수정 권한을 주고, 밤새 스스로 학습률을
                최적화하게 함. 사람이 자는 동안 수백 회 반복.
              </div>
            </MemphisCard>
          }
          supporting={
            <>
              <MemphisCard color="teal" padding="sm">
                <div style={T.body}>
                  <div style={{ fontWeight: 800, marginBottom: '0.3vw' }}>작동 방식</div>
                  코드 수정 → 5분 학습 → 결과 확인 → 반복
                </div>
              </MemphisCard>
              <MemphisCard color="pink" padding="sm">
                <div style={T.body}>
                  <div style={{ fontWeight: 800, marginBottom: '0.3vw' }}>Karpathy 표현</div>
                  part code, part sci-fi, and a pinch of psychosis
                </div>
              </MemphisCard>
            </>
          }
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S10 Meta ─────────────────── */
export const S10_Meta: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <ZigzagLayout
          before={{
            label: 'before',
            content: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1vw', marginBottom: '0.8vw' }}>
                <ServiceLogo service="meta" size="sm" color="#8a8a8a" />
                <div style={{ ...T.headline('detail'), fontWeight: 600 }}>
                  AI 에이전트 소셜 네트워크 제작자를 채용
                </div>
              </div>
            ),
          }}
          after={{
            label: 'after',
            content: (
              <div style={{ ...T.headline('section'), lineHeight: 1.4 }}>
                두 가지 해석: 크리에이터 비용 절감 / 에이전트 대상 광고
              </div>
            ),
          }}
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S11 종합 ─────────────────── */
export const S11_종합: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout>
        <BentoLayout
          items={[
            {
              size: 'large',
              content: (
                <MemphisCard color="pink" padding="lg">
                  <div style={{ ...T.headline('detail'), marginBottom: '0.5vw' }}>도구 수렴</div>
                  <div style={{ ...T.body, color: t.textPrimary }}>AI 도구가 비슷해지고 있다</div>
                </MemphisCard>
              ),
            },
            {
              size: 'small',
              content: (
                <MemphisCard color="yellow" padding="md">
                  <div style={{ ...T.headline('detail'), fontSize: '1.4vw' }}>설계 차별화</div>
                </MemphisCard>
              ),
            },
            {
              size: 'small',
              content: (
                <MemphisCard color="teal" padding="md">
                  <div style={{ ...T.headline('detail'), fontSize: '1.4vw' }}>무료부터 시작</div>
                </MemphisCard>
              ),
            },
            {
              size: 'large',
              content: (
                <MemphisCard color="purple" padding="lg">
                  <div style={{ ...T.headline('detail'), marginBottom: '0.5vw', color: '#fff' }}>
                    에이전트 시대
                  </div>
                  <div style={{ ...T.body, color: '#e0e0e0' }}>설계가 지시서</div>
                </MemphisCard>
              ),
            },
          ]}
        />
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── S12 마무리 ─────────────────── */
export const S12_마무리: StoryObj = {
  render: () => (
    <SlideContainer>
      <SlideLayout bg={t.purple}>
        <CenterLayout>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vw' }}>
            <div style={{ ...T.headline('title'), fontWeight: 400, color: '#fff' }}>
              도구가 비슷해질수록
            </div>
            <div style={{ ...T.headline('title'), color: t.yellow }}>
              설계가 차이를 만듭니다
            </div>
            <Hairline width="30%" color="rgba(255,255,255,0.4)" />
            <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)' }}>
              AI 도구 수렴 시대의 기획자 가이드
            </div>
          </div>
        </CenterLayout>
      </SlideLayout>
    </SlideContainer>
  ),
};

/* ─────────────────── FullDeck ─────────────────── */
export const FullDeck: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, background: t.bgPage }}>
      {[
        S01_오프닝,
        S02_ChatGPT,
        S03_Claude,
        S04_핵심메시지,
        S05_Canva,
        S06_Perplexity,
        S07_ClaudeCode,
        S08_선택기준,
        S09_Karpathy,
        S10_Meta,
        S11_종합,
        S12_마무리,
      ].map((story, i) => {
        const RenderFn = story.render as React.FC;
        return <RenderFn key={i} />;
      })}
    </div>
  ),
};
