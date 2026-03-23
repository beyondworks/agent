// Remotion 비디오 데이터 타입

export interface SceneData {
  sceneNumber: number;
  narration: string;
  visualDesc: string;
  durationSec: number;
  imageUrl: string;
  audioDataUrl?: string;
  audioDurationSec?: number;
  transition: 'fade' | 'cut' | 'crossfade' | 'zoom_in' | 'zoom_out' | 'slide_left' | 'slide_right';
  motionParams?: {
    cameraPan: 'slow' | 'medium' | 'fast' | 'none';
    cameraZoom: 'slow_in' | 'slow_out' | 'fast_in' | 'fast_out' | 'none';
  };
}

export interface VideoProps {
  scenes: SceneData[];
  audioUrl?: string;
  subtitleSettings: {
    fontSize: number;
    color: string;
    position: 'bottom' | 'center';
  };
  fps: number;
  width: number;
  height: number;
}
