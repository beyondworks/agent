// Algorithm 6: 사용량 제한 & 과금 로직

import { USAGE_LIMITS } from '@videoforge/shared/constants';
import { createClient } from '@/lib/supabase/server';

export type UsageAction = 'script' | 'scene_image' | 'scene_video' | 'render';

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  message?: string;
}

/**
 * 사용자의 사용량을 확인하고 작업 허용 여부를 반환합니다.
 */
export async function checkUsage(userId: string, action: UsageAction): Promise<UsageCheckResult> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription, monthly_renders, monthly_reset')
    .eq('id', userId)
    .single();

  if (!profile) {
    return { allowed: false, remaining: 0, message: '프로필을 찾을 수 없습니다.' };
  }

  const tier = profile.subscription as keyof typeof USAGE_LIMITS;
  const limits = USAGE_LIMITS[tier];

  // 월간 리셋 체크
  let currentMonthlyRenders = profile.monthly_renders;
  if (new Date() > new Date(profile.monthly_reset)) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1);
    nextReset.setHours(0, 0, 0, 0);

    await supabase
      .from('profiles')
      .update({ monthly_renders: 0, monthly_reset: nextReset.toISOString() })
      .eq('id', userId);
    currentMonthlyRenders = 0;
  }

  // render 액션에 대해서만 월간 렌더링 한도 체크
  if (action === 'render') {
    const monthlyLimit = limits.monthly_renders;

    if (monthlyLimit !== -1 && currentMonthlyRenders >= monthlyLimit) {
      return {
        allowed: false,
        remaining: 0,
        message: '월간 렌더링 한도 초과. Pro로 업그레이드하세요.',
      };
    }

    // 동시 작업 체크
    const { count } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'processing')
      .eq('project_id', userId);

    const activeJobCount = count ?? 0;

    if (activeJobCount >= limits.concurrent) {
      return {
        allowed: false,
        remaining: limits.concurrent - activeJobCount,
        message: '동시 작업 한도 초과. 진행 중인 작업 완료 후 시도하세요.',
      };
    }

    const remaining = monthlyLimit === -1 ? Infinity : monthlyLimit - currentMonthlyRenders;
    return {
      allowed: true,
      remaining: remaining === Infinity ? 999999 : remaining,
    };
  }

  // 렌더 외 액션은 기본 허용 (추후 확장 가능)
  return { allowed: true, remaining: 999999 };
}

/**
 * 렌더링 완료 후 월간 카운터를 증가시킵니다.
 */
export async function incrementRenderCount(userId: string): Promise<void> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('monthly_renders')
    .eq('id', userId)
    .single();

  if (profile) {
    await supabase
      .from('profiles')
      .update({ monthly_renders: (profile.monthly_renders ?? 0) + 1 })
      .eq('id', userId);
  }
}
