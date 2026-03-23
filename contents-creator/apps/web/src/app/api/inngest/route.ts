import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { generateScriptFunction } from '@/inngest/functions/generate-script';
import { generateScenesFunction } from '@/inngest/functions/generate-scenes';
import { renderPipelineFunction } from '@/inngest/functions/render-pipeline';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateScriptFunction, generateScenesFunction, renderPipelineFunction],
});
