/**
 * 씬 템플릿 사용 예시
 *
 * Before (기존): 매 씬마다 GrainOverlay, easing, fade-out 복사 → 50줄+
 * After (템플릿): SceneBase + Layout으로 10줄 셋업 → 콘텐츠에만 집중
 */

import React from 'react';
import { interpolate } from 'remotion';
import { fs } from './theme';
import { SceneBase, ease, CLAMP, fadeIn } from './SceneBase';
import { SplitLayout } from './layouts';
import { BlurReveal, SlideUpFade, GlassCard, CountUp } from './components';

const DURATION = 850;

/**
 * 예시: Split Screen 씬
 * 왼쪽 텍스트 + 오른쪽 카드
 */
export const ExampleSplitScene: React.FC = () => (
  <SceneBase duration={DURATION} id="example-split">
    {(frame) => (
      <SplitLayout
        left={
          <>
            <BlurReveal
              text="핵심 메시지"
              startFrame={15}
              style={{ fontSize: 64, fontWeight: 800, color: fs.accent, fontFamily: fs.font }}
            />
            <SlideUpFade startFrame={40}>
              <p style={{ fontSize: 24, color: fs.textDim, fontFamily: fs.font, lineHeight: 1.6 }}>
                설명 텍스트가 여기에 들어갑니다.
              </p>
            </SlideUpFade>
          </>
        }
        right={
          <SlideUpFade startFrame={30}>
            <GlassCard style={{ padding: 40 }}>
              <CountUp target={47200} startFrame={50} style={{ fontSize: 72, color: fs.accent }} />
              <p style={{ fontSize: 18, color: fs.textDim }}>활성 사용자</p>
            </GlassCard>
          </SlideUpFade>
        }
      />
    )}
  </SceneBase>
);

/**
 * 예시: Bento Grid 씬 (hero 좌측 + 상하 우측)
 *
 * import { BentoLayout } from './layouts';
 *
 * <SceneBase duration={700} id="bento-example">
 *   {(frame) => (
 *     <BentoLayout
 *       hero={<LargeChart />}
 *       topRight={<StatCard />}
 *       bottomRight={<StatCard />}
 *     />
 *   )}
 * </SceneBase>
 */

/**
 * 예시: Full-bleed 임팩트 메시지
 *
 * import { FullBleedLayout } from './layouts';
 *
 * <SceneBase duration={600} id="impact">
 *   {(frame) => (
 *     <FullBleedLayout
 *       background={<GradientBg />}
 *       overlay={
 *         <BlurReveal text="개발자 선호도 1위" startFrame={10}
 *           style={{ fontSize: 96, fontWeight: 900, color: fs.text }} />
 *       }
 *     />
 *   )}
 * </SceneBase>
 */
