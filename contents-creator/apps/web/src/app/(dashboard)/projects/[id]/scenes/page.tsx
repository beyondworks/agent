'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layers, Loader2, ArrowRight } from 'lucide-react';
import { useJobStatus } from '@/hooks/use-job-status';
import { SceneTimeline, type Scene } from '@/components/scenes/scene-timeline';
import { SceneDetail } from '@/components/scenes/scene-detail';

const STEP_LABELS: Record<number, string> = {
  1: '대본 및 스타일 로드 중...',
  2: '씬 프롬프트 생성 중...',
  3: '이미지 및 영상 생성 중...',
  4: '결과 저장 중...',
};

export default function ScenesPage() {
  const { id: projectId } = useParams<{ id: string }>();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);
  const [genElapsed, setGenElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { jobState } = useJobStatus(jobId);

  const isGenerating =
    isGeneratingLocal || jobState?.status === 'pending' || jobState?.status === 'processing';

  // 생성 중 경과 시간 타이머
  useEffect(() => {
    if (!isGenerating) { setGenElapsed(0); return; }
    const timer = setInterval(() => setGenElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const loadScenes = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/scenes`);
    if (res.ok) {
      const { data } = await res.json();
      const list = (data as Scene[]) ?? [];
      setScenes(list);
      if (list.length > 0 && !selectedSceneId) {
        setSelectedSceneId(list[0].id);
      }
    }
    setIsLoaded(true);
  }, [projectId, selectedSceneId]);

  // 초기 로드 + 진행중 Job 복원
  useEffect(() => {
    loadScenes();

    // 진행중인 scene_generation job이 있는지 확인
    async function checkActiveJob() {
      try {
        const res = await fetch(`/api/projects/${projectId}/jobs?type=scene_generation&status=processing`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.id) {
            setJobId(json.data.id);
            setIsGeneratingLocal(true);
          }
        }
      } catch {}
    }
    checkActiveJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 생성 완료 시 씬 로드
  useEffect(() => {
    if (jobState?.status === 'completed') {
      setIsGeneratingLocal(false);
      loadScenes();
    }
    if (jobState?.status === 'failed') {
      setIsGeneratingLocal(false);
    }
  }, [jobState?.status, loadScenes]);

  const handleGenerate = async () => {
    setError(null);
    setIsSubmitting(true);
    setIsGeneratingLocal(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/scenes/generate`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '생성 요청에 실패했습니다.');
        setIsGeneratingLocal(false);
        return;
      }
      // 동기 API이므로 응답이 오면 씬이 이미 생성됨
      if (json.data?.scenesCreated > 0) {
        await loadScenes();
      } else if (json.data?.jobId) {
        setJobId(json.data.jobId);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setIsGeneratingLocal(false);
    }
  };

  const handleSceneUpdate = (updatedScene: Scene) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === updatedScene.id ? updatedScene : s))
    );
  };

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) ?? null;

  const currentStepLabel =
    jobState ? (STEP_LABELS[jobState.current_step] ?? '처리 중...') : '';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">씬 생성</h1>
          <p className="text-sm text-zinc-500 mt-1">
            AI가 대본의 각 씬을 이미지와 영상으로 생성합니다.
          </p>
        </div>
        {isLoaded && scenes.length === 0 && !isGenerating && (
          <button
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                요청 중...
              </>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                씬 생성하기
              </>
            )}
          </button>
        )}
      </div>

      {/* 생성 중 */}
      {isGenerating && scenes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="rounded-full bg-blue-500/10 p-5 border border-blue-500/20">
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-zinc-200">
              씬 이미지 생성 중...
            </p>
            <p className="text-xs text-zinc-500">
              {genElapsed < 30 ? '씬 데이터 준비 중...' :
               genElapsed < 120 ? '이미지 생성 중... (씬당 약 15초)' :
               genElapsed < 240 ? '거의 완료 중...' :
               '마무리 중... 잠시만 기다려주세요'}
            </p>
            <p className="text-xs text-zinc-600 font-mono">{genElapsed}초 경과</p>
          </div>
          <div className="w-64 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${Math.min(95, genElapsed / 3)}%` }}
            />
          </div>
        </div>
      )}

      {/* 생성 전 (씬 없음) */}
      {isLoaded && scenes.length === 0 && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          <div className="rounded-full bg-zinc-900 p-5 border border-zinc-800">
            <Layers className="h-10 w-10 text-zinc-600" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-zinc-300">
              아직 생성된 씬이 없습니다.
            </p>
            <p className="text-xs text-zinc-600">
              대본의 각 씬에 맞는 이미지와 영상을 AI로 생성합니다.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 rounded-lg border border-red-900 bg-red-950/30 px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Layers className="h-4 w-4" />
            씬 생성하기
          </button>
        </div>
      )}

      {/* 생성 중 */}
      {isGenerating && jobState && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 flex flex-col items-center gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-zinc-200">
              {currentStepLabel || '씬을 생성하고 있습니다...'}
            </p>
            <p className="text-xs text-zinc-500">
              단계 {jobState.current_step} / {jobState.total_steps} — 시간이 다소 걸릴 수 있습니다.
            </p>
          </div>

          {/* 진행률 바 */}
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
              <span>진행률</span>
              <span>{jobState.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-800">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-700"
                style={{ width: `${jobState.progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-colors ${
                  step < jobState.current_step
                    ? 'bg-green-500'
                    : step === jobState.current_step
                    ? 'bg-primary animate-pulse'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 실패 */}
      {jobState?.status === 'failed' && (
        <div className="rounded-xl border border-red-900 bg-red-950/20 p-4">
          <p className="text-sm text-red-400 font-medium">씬 생성에 실패했습니다.</p>
          {jobState.error_message && (
            <p className="text-xs text-red-500 mt-1">{jobState.error_message}</p>
          )}
          <button
            onClick={() => setJobId(null)}
            className="mt-3 text-xs text-zinc-400 hover:text-zinc-200 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 씬 목록 */}
      {scenes.length > 0 && (
        <div className="space-y-6">
          {/* 타임라인 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500">
                씬 타임라인 ({scenes.length}개)
              </p>
              <button
                onClick={() => { if (confirm('기존 씬을 삭제하고 새로 생성하시겠습니까?')) handleGenerate(); }}
                disabled={isSubmitting || isGenerating}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-50 transition-colors"
              >
                <Loader2 className="h-3 w-3" />
                새로 생성
              </button>
            </div>
            <SceneTimeline
              scenes={scenes}
              selectedSceneId={selectedSceneId}
              onSelectScene={(scene) => setSelectedSceneId(scene.id)}
            />
          </div>

          {/* 씬 상세 */}
          {selectedScene && (
            <SceneDetail
              scene={selectedScene}
              projectId={projectId}
              onUpdate={handleSceneUpdate}
            />
          )}

          {/* 다음 단계 */}
          <div className="flex justify-end mt-6">
            <Link
              href={`/projects/${projectId}/edit`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
