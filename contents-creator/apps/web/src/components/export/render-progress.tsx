'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useJobStatus } from '@/hooks/use-job-status';

interface RenderProgressProps {
  jobId: string;
  contentType?: 'short_form' | 'long_form';
}

export function RenderProgress({ jobId, contentType = 'short_form' }: RenderProgressProps) {
  const { jobState } = useJobStatus(jobId);
  const [elapsed, setElapsed] = useState(0);

  // 경과 시간 타이머
  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!jobState) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  const progress = jobState.progress || 0;
  // error_message를 상태 메시지로 활용 (렌더링 중에는 진행 메시지가 저장됨)
  const statusMessage =
    jobState.status === 'failed'
      ? jobState.error_message
      : jobState.error_message || '렌더링 준비 중...';

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* 상태 메시지 — 터미널 스타일 */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-100 truncate">
            {statusMessage}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">
            {formatTime(elapsed)} 경과
            {contentType === 'long_form' && ' · 예상 5~15분'}
          </p>
        </div>
        <span className="text-sm font-semibold text-blue-400 tabular-nums shrink-0">
          {progress}%
        </span>
      </div>

      {/* 진행률 바 */}
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>

      {/* 단계 요약 — 완료된 단계 표시 */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <StepDot label="번들링" done={progress > 8} active={progress <= 8} />
        <StepDot label="렌더링" done={progress > 90} active={progress > 8 && progress <= 90} />
        <StepDot label="업로드" done={progress >= 100} active={progress > 90 && progress < 100} />
      </div>
    </div>
  );
}

function StepDot({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      ) : active ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border border-zinc-700" />
      )}
      <span className={done ? 'text-zinc-400' : active ? 'text-zinc-200 font-medium' : ''}>
        {label}
      </span>
    </div>
  );
}
