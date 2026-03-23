'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, VideoIcon, RefreshCw, Loader2, Play } from 'lucide-react';
import type { Scene } from './scene-timeline';
import { MotionControl, type MotionParams } from './motion-control';

interface SceneDetailProps {
  scene: Scene;
  projectId: string;
  onUpdate: (updatedScene: Scene) => void;
}

const DEFAULT_MOTION_PARAMS: MotionParams = {
  camera_pan: 'none',
  camera_zoom: 'none',
  motion_bucket: 'medium',
};

export function SceneDetail({ scene, projectId, onUpdate }: SceneDetailProps) {
  const [isRegenerating, setIsRegenerating] = useState<'image' | 'video' | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [motionParams, setMotionParams] = useState<MotionParams>(DEFAULT_MOTION_PARAMS);
  const [transition, setTransition] = useState<string>(scene.transition ?? 'cut');

  const images = scene.scene_media.filter((m) => m.media_type === 'image');
  const videos = scene.scene_media.filter((m) => m.media_type === 'video');

  const selectedMediaId =
    scene.scene_media.find((m) => m.is_selected)?.id ?? null;

  async function handleSelectMedia(mediaId: string, mediaType: 'image' | 'video') {
    try {
      const res = await fetch(
        `/api/projects/${projectId}/scenes/${scene.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selected_media_id: mediaId,
            media_type: mediaType,
          }),
        }
      );
      if (!res.ok) return;
      const { data } = await res.json();
      onUpdate(data as Scene);
    } catch {
      // 조용히 무시
    }
  }

  async function handleTransitionChange(newTransition: string) {
    setTransition(newTransition);
    try {
      await fetch(`/api/projects/${projectId}/scenes/${scene.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transition: newTransition }),
      });
    } catch {
      // 조용히 무시
    }
  }

  async function handleRegenerate(mediaType: 'image' | 'video') {
    setIsRegenerating(mediaType);
    setError(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/scenes/${scene.id}/regenerate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaType }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '재생성에 실패했습니다.');
        return;
      }
      // 씬 데이터 새로고침
      const sceneRes = await fetch(
        `/api/projects/${projectId}/scenes`
      );
      if (sceneRes.ok) {
        const { data } = await sceneRes.json();
        const updated = (data as Scene[]).find((s) => s.id === scene.id);
        if (updated) onUpdate(updated);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsRegenerating(null);
    }
  }

  async function handleGenerateVideo() {
    setIsGeneratingVideo(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/scenes/${scene.id}/generate-video`,
        { method: 'POST' }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '영상 생성에 실패했습니다.');
        return;
      }
      onUpdate(json.data as Scene);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsGeneratingVideo(false);
    }
  }

  // 현재 선택된 미디어
  const currentMedia =
    scene.scene_media.find((m) => m.id === selectedMediaId) ??
    scene.scene_media[0];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          씬 {scene.scene_number}
          <span className="ml-2 text-xs text-zinc-500 font-normal">
            {Number(scene.duration_sec)}초
          </span>
        </h3>
      </div>

      {/* 현재 선택된 미디어 미리보기 */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-950">
        {currentMedia ? (
          currentMedia.media_type === 'image' ? (
            <Image
              src={currentMedia.url}
              alt={`씬 ${scene.scene_number} 미리보기`}
              fill
              className="object-contain"
            />
          ) : (
            <video
              src={currentMedia.url}
              className="w-full h-full object-contain"
              controls
              muted
              loop
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* 미디어 타입 토글 */}
      <div className="flex rounded-lg overflow-hidden border border-zinc-700">
        <button
          onClick={() => {
            const img = images[0];
            if (img) handleSelectMedia(img.id, 'image');
          }}
          disabled={isRegenerating !== null || isGeneratingVideo || images.length === 0}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
            scene.media_type === 'image'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          이미지
        </button>
        <button
          onClick={() => {
            if (videos.length > 0) {
              handleSelectMedia(videos[0].id, 'video');
            } else {
              handleGenerateVideo();
            }
          }}
          disabled={isRegenerating !== null || isGeneratingVideo}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
            scene.media_type === 'video'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {isGeneratingVideo ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          영상 클립
        </button>
      </div>

      {/* 영상 생성 중 안내 */}
      {isGeneratingVideo && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
          <p className="text-xs text-zinc-300">Veo 3.1로 영상 생성 중... (1-3분 소요)</p>
        </div>
      )}

      {/* 나레이션 */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-500">나레이션</p>
        <p className="text-sm text-zinc-300 leading-relaxed">{scene.narration}</p>
      </div>

      {/* 이미지 후보 */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              이미지 후보
            </p>
            <button
              onClick={() => handleRegenerate('image')}
              disabled={isRegenerating !== null}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
            >
              {isRegenerating === 'image' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              재생성
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => handleSelectMedia(img.id, 'image')}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  img.id === selectedMediaId
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <Image
                  src={img.url}
                  alt="이미지 후보"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 영상 후보 */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <VideoIcon className="h-3.5 w-3.5" />
              영상 후보
            </p>
            <button
              onClick={() => handleRegenerate('video')}
              disabled={isRegenerating !== null}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
            >
              {isRegenerating === 'video' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              재생성
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {videos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => handleSelectMedia(vid.id, 'video')}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  vid.id === selectedMediaId
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <video
                  src={vid.url}
                  className="w-full aspect-video object-cover"
                  muted
                  loop
                  controls
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 영상 없을 때 영상 생성 버튼 */}
      {videos.length === 0 && (
        <button
          onClick={() => handleRegenerate('video')}
          disabled={isRegenerating !== null}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2.5 text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 disabled:opacity-50 transition-colors"
        >
          {isRegenerating === 'video' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <VideoIcon className="h-3.5 w-3.5" />
          )}
          영상 생성
        </button>
      )}

      {error && (
        <p className="text-xs text-red-400 rounded-lg border border-red-900 bg-red-950/30 px-3 py-2">
          {error}
        </p>
      )}

      {/* Motion Control */}
      <MotionControl
        motionParams={motionParams}
        transition={transition}
        onChange={setMotionParams}
        onTransitionChange={handleTransitionChange}
      />
    </div>
  );
}
