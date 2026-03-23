export const ContentType = {
  SHORT_FORM: 'short_form',
  LONG_FORM: 'long_form',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const ProjectStatus = {
  DRAFT: 'draft',
  SCRIPTING: 'scripting',
  STYLING: 'styling',
  GENERATING: 'generating',
  EDITING: 'editing',
  RENDERING: 'rendering',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const SceneMediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;
export type SceneMediaType = (typeof SceneMediaType)[keyof typeof SceneMediaType];

export const JobStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const SubscriptionTier = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;
export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier];

export const ExportResolution = {
  HD: '720p',
  FHD: '1080p',
  UHD: '4k',
} as const;
export type ExportResolution = (typeof ExportResolution)[keyof typeof ExportResolution];

export const USAGE_LIMITS = {
  free: { monthly_renders: 3, monthly_scenes: 30, max_duration: 60, concurrent: 1 },
  pro: { monthly_renders: 50, monthly_scenes: 500, max_duration: 1800, concurrent: 3 },
  enterprise: { monthly_renders: -1, monthly_scenes: -1, max_duration: 3600, concurrent: 10 },
} as const;

export const SUPPORTED_PLATFORMS = [
  'youtube_shorts',
  'instagram_reels',
  'tiktok',
  'youtube',
  'custom',
] as const;
export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];
