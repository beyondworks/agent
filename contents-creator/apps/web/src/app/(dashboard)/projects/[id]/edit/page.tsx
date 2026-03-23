'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, Play, Volume2, Check } from 'lucide-react';
import { VoiceSettings, type VoiceSettingsValue } from '@/components/edit/voice-settings';
import { SubtitleSettings, type SubtitleSettingsValue } from '@/components/edit/subtitle-settings';

interface SceneMedia {
  id: string;
  media_type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  is_selected: boolean;
}

interface Scene {
  id: string;
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number | string;
  media_type: 'image' | 'video';
  selected_media_id: string | null;
  transition: string;
  scene_media: SceneMedia[];
}

export default function EditPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const router = useRouter();

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsValue>({
    language: 'ko',
    speed: 1.0,
    voiceId: 'ko-f-bright',
    emotionId: 'neutral',
    pitch: 0,
  });
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [ttsError, setTTSError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettingsValue>({
    fontSize: 48,
  });

  const loadScenes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/scenes`);
      if (res.ok) {
        const { data } = await res.json();
        setScenes((data as Scene[]) ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  const moveScene = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= scenes.length) return;
    const next = [...scenes];
    [next[index], next[target]] = [next[target], next[index]];
    // scene_number 재정렬
    setScenes(next.map((s, i) => ({ ...s, scene_number: i + 1 })));
    if (previewIndex === index) setPreviewIndex(target);
  };

  const handleTTSPreview = async () => {
    setTTSError(null);
    setIsTTSLoading(true);
    try {
      // 미리듣기: 현재 프리뷰 씬의 나레이션만 합성
      const previewText = scenes[previewIndex]?.narration ?? scenes[0]?.narration ?? '';
      if (!previewText.trim()) {
        setTTSError('미리듣기할 나레이션이 없습니다.');
        return;
      }
      const res = await fetch(`/api/projects/${projectId}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: previewText,
          voiceId: voiceSettings.voiceId,
          speed: voiceSettings.speed,
          emotionId: voiceSettings.emotionId,
          pitch: voiceSettings.pitch,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setTTSError(json.error?.message ?? '음성 생성에 실패했습니다.');
        return;
      }
      const { audioUrl } = json.data;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
    } catch {
      setTTSError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsTTSLoading(false);
    }
  };

  const handleRender = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneOrder: scenes.map((s) => s.id),
          voiceSettings,
          subtitleSettings,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '렌더링 요청에 실패했습니다.');
        return;
      }
      router.push(`/projects/${projectId}/export`);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentScene = scenes[previewIndex] ?? null;
  const currentMedia =
    currentScene?.scene_media.find((m) => m.is_selected) ??
    currentScene?.scene_media[0] ??
    null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">편집</h1>
        <p className="text-sm text-zinc-500 mt-1">
          씬 순서와 음성·자막을 설정한 뒤 렌더링을 시작합니다.
        </p>
      </div>

      {scenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-zinc-500">생성된 씬이 없습니다.</p>
          <p className="text-xs text-zinc-600">씬 생성 단계를 먼저 완료해주세요.</p>
        </div>
      ) : (
        <>
          {/* 씬 순서 편집 */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              씬 순서 ({scenes.length}개)
            </h2>
            <div className="overflow-x-auto pb-3">
              <div className="flex gap-3 min-w-max px-1">
                {scenes.map((scene, index) => {
                  const media =
                    scene.scene_media.find((m) => m.is_selected) ??
                    scene.scene_media[0];
                  const thumbUrl = media?.thumbnail_url ?? media?.url ?? null;
                  const isSelected = previewIndex === index;

                  return (
                    <div
                      key={scene.id}
                      className={`group relative flex flex-col gap-2 cursor-pointer ${
                        isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                      }`}
                      onClick={() => setPreviewIndex(index)}
                    >
                      {/* 썸네일 */}
                      <div
                        className={`relative h-24 w-40 rounded-lg overflow-hidden bg-zinc-800 border-2 transition-colors ${
                          isSelected ? 'border-blue-500' : 'border-zinc-700'
                        }`}
                      >
                        {thumbUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbUrl}
                            alt={`씬 ${scene.scene_number}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Play className="h-6 w-6 text-zinc-600" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-zinc-300 tabular-nums">
                          {Number(scene.duration_sec).toFixed(1)}s
                        </span>
                      </div>

                      {/* 씬 번호 + 이동 버튼 */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium text-zinc-400">
                          #{scene.scene_number}
                        </span>
                        <div className="flex gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveScene(index, -1); }}
                            disabled={index === 0}
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="왼쪽으로 이동"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveScene(index, 1); }}
                            disabled={index === scenes.length - 1}
                            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="오른쪽으로 이동"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 프리뷰 */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              간이 프리뷰
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {/* 미디어 영역 */}
              <div className="relative flex h-64 items-center justify-center bg-zinc-950">
                {currentMedia ? (
                  currentMedia.media_type === 'video' ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      key={currentMedia.url}
                      src={currentMedia.url}
                      className="h-full max-h-64 w-auto object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentMedia.url}
                      alt={`씬 ${currentScene?.scene_number} 미리보기`}
                      className="h-full max-h-64 w-auto object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-600">
                    <Play className="h-8 w-8" />
                    <span className="text-xs">미디어 없음</span>
                  </div>
                )}

                {/* 씬 번호 뱃지 */}
                {currentScene && (
                  <span className="absolute top-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs text-zinc-300">
                    씬 {currentScene.scene_number} / {scenes.length}
                  </span>
                )}

                {/* 내비게이션 */}
                <button
                  onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
                  disabled={previewIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPreviewIndex((i) => Math.min(scenes.length - 1, i + 1))}
                  disabled={previewIndex === scenes.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* 나레이션 편집 */}
              {currentScene && (
                <NarrationEditor
                  key={currentScene.id}
                  sceneId={currentScene.id}
                  projectId={projectId}
                  initialValue={currentScene.narration || ''}
                  onSaved={(newText) => {
                    setScenes((prev) =>
                      prev.map((s) =>
                        s.id === currentScene.id ? { ...s, narration: newText } : s
                      )
                    );
                  }}
                />
              )}

              {/* 안내 */}
              <div className="border-t border-zinc-800 px-5 py-2.5 bg-zinc-900/50">
                <p className="text-xs text-zinc-600">
                  아직 렌더링 전입니다. 최종 결과물은 내보내기에서 확인하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 설정 */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <VoiceSettings value={voiceSettings} onChange={setVoiceSettings} />
            <SubtitleSettings
              value={subtitleSettings}
              onChange={setSubtitleSettings}
              previewText={currentScene?.narration?.slice(0, 30) ?? '자막 미리보기'}
            />
          </section>

          {/* 음성 미리듣기 */}
          <section className="flex flex-col gap-2">
            <button
              onClick={handleTTSPreview}
              disabled={isTTSLoading}
              className="flex items-center gap-2 self-start rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTTSLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  음성 생성 중...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  음성 미리듣기
                </>
              )}
            </button>
            {ttsError && (
              <p className="text-xs text-red-400">{ttsError}</p>
            )}
          </section>

          {/* 에러 */}
          {error && (
            <p className="rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* 렌더링 시작 버튼 */}
          <div className="flex justify-end pb-4">
            <button
              onClick={handleRender}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  요청 중...
                </>
              ) : (
                '렌더링 시작'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function NarrationEditor({
  sceneId,
  projectId,
  initialValue,
  onSaved,
}: {
  sceneId: string;
  projectId: string;
  initialValue: string;
  onSaved: (newText: string) => void;
}) {
  const [text, setText] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = text !== initialValue;

  const save = async () => {
    if (!dirty || isSaving) return;
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/scenes/${sceneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narration: text }),
      });
      if (res.ok) {
        onSaved(text);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-t border-zinc-800 px-5 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">나레이션</p>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="h-3 w-3" />
            저장됨
          </span>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        rows={3}
        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 leading-relaxed placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        placeholder="나레이션을 입력하세요..."
      />
      {dirty && !isSaving && (
        <p className="text-xs text-zinc-600">포커스를 벗어나면 자동 저장됩니다</p>
      )}
      {isSaving && (
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          저장 중...
        </p>
      )}
    </div>
  );
}
