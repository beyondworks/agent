export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api-error';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: presets, error } = await supabase
      .from('style_presets')
      .select('id, name, category, description, thumbnail_url, prompt_prefix, prompt_suffix, negative_prompt, style_params')
      .eq('is_system', true)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ data: presets });
  } catch (error) {
    return handleApiError(error);
  }
}
