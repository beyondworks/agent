import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { z } from 'zod';

const MODEL = 'gemini-3.1-pro-preview';

function getModel() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is required');
  return google(MODEL);
}

export async function generateAIText(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const { text } = await generateText({
    model: getModel(),
    system: systemPrompt,
    prompt: userPrompt,
    maxOutputTokens: 8192,
  });
  return text;
}

function extractJSON(text: string): string {
  let cleaned = text
    .replace(/^```(?:json)?\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim();

  const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (jsonMatch) cleaned = jsonMatch[1];

  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  return cleaned;
}

export async function generateAIJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: z.ZodType<T>,
  maxTokens: number = 8192
): Promise<T> {
  const { text } = await generateText({
    model: getModel(),
    system:
      systemPrompt +
      '\n\nIMPORTANT: Respond ONLY with a valid JSON array or object. No markdown code blocks, no explanations, no comments. Use double quotes for all keys and string values.',
    prompt: userPrompt,
    maxOutputTokens: maxTokens,
  });

  const cleaned = extractJSON(text);
  const parsed = JSON.parse(cleaned);
  return schema.parse(parsed);
}
