'use client';

import Image from 'next/image';
import { ImageIcon, VideoIcon, Play } from 'lucide-react';

interface SceneMedia {
  id: string;
  media_type: 'image' | 'video';
  url: string;
  is_selected: boolean;
}

interface SceneCardProps {
  sceneNumber: number;
  durationSec: number;
  mediaType: 'image' | 'video';
  selectedMedia?: SceneMedia;
  isSelected: boolean;
  onClick: () => void;
}

export function SceneCard({
  sceneNumber,
  durationSec,
  mediaType,
  selectedMedia,
  isSelected,
  onClick,
}: SceneCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-40 h-28 bg-zinc-900 border rounded-xl overflow-hidden transition-all ${
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500'
          : 'border-zinc-800 hover:border-zinc-600'
      }`}
    >
      {/* 썸네일 */}
      {selectedMedia ? (
        selectedMedia.media_type === 'image' ? (
          <Image
            src={selectedMedia.url}
            alt={`씬 ${sceneNumber}`}
            fill
            className="object-cover"
          />
        ) : (
          <video
            src={selectedMedia.url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-zinc-700">
            {mediaType === 'video' ? (
              <VideoIcon className="h-8 w-8" />
            ) : (
              <ImageIcon className="h-8 w-8" />
            )}
          </div>
        </div>
      )}

      {/* video 재생 아이콘 오버레이 */}
      {selectedMedia?.media_type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/50 p-2">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
        </div>
      )}

      {/* 씬 번호 + 초수 오버레이 */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5 flex items-end justify-between">
        <span className="text-xs font-semibold text-white">
          {sceneNumber}
        </span>
        <span className="text-[10px] text-zinc-400">{durationSec}s</span>
      </div>

      {/* 미디어 타입 아이콘 */}
      <div className="absolute top-1.5 right-1.5">
        {mediaType === 'video' ? (
          <VideoIcon className="h-3.5 w-3.5 text-white drop-shadow" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5 text-white drop-shadow" />
        )}
      </div>
    </button>
  );
}
