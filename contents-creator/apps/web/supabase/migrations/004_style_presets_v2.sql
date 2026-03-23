-- 기존 시스템 프리셋 삭제
DELETE FROM public.style_presets WHERE is_system = true;

-- 새 5개 카테고리 프리셋
INSERT INTO public.style_presets (name, category, description, prompt_prefix, prompt_suffix, negative_prompt, style_params, is_system) VALUES
('캐릭터 애니메이션', 'character_animation', '밝은 2D/3D 캐릭터 애니메이션. 귀여운 캐릭터와 생생한 표정이 특징',
 'In a colorful 2D character animation style with smooth cel shading, expressive character faces, and vibrant saturated colors. Clean outlines, Pixar-inspired visual quality.',
 '',
 'text, words, letters, watermark, signature, deformed hands, extra fingers',
 '{"mood": "bright", "motion": "camera_pan: medium, motion_bucket: high"}', true),

('웹툰/만화', 'comic_style', '한국 웹툰 또는 만화 스타일. 강렬한 선과 과장된 표현',
 'In a Korean webtoon illustration style with bold black outlines, dramatic angles, and high-contrast colors. Dynamic composition with manhwa visual storytelling.',
 '',
 'text, words, letters, watermark, 3D render, photorealistic, blurry, deformed',
 '{"mood": "dramatic", "motion": "camera_zoom: fast, motion_bucket: medium"}', true),

('시네마틱 실사', 'cinematic_real', '영화 같은 사실적 스타일. 극적 조명과 시네마틱 구도',
 'Photorealistic cinematic still with professional color grading, shallow depth of field, and film grain texture. Dramatic lighting with natural shadow play.',
 '',
 'text, words, letters, watermark, cartoon, anime, illustration, painting, low quality, blurry, deformed hands',
 '{"mood": "cinematic", "motion": "camera_pan: slow, camera_zoom: slow_in"}', true),

('인포그래픽/모션', 'infographic_motion', '깔끔한 아이콘, 차트, 다이어그램 중심. 정보 전달에 최적화',
 'In a clean minimalist flat design style with geometric shapes, simple icons, and a soft pastel gradient background. Professional data visualization aesthetic.',
 '',
 'text, words, letters, watermark, realistic photo, complex textures, messy, cluttered, 3D, anime',
 '{"mood": "professional", "motion": "camera_zoom: slow_in, motion_bucket: low"}', true),

('3D 모션그래픽', '3d_motion', '모던 3D 렌더링과 모션그래픽. 글로시한 오브젝트와 볼류메트릭 라이팅',
 '3D rendered in modern CGI quality with volumetric lighting, soft shadows, and glossy reflective surfaces. Studio-lit floating objects on a clean background.',
 '',
 'text, words, letters, watermark, 2D, flat, cartoon, sketch, low poly, wireframe, deformed',
 '{"mood": "modern", "motion": "camera_pan: medium, camera_zoom: slow_in, motion_bucket: high"}', true);
