'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StylePresetGrid, type StylePreset } from '@/components/style/style-preset-grid';
import { ReferenceUploader } from '@/components/style/reference-uploader';
import type { StyleAnalysisResult } from '@/lib/ai/prompts/style-analysis';

type Tab = 'preset' | 'custom';

interface StylePageProps {
  params: Promise<{ id: string }>;
}

export default function StylePage({ params }: StylePageProps) {
  const { id: projectId } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('preset');
  const [presets, setPresets] = useState<StylePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<StylePreset | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StyleAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await fetch('/api/styles/presets');
        const json = await res.json();
        setPresets(json.data ?? []);
      } catch {
        setError('프리셋을 불러오지 못했습니다.');
      } finally {
        setIsLoadingPresets(false);
      }
    }
    loadPresets();
  }, []);

  // 저장된 스타일 복원
  useEffect(() => {
    async function loadSavedStyle() {
      try {
        const res = await fetch(`/api/projects/${projectId}/styles`);
        if (!res.ok) return;
        const json = await res.json();
        const saved = json.data;
        if (!saved) return;

        if (saved.preset_id && saved.preset) {
          setActiveTab('preset');
          setSelectedPreset(saved.preset);
        } else if (saved.reference_urls?.length > 0) {
          setActiveTab('custom');
          setUploadedUrl(saved.reference_urls[0]);
          if (saved.analyzed_style && Object.keys(saved.analyzed_style).length > 0) {
            setAnalysisResult(saved.analyzed_style as StyleAnalysisResult);
          }
        }
      } catch {}
    }
    loadSavedStyle();
  }, [projectId]);

  async function handleUploadComplete(url: string) {
    setUploadedUrl(url);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const res = await fetch('/api/styles/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      });

      if (!res.ok) {
        throw new Error('스타일 분석에 실패했습니다.');
      }

      const json = await res.json();
      setAnalysisResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleRemoveImage() {
    setUploadedUrl(null);
    setAnalysisResult(null);
    setError(null);
  }

  async function handleNext() {
    if (!canProceed) return;
    setIsSaving(true);
    setError(null);

    try {
      const body =
        activeTab === 'preset' && selectedPreset
          ? { preset_id: selectedPreset.id }
          : {
              reference_urls: uploadedUrl ? [uploadedUrl] : [],
              analyzed_style: analysisResult ?? {},
            };

      const res = await fetch(`/api/projects/${projectId}/styles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('스타일 저장에 실패했습니다.');
      }

      router.push(`/projects/${projectId}/scenes`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      setIsSaving(false);
    }
  }

  const canProceed =
    (activeTab === 'preset' && selectedPreset !== null) ||
    (activeTab === 'custom' && uploadedUrl !== null && !isAnalyzing);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">스타일 설정</h1>
        <p className="text-sm text-zinc-500 mt-1">영상의 시각 스타일을 선택하세요.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-zinc-900/50 border border-zinc-800/50 mb-6">
        {(['preset', 'custom'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors',
              activeTab === tab
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {tab === 'preset' ? '프리셋 선택' : '커스텀 스타일'}
          </button>
        ))}
      </div>

      {activeTab === 'preset' && (
        <div>
          {isLoadingPresets ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          ) : (
            <StylePresetGrid
              presets={presets}
              selectedId={selectedPreset?.id ?? null}
              onSelect={setSelectedPreset}
            />
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-6">
          <ReferenceUploader
            onUploadComplete={handleUploadComplete}
            onRemove={handleRemoveImage}
            uploadedUrl={uploadedUrl}
          />

          {isAnalyzing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              <p className="text-sm text-zinc-400">이미지 스타일 분석 중...</p>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-medium text-zinc-200">분석 결과</p>
              </div>

              {analysisResult.color_palette?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-zinc-500">색상 시스템</p>
                  <div className="flex gap-2">
                    {analysisResult.color_palette.map((color) => (
                      <span
                        key={color}
                        className="w-6 h-6 rounded-full border border-zinc-700"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                {analysisResult.art_style && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">아트 스타일</p>
                    <p className="text-zinc-300">{analysisResult.art_style}</p>
                  </div>
                )}
                {analysisResult.layout_pattern && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">레이아웃</p>
                    <p className="text-zinc-300">{analysisResult.layout_pattern}</p>
                  </div>
                )}
                {analysisResult.component_style && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">컴포넌트</p>
                    <p className="text-zinc-300">{analysisResult.component_style}</p>
                  </div>
                )}
                {analysisResult.typography_style && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">타이포그래피</p>
                    <p className="text-zinc-300">{analysisResult.typography_style}</p>
                  </div>
                )}
                {analysisResult.color_application && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">색상 적용</p>
                    <p className="text-zinc-300">{analysisResult.color_application}</p>
                  </div>
                )}
                {analysisResult.depth_treatment && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">깊이/질감</p>
                    <p className="text-zinc-300">{analysisResult.depth_treatment}</p>
                  </div>
                )}
                {analysisResult.mood && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">분위기</p>
                    <p className="text-zinc-300 capitalize">{analysisResult.mood}</p>
                  </div>
                )}
                {analysisResult.composition && (
                  <div>
                    <p className="text-zinc-500 mb-0.5">구도</p>
                    <p className="text-zinc-300">{analysisResult.composition}</p>
                  </div>
                )}
              </div>

              {analysisResult.style_guide && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">디자인 가이드</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {analysisResult.style_guide}
                  </p>
                </div>
              )}

              {analysisResult.prompt_prefix && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">생성 프롬프트</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {analysisResult.prompt_prefix}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed || isSaving}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all',
            canProceed && !isSaving
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
