import { z } from 'zod';

export const styleSetSchema = z.object({
  preset_id: z.string().uuid().optional(),
  reference_image: z.string().optional(),
});

export type StyleSetInput = z.infer<typeof styleSetSchema>;
