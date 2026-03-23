'use client';

import { useEffect, useRef, useState } from 'react';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface JobState {
  id: string;
  status: JobStatus;
  progress: number;
  current_step: number;
  total_steps: number;
  error_message: string | null;
  output_data: Record<string, unknown> | null;
}

const STEP_LABELS: Record<number, string> = {
  1: '웹 리서치',
  2: '콘텐츠 분석',
  3: '대본 작성',
  4: '씬 분할',
  5: '품질 평가',
};

export function useJobStatus(jobId: string | null) {
  const [jobState, setJobState] = useState<JobState | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  };

  const poll = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) return;
      const { data } = await res.json();
      setJobState(data);
      if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
        stopPolling();
      }
    } catch {
      // 네트워크 오류 시 조용히 무시 후 재시도
    }
  };

  useEffect(() => {
    if (!jobId) {
      stopPolling();
      setJobState(null);
      return;
    }

    setIsPolling(true);
    poll(jobId);

    intervalRef.current = setInterval(() => {
      poll(jobId);
    }, 3000);

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const currentStepLabel =
    jobState ? (STEP_LABELS[jobState.current_step] ?? '처리 중') : '';

  return {
    jobState,
    isPolling,
    currentStepLabel,
  };
}
