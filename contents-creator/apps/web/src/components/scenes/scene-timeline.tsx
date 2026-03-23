'use client';

import { SceneCard } from './scene-card';

interface SceneMedia {
  id: string;
  media_type: 'image' | 'video';
  url: string;
  is_selected: boolean;
}

export interface Scene {
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

interface SceneTimelineProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (scene: Scene) => void;
}

export function SceneTimeline({
  scenes,
  selectedSceneId,
  onSelectScene,
}: SceneTimelineProps) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex gap-4 min-w-max px-1">
        {scenes.map((scene) => {
          const selectedMedia =
            scene.scene_media.find((m) => m.is_selected) ??
            scene.scene_media[0];
          return (
            <SceneCard
              key={scene.id}
              sceneNumber={scene.scene_number}
              durationSec={Number(scene.duration_sec)}
              mediaType={scene.media_type}
              selectedMedia={selectedMedia}
              isSelected={selectedSceneId === scene.id}
              onClick={() => onSelectScene(scene)}
            />
          );
        })}
      </div>
    </div>
  );
}
