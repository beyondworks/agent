'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { useJobStatus } from '@/hooks/use-job-status';
import { RenderProgress } from '@/components/export/render-progress';
import { DownloadButton } from '@/components/export/download-button';

interface ProjectInfo {
  id: string;
  content_type: 'short_form' | 'long_form';
  output_url: string | null;
  status: string;
  duration_sec: number | null;
}

interface RenderJob {
  id: string;
  status: string;
  output_data: Record<string, unknown> | null;
  error_message: string | null;
}

export default function ExportPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReRendering, setIsReRendering] = useState(false);
  const [reRenderError, setReRenderError] = useState<string | null>(null);

  const activeJobId =
    renderJob?.status === 'pending' || renderJob?.status === 'processing'
      ? renderJob.id
      : null;

  const { jobState } = useJobStatus(activeJobId);

  // 프로젝트 + 최신 렌더 잡 로드
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, jobRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/render`),
      ]);
      if (projRes.ok) {
        const { data } = await projRes.json();
        setProject(data);
      }
      if (jobRes.ok) {
        const { data } = await jobRes.json();
        // 최신 render 잡
        const job = Array.isArray(data) ? data[0] : data;
        setRenderJob(job ?? null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 잡 완료 시 프로젝트 새로고침
  useEffect(() => {
    if (jobState?.status === 'completed') {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobState?.status]);

  const handleReRender = async () => {
    setReRenderError(null);
    setIsReRendering(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) {
        setReRenderError(json.error?.message ?? '렌더링 요청에 실패했습니다.');
        return;
      }
      setRenderJob({ id: json.jobId, status: 'pending', output_data: null, error_message: null });
    } catch {
      setReRenderError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsReRendering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const isRendering =
    renderJob?.status === 'pending' || renderJob?.status === 'processing';
  const isCompleted = renderJob?.status === 'completed';
  const isFailed = renderJob?.status === 'failed';
  const hasNoJob = !renderJob;

  // output_url: project에서 직접 or job output_data에서
  const outputUrl =
    project?.output_url ??
    (renderJob?.output_data?.videoUrl as string | undefined) ??
    null;

  const fileInfo = renderJob?.output_data as
    | {
        resolution?: string;
        fps?: number;
        file_size_bytes?: number;
        duration_sec?: number;
      }
    | undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">내보내기</h1>
        <p className="text-sm text-zinc-500 mt-1">
          렌더링 결과물을 확인하고 다운로드합니다.
        </p>
      </div>

      {/* 잡 없음 — 렌더링 미시작 */}
      {hasNoJob && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-zinc-500">렌더링이 시작되지 않았습니다.</p>
          <button
            onClick={() => router.push(`/projects/${projectId}/edit`)}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            편집 페이지로 돌아가기
          </button>
        </div>
      )}

      {/* 렌더링 진행 중 */}
      {isRendering && renderJob && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h2 className="text-sm font-semibold text-zinc-200 mb-6">렌더링 진행 중</h2>
          <RenderProgress
            jobId={renderJob.id}
            contentType={project?.content_type}
          />
        </div>
      )}

      {/* 렌더링 완료 */}
      {isCompleted && (
        <div className="space-y-6">
          {/* 영상 프리뷰 */}
          {outputUrl ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={outputUrl}
                controls
                className="w-full max-h-96 bg-black"
                playsInline
              />
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex items-center justify-center">
              <p className="text-sm text-zinc-500">영상 URL을 불러오는 중...</p>
            </div>
          )}

          {/* 파일 정보 */}
          {fileInfo && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                파일 정보
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {fileInfo.resolution && (
                  <div>
                    <dt className="text-xs text-zinc-500">해상도</dt>
                    <dd className="text-zinc-200 font-medium">{fileInfo.resolution}</dd>
                  </div>
                )}
                {fileInfo.fps != null && (
                  <div>
                    <dt className="text-xs text-zinc-500">FPS</dt>
                    <dd className="text-zinc-200 font-medium">{fileInfo.fps}fps</dd>
                  </div>
                )}
                {fileInfo.file_size_bytes != null && (
                  <div>
                    <dt className="text-xs text-zinc-500">파일 크기</dt>
                    <dd className="text-zinc-200 font-medium">
                      {(fileInfo.file_size_bytes / 1024 / 1024).toFixed(1)} MB
                    </dd>
                  </div>
                )}
                {fileInfo.duration_sec != null && (
                  <div>
                    <dt className="text-xs text-zinc-500">길이</dt>
                    <dd className="text-zinc-200 font-medium">
                      {fileInfo.duration_sec}초
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* 다운로드 + 다시 렌더링 */}
          <div className="flex items-center gap-4 flex-wrap">
            <DownloadButton projectId={projectId} />
            <button
              onClick={handleReRender}
              disabled={isReRendering}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isReRendering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              다시 렌더링
            </button>
          </div>

          {reRenderError && (
            <p className="text-xs text-red-400">{reRenderError}</p>
          )}
        </div>
      )}

      {/* 렌더링 실패 */}
      {isFailed && renderJob && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-300">렌더링에 실패했습니다.</p>
              {renderJob.error_message && (
                <p className="text-xs text-red-500">{renderJob.error_message}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleReRender}
            disabled={isReRendering}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isReRendering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            다시 시도
          </button>

          {reRenderError && (
            <p className="text-xs text-red-400">{reRenderError}</p>
          )}
        </div>
      )}
    </div>
  );
}
