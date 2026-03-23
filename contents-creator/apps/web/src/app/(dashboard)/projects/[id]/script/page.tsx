'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Plus, X, Loader2, Paperclip } from 'lucide-react';
import { useJobStatus } from '@/hooks/use-job-status';
import { ScriptEditor } from '@/components/script/script-editor';
import { QualityChecklist } from '@/components/script/quality-checklist';

interface Scene {
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
  keywords?: string[];
}

interface ScriptData {
  id: string;
  full_script: string;
  scenes_json: Scene[];
  quality_score: {
    categories: {
      hook: { score: number; reason: string };
      storytelling: { score: number; reason: string };
      density: { score: number; reason: string };
      cta: { score: number; reason: string };
      visual: { score: number; reason: string };
    };
    total: number;
    suggestions: string[];
  } | null;
}

const STEP_LABELS: Record<number, string> = {
  1: '웹 리서치 중...',
  2: '콘텐츠 분석 중...',
  3: '대본 작성 중...',
  4: '씬 분할 중...',
  5: '품질 평가 중...',
};

export default function ScriptPage() {
  const { id: projectId } = useParams<{ id: string }>();

  // 입력 상태
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceText, setSourceText] = useState('');

  // 파일 업로드 상태
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 생성 상태
  const [jobId, setJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<ScriptData | null>(null);

  // 경과 시간
  const [elapsedSec, setElapsedSec] = useState(0);

  const { jobState, currentStepLabel } = useJobStatus(jobId);

  const isGenerating =
    jobState?.status === 'pending' || jobState?.status === 'processing';

  // 생성 완료 시 대본 로드
  const loadScript = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/scripts`);
    if (res.ok) {
      const { data } = await res.json();
      if (data) setScript(data as ScriptData);
    }
  }, [projectId]);

  // 페이지 진입 시 기존 대본 로드
  useEffect(() => {
    async function loadExistingScript() {
      try {
        const res = await fetch(`/api/projects/${projectId}/scripts`);
        if (res.ok) {
          const json = await res.json();
          const existing = json.data;
          if (existing && existing.full_script) {
            setScript(existing as ScriptData);
          }
        }
      } catch {}
    }
    loadExistingScript();
  }, [projectId]);

  // jobState 완료 감지
  if (jobState?.status === 'completed' && !script) {
    loadScript();
  }

  // 경과 시간 타이머
  useEffect(() => {
    if (!isSubmitting) { setElapsedSec(0); return; }
    const timer = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isSubmitting]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['md', 'txt', 'docx'].includes(ext || '')) {
      alert('지원하는 파일: .md, .txt, .docx');
      return;
    }

    if (ext === 'docx') {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/extract-text', { method: 'POST', body: formData });
      const { text } = await res.json();
      setSourceText(text);
    } else {
      const text = await file.text();
      setSourceText(text);
    }

    setUploadedFile({ name: file.name, size: file.size });
    // input 초기화 (같은 파일 재업로드 허용)
    e.target.value = '';
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
    }
    setKeywordInput('');
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      addKeyword();
    }
  };

  const getProgressInfo = (sec: number) => {
    if (sec < 30) return { label: '콘텐츠 분석 중...', pct: 15 };
    if (sec < 60) return { label: '대본 작성 중...', pct: 35 };
    if (sec < 120) return { label: '씬 분할 중...', pct: 55 };
    if (sec < 180) return { label: '품질 평가 중...', pct: 80 };
    return { label: '마무리 중...', pct: 95 };
  };

  const handleGenerate = async () => {
    if (keywords.length === 0) {
      setError('키워드를 최소 1개 입력하세요.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/scripts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          source_url: sourceUrl || undefined,
          source_text: sourceText || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '생성 요청에 실패했습니다.');
        return;
      }

      setJobId(json.data.jobId);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveScript = async (fullScript: string, scenes: Scene[]) => {
    await fetch(`/api/projects/${projectId}/scripts`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_script: fullScript, scenes_json: scenes }),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">AI 대본 생성</h1>
        <p className="text-sm text-zinc-500 mt-1">키워드를 입력하면 AI가 대본을 자동으로 작성합니다.</p>
      </div>

      {/* 입력 폼 */}
      {!script && !isGenerating && (
        <div className="space-y-5">
          {/* 키워드 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              키워드 <span className="text-red-500 normal-case">*</span>
            </label>
            <div className="flex flex-wrap gap-2 min-h-[44px] rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
                >
                  {kw}
                  <button
                    onClick={() => removeKeyword(kw)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={handleKeywordKeyDown}
                onBlur={addKeyword}
                placeholder={keywords.length === 0 ? '키워드 입력 후 Enter' : '추가...'}
                className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-600">Enter 키로 키워드를 추가하세요.</p>
          </div>

          {/* 소스 URL */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              소스 URL <span className="text-zinc-600 font-normal normal-case">(선택)</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {/* 소스 텍스트 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              소스 텍스트 <span className="text-zinc-600 font-normal normal-case">(선택)</span>
            </label>

            {/* 파일 업로드 버튼 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:text-zinc-200 hover:border-zinc-600 transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                파일 첨부
              </button>
              <span className="text-[10px] text-zinc-600">.md, .txt, .docx</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
              {uploadedFile && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800 rounded px-2 py-0.5">
                  {uploadedFile.name}
                  <button
                    type="button"
                    onClick={() => { setUploadedFile(null); setSourceText(''); }}
                    className="text-zinc-600 hover:text-zinc-300 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <div className="text-[10px] text-zinc-600 leading-relaxed space-y-1 mt-2 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/30">
              <p className="text-zinc-500 font-medium">💡 소스 텍스트 활용 가이드</p>
              <p>• 벤치마킹 채널 자막 → AI가 인사이트만 추출하여 새 대본 작성</p>
              <p>• 기사/블로그 원문 → 팩트 기반 대본 생성</p>
              <p>• 메모/아이디어 → 개인 경험이 캐릭터 스타일과 자연스럽게 결합</p>
              <p className="text-zinc-600 italic">※ 원본을 그대로 복사하지 않습니다. 분석 후 완전히 새로운 대본을 작성합니다.</p>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={5}
              placeholder="참조할 텍스트를 직접 붙여넣으세요..."
              className="w-full resize-y rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2">
              {error}
            </p>
          )}

          {isSubmitting ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{getProgressInfo(elapsedSec).label}</span>
                <span className="text-zinc-600 text-xs">{elapsedSec}초</span>
              </div>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${getProgressInfo(elapsedSec).pct}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={keywords.length === 0}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              AI 대본 생성
            </button>
          )}
        </div>
      )}

      {/* 생성 진행 중 */}
      {isGenerating && jobState && (
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-8 flex flex-col items-center gap-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />

          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-zinc-200">
              {currentStepLabel || '대본을 생성하고 있습니다...'}
            </p>
            <p className="text-xs text-zinc-500">
              단계 {jobState.current_step} / {jobState.total_steps}
            </p>
          </div>

          {/* 진행률 바 */}
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-[11px] text-zinc-600 mb-1.5">
              <span>진행률</span>
              <span className="font-mono">{jobState.progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-700"
                style={{ width: `${jobState.progress}%` }}
              />
            </div>
          </div>

          {/* 단계 인디케이터 */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step < jobState.current_step
                    ? 'bg-emerald-500'
                    : step === jobState.current_step
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 실패 */}
      {jobState?.status === 'failed' && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/10 p-4">
          <p className="text-sm text-red-400 font-medium">생성에 실패했습니다.</p>
          {jobState.error_message && (
            <p className="text-xs text-red-500/80 mt-1">{jobState.error_message}</p>
          )}
          <button
            onClick={() => { setJobId(null); }}
            className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 underline transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 완성된 대본 */}
      {script && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">생성된 대본</h2>
            <button
              onClick={() => { setScript(null); setJobId(null); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline transition-colors"
            >
              새로 생성
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScriptEditor
                scriptId={script.id}
                fullScript={script.full_script}
                scenes={(script.scenes_json as unknown as Scene[]) ?? []}
                onSave={handleSaveScript}
              />
            </div>

            {script.quality_score && (
              <div className="lg:col-span-1">
                <QualityChecklist quality={script.quality_score} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
