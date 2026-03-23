import { z } from 'zod';

export const scriptGenerateSchema = z.object({
  keywords: z.array(z.string()).min(1),
  source_url: z.string().url().optional(),
  source_text: z.string().max(50000).optional(),
  preferences: z.record(z.unknown()).optional(),
});

export const scriptUpdateSchema = z.object({
  full_script: z.string().optional(),
  scenes_json: z
    .array(
      z.object({
        scene_id: z.number(),
        narration: z.string(),
        visual_desc: z.string(),
        duration_sec: z.number().positive(),
      })
    )
    .optional(),
});

export type ScriptGenerateInput = z.infer<typeof scriptGenerateSchema>;
export type ScriptUpdateInput = z.infer<typeof scriptUpdateSchema>;
