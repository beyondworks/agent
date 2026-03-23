import { z } from 'zod';
import { generateAIJSON } from './claude';
import {
  SCENE_PROMPT_SYSTEM,
  getScenePromptUserMessage,
} from './prompts/scene-prompt';

export interface SceneInput {
  scene_number: number;
  narration: string;
  visual_desc: string;
  duration_sec: number;
}

export interface ProjectStyle {
  final_prompt_prefix: string;
  final_prompt_suffix: string;
  final_negative_prompt: string;
}

export interface ScenePrompt {
  scene_number: number;
  prompt: string;
  negative_prompt: string;
  seed: number;
  aspect_ratio: '16:9' | '9:16';
}

interface EnhancedPromptResponse {
  enhanced_prompt: string;
}

// 이미지 생성 프롬프트에서 한글/비라틴 문자를 포함한 구절을 제거합니다.
// AI 이미지 모델은 한글·일본어·중국어를 정확히 렌더링하지 못해 깨진 글자가 생성됩니다.
function removeNonLatinTextDirectives(prompt: string): string {
  // 한글(가-힣), 일본어(히라가나/카타카나), 한자(CJK) 범위의 문자를 포함하는 단어/구절 제거
  const nonLatinPattern = /[\uAC00-\uD7A3\u3040-\u30FF\u4E00-\u9FFF]+/g;
  if (!nonLatinPattern.test(prompt)) return prompt;
  // 비라틴 문자가 포함된 경우 해당 문자를 공백으로 치환하고 다중 공백 정리
  return prompt.replace(/[\uAC00-\uD7A3\u3040-\u30FF\u4E00-\u9FFF]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

// 시각 설명에서 등장 엔티티(캐릭터/반복 요소) 추출 (단순 휴리스틱)
function extractEntities(visualDesc: string): string[] {
  const patterns = [
    /([A-Z가-힣][가-힣a-z]+\s?[가-힣a-z]*(?:씨|님|선생|박사|대표)?)/g,
    /(사람|남성|여성|아이|어린이|노인|캐릭터)/g,
  ];
  const entities = new Set<string>();
  for (const pattern of patterns) {
    const matches = visualDesc.match(pattern) ?? [];
    for (const m of matches) {
      const trimmed = m.trim();
      if (trimmed.length > 1) entities.add(trimmed);
    }
  }
  return [...entities];
}

export async function generateScenePrompts(
  scenes: SceneInput[],
  projectStyle: ProjectStyle,
  contentType: 'short_form' | 'long_form'
): Promise<ScenePrompt[]> {
  const aspectRatio: '16:9' | '9:16' =
    contentType === 'short_form' ? '9:16' : '16:9';
  const baseSeed = Math.floor(Math.random() * 100000);

  // 모든 씬을 한 번의 API 호출로 배치 처리 (씬당 개별 호출 대비 N배 빠름)
  const batchPrompt = `스타일 컨텍스트: ${projectStyle.final_prompt_prefix}

다음 ${scenes.length}개 씬의 visual_desc를 각각 이미지 생성에 최적화된 영어 프롬프트로 변환하세요.

${scenes.map(s => `씬 ${s.scene_number}: ${s.visual_desc}`).join('\n')}

각 씬에 대해 Nano Banana Core Formula를 적용하세요:
[Subject + descriptive adj], [action/pose/state], [location/context]. [Composition]. [Lighting]. [Style].
- 완성된 영어 문장으로 작성. 태그 수프 금지.
- 한글/일본어/중국어 텍스트 절대 포함 금지. 시각적 메타포로 대체.

JSON 배열로 응답: [{"scene_number": 1, "enhanced_prompt": "..."}, ...]`;

  const batchSchema = z.array(z.object({
    scene_number: z.number(),
    enhanced_prompt: z.string(),
  }));

  let enhancedResults: Array<{ scene_number: number; enhanced_prompt: string }> = [];
  try {
    enhancedResults = await generateAIJSON(
      SCENE_PROMPT_SYSTEM,
      batchPrompt,
      batchSchema,
      16384
    );
  } catch (err) {
    console.error('[style-chain] 배치 프롬프트 최적화 실패, visual_desc를 그대로 사용:', err);
  }

  return scenes.map(scene => {
    const enhanced = enhancedResults.find(r => r.scene_number === scene.scene_number);
    const visualText = enhanced?.enhanced_prompt ?? scene.visual_desc;
    const sanitizedVisual = removeNonLatinTextDirectives(visualText);
    const parts = [
      projectStyle.final_prompt_prefix,
      sanitizedVisual,
      projectStyle.final_prompt_suffix,
    ].filter(Boolean);

    return {
      scene_number: scene.scene_number,
      prompt: parts.join(', '),
      negative_prompt: projectStyle.final_negative_prompt,
      seed: baseSeed + scene.scene_number,
      aspect_ratio: aspectRatio,
    };
  });
}
