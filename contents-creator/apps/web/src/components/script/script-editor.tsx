'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

interface Scene {
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
  keywords?: string[];
}

interface ScriptEditorProps {
  scriptId: string;
  fullScript: string;
  scenes: Scene[];
  onSave?: (fullScript: string, scenes: Scene[]) => Promise<void>;
}

type ViewMode = 'full' | 'scenes';

export function ScriptEditor({ scriptId: _scriptId, fullScript: initialScript, scenes: initialScenes, onSave }: ScriptEditorProps) {
  const [view, setView] = useState<ViewMode>('scenes');
  const [fullScript, setFullScript] = useState(initialScript);
  const [scenes, setScenes] = useState(initialScenes);
  const [isSaving, setIsSaving] = useState(false);

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration_sec, 0);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(fullScript, scenes);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSceneNarration = (index: number, value: string) => {
    setScenes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], narration: value };
      return next;
    });
  };

  const updateSceneVisual = (index: number, value: string) => {
    setScenes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], visual_desc: value };
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 + 액션 */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-zinc-800 p-0.5">
          {(['full', 'scenes'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === mode
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {mode === 'full' ? '전체 대본' : `씬 목록 (${scenes.length}개)`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {totalDuration}초
          </span>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          )}
        </div>
      </div>

      {/* 전체 대본 뷰 */}
      {view === 'full' && (
        <textarea
          value={fullScript}
          onChange={(e) => setFullScript(e.target.value)}
          className="min-h-[480px] w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="대본이 여기 표시됩니다..."
        />
      )}

      {/* 씬 목록 뷰 */}
      {view === 'scenes' && (
        <div className="space-y-3">
          {scenes.map((scene, i) => (
            <div
              key={scene.scene_number}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  씬 {scene.scene_number}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-600">
                  <Clock className="h-3 w-3" />
                  {scene.duration_sec}초
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500">나레이션</label>
                <textarea
                  value={scene.narration}
                  onChange={(e) => updateSceneNarration(i, e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500">시각 설명</label>
                <textarea
                  value={scene.visual_desc}
                  onChange={(e) => updateSceneVisual(i, e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>

              {scene.keywords && scene.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {scene.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
