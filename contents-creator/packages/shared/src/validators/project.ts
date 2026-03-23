import { z } from 'zod';

export const projectCreateSchema = z.object({
  title: z.string().min(1).max(200),
  topic: z.string().min(1).max(500),
  content_type: z.enum(['short_form', 'long_form']),
  target_platform: z.array(z.string()).default([]),
  export_settings: z.object({
    spicy_level: z.number().min(0).max(100).default(50),
  }).optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  topic: z.string().min(1).max(500).optional(),
  content_type: z.enum(['short_form', 'long_form']).optional(),
  target_platform: z.array(z.string()).optional(),
  status: z
    .enum(['draft', 'scripting', 'styling', 'generating', 'editing', 'rendering', 'completed', 'failed'])
    .optional(),
  export_settings: z.record(z.unknown()).optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
