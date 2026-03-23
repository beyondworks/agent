import type {
  ContentType,
  ProjectStatus,
  SceneMediaType,
  JobStatus,
  SubscriptionTier,
} from '../constants/index.js';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  subscription: SubscriptionTier;
  default_voice: Record<string, unknown>;
  default_style: string | null;
  monthly_renders: number;
  monthly_reset: string;
  gemini_api_key_encrypted: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  content_type: ContentType;
  target_platform: string[];
  status: ProjectStatus;
  duration_sec: number | null;
  scene_count: number;
  export_settings: Record<string, unknown>;
  output_url: string | null;
  output_expires: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Script {
  id: string;
  project_id: string;
  version: number;
  source_type: string;
  source_keywords: string[] | null;
  source_url: string | null;
  source_text: string | null;
  research_data: Record<string, unknown>;
  full_script: string;
  scenes_json: SceneScript[];
  quality_score: QualityScore;
  is_active: boolean;
  created_at: string;
}

export interface SceneScript {
  scene_id: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
  keywords?: string[];
}

export interface QualityScore {
  total: number;
  categories: {
    hook: number;
    storytelling: number;
    density: number;
    cta: number;
    visual: number;
  };
  suggestions?: string[];
}

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  prompt_prefix: string;
  prompt_suffix: string;
  negative_prompt: string;
  style_params: Record<string, unknown>;
  is_system: boolean;
  user_id: string | null;
  created_at: string;
}

export interface ProjectStyle {
  id: string;
  project_id: string;
  preset_id: string | null;
  reference_urls: string[];
  analyzed_style: Record<string, unknown>;
  final_prompt_prefix: string;
  final_prompt_suffix: string;
  final_negative_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  project_id: string;
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
  generation_prompt: string | null;
  media_type: SceneMediaType;
  selected_media_id: string | null;
  transition: string;
  created_at: string;
  updated_at: string;
}

export interface SceneMedia {
  id: string;
  scene_id: string;
  media_type: SceneMediaType;
  storage_path: string;
  url: string;
  thumbnail_url: string | null;
  prompt_used: string;
  generation_seed: string | null;
  width: number | null;
  height: number | null;
  duration_sec: number | null;
  file_size_bytes: number | null;
  is_selected: boolean;
  created_at: string;
}

export interface AudioTrack {
  id: string;
  project_id: string;
  storage_path: string;
  url: string;
  duration_sec: number;
  voice_settings: Record<string, unknown>;
  word_timestamps: WordTimestamp[];
  created_at: string;
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  scene_id?: number;
}

export interface Subtitle {
  id: string;
  project_id: string;
  format: string;
  style_settings: Record<string, unknown>;
  content: string;
  storage_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  project_id: string;
  job_type: string;
  status: JobStatus;
  progress: number;
  total_steps: number;
  current_step: number;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  content_type: ContentType | null;
  style_preset_id: string | null;
  voice_settings: Record<string, unknown>;
  subtitle_style: Record<string, unknown>;
  export_settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
