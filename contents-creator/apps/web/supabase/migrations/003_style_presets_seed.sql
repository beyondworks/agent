-- Style Presets Seed Data
-- 4개 기본 시스템 프리셋

INSERT INTO public.style_presets (id, name, category, description, thumbnail_url, prompt_prefix, prompt_suffix, negative_prompt, style_params, is_system) VALUES
(gen_random_uuid(), 'Animation', 'animation', '부드러운 2D 애니메이션 스타일', NULL,
 'colorful 2D animation style, smooth cel shading, vibrant colors, clean lines, studio ghibli inspired',
 'high quality, detailed, professional animation',
 'realistic, photographic, 3d render, blurry, low quality',
 '{"mood": "bright", "color_palette": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]}', true),

(gen_random_uuid(), 'Realistic', 'realistic', '사실적인 포토리얼 스타일', NULL,
 'photorealistic, high detail, professional photography, natural lighting',
 '8k resolution, sharp focus, cinematic composition',
 'cartoon, anime, illustration, painting, low quality, blurry',
 '{"mood": "neutral", "color_palette": ["#2C3E50", "#ECF0F1", "#3498DB", "#E74C3C"]}', true),

(gen_random_uuid(), 'Infographic', 'icon', '깔끔한 아이콘/인포그래픽 스타일', NULL,
 'minimalist flat design, clean infographic style, simple icons, geometric shapes',
 'professional presentation, data visualization, clean layout',
 'realistic, photographic, complex textures, messy, cluttered',
 '{"mood": "professional", "color_palette": ["#1ABC9C", "#3498DB", "#9B59B6", "#F39C12"]}', true),

(gen_random_uuid(), '3D Render', '3d', '모던 3D 렌더링 스타일', NULL,
 '3D rendered, modern CGI, octane render, volumetric lighting, soft shadows',
 'ultra detailed, professional 3D visualization, studio lighting',
 '2d, flat, cartoon, sketch, low poly, wireframe',
 '{"mood": "modern", "color_palette": ["#667eea", "#764ba2", "#f093fb", "#4facfe"]}', true);
