-- ============================================================
-- VideoForge Database Schema
-- Database: Supabase (PostgreSQL 16)
-- ORM: Prisma 6.x
-- Date: 2026-03-22
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM Types
-- ============================================================

CREATE TYPE content_type AS ENUM ('short_form', 'long_form');
CREATE TYPE project_status AS ENUM ('draft', 'scripting', 'styling', 'generating', 'editing', 'rendering', 'completed', 'failed');
CREATE TYPE scene_media_type AS ENUM ('image', 'video');
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE export_resolution AS ENUM ('720p', '1080p', '4k');

-- ============================================================
-- 1. Users (Supabase Auth 확장)
-- ============================================================

CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name    TEXT NOT NULL DEFAULT '',
    avatar_url      TEXT,
    subscription    subscription_tier NOT NULL DEFAULT 'free',
    -- 사용자 기본 설정
    default_voice   JSONB DEFAULT '{}',     -- { "language": "ko", "speed": 1.0, "tone": "neutral" }
    default_style   UUID,                    -- FK to style_presets (nullable)
    -- 사용량 추적
    monthly_renders INT NOT NULL DEFAULT 0,
    monthly_reset   TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()) + INTERVAL '1 month',
    -- 외부 API 키 (사용자가 자체 키 사용 시)
    gemini_api_key_encrypted TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_subscription ON public.profiles(subscription);

-- ============================================================
-- 2. Projects
-- ============================================================

CREATE TABLE public.projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    topic           TEXT NOT NULL,           -- 주제 키워드
    content_type    content_type NOT NULL,
    target_platform TEXT[] DEFAULT '{}',     -- ['youtube_shorts', 'instagram_reels', 'tiktok']
    status          project_status NOT NULL DEFAULT 'draft',
    -- 메타데이터
    duration_sec    INT,                     -- 예상/실제 영상 길이 (초)
    scene_count     INT DEFAULT 0,
    -- 내보내기 설정
    export_settings JSONB DEFAULT '{}',      -- { "resolution": "1080p", "fps": 30, "format": "mp4" }
    -- 최종 결과물
    output_url      TEXT,                    -- Supabase Storage URL
    output_expires  TIMESTAMPTZ,             -- 다운로드 링크 만료
    thumbnail_url   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_created ON public.projects(created_at DESC);

-- ============================================================
-- 3. Scripts (대본)
-- ============================================================

CREATE TABLE public.scripts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version         INT NOT NULL DEFAULT 1,
    -- 대본 소스
    source_type     TEXT NOT NULL DEFAULT 'keyword',  -- 'keyword', 'url', 'text'
    source_keywords TEXT[],
    source_url      TEXT,
    source_text     TEXT,
    -- AI 생성 결과
    research_data   JSONB DEFAULT '{}',      -- 웹 리서치 결과 요약
    full_script     TEXT NOT NULL DEFAULT '',
    scenes_json     JSONB NOT NULL DEFAULT '[]',
    -- 씬 JSON 구조: [{ "scene_id": 1, "narration": "...", "visual_desc": "...", "duration_sec": 5 }]
    -- 품질 점수
    quality_score   JSONB DEFAULT '{}',      -- { "hook": 8, "storytelling": 7, "cta": 9, "total": 80 }
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scripts_project ON public.scripts(project_id);
CREATE UNIQUE INDEX idx_scripts_active ON public.scripts(project_id) WHERE is_active = true;

-- ============================================================
-- 4. Style Presets (스타일 프리셋)
-- ============================================================

CREATE TABLE public.style_presets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    category        TEXT NOT NULL,           -- 'animation', 'realistic', 'icon', '3d', 'custom'
    description     TEXT,
    thumbnail_url   TEXT,
    -- 스타일 파라미터
    prompt_prefix   TEXT NOT NULL DEFAULT '',  -- 프롬프트 앞에 붙는 스타일 지시어
    prompt_suffix   TEXT NOT NULL DEFAULT '',  -- 프롬프트 뒤에 붙는 스타일 지시어
    negative_prompt TEXT DEFAULT '',
    style_params    JSONB DEFAULT '{}',      -- { "color_palette": [...], "mood": "...", "lighting": "..." }
    -- 소유권
    is_system       BOOLEAN NOT NULL DEFAULT false,  -- true: 시스템 기본, false: 사용자 커스텀
    user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_style_presets_category ON public.style_presets(category);
CREATE INDEX idx_style_presets_system ON public.style_presets(is_system);

-- ============================================================
-- 5. Project Styles (프로젝트별 스타일 설정)
-- ============================================================

CREATE TABLE public.project_styles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    preset_id       UUID REFERENCES public.style_presets(id),
    -- 커스텀 스타일 (레퍼런스 이미지 기반)
    reference_urls  TEXT[] DEFAULT '{}',     -- 업로드된 레퍼런스 이미지 URLs
    analyzed_style  JSONB DEFAULT '{}',      -- AI 분석 결과
    -- 최종 프롬프트 설정
    final_prompt_prefix TEXT NOT NULL DEFAULT '',
    final_prompt_suffix TEXT NOT NULL DEFAULT '',
    final_negative_prompt TEXT DEFAULT '',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id)
);

-- ============================================================
-- 6. Scenes (씬)
-- ============================================================

CREATE TABLE public.scenes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    scene_number    INT NOT NULL,            -- 씬 순서 (1부터)
    -- 대본 연결
    narration       TEXT NOT NULL DEFAULT '',  -- 이 씬의 나레이션 텍스트
    visual_desc     TEXT NOT NULL DEFAULT '',  -- 시각적 설명
    duration_sec    NUMERIC(5,2) NOT NULL DEFAULT 5.0,
    -- 생성 프롬프트
    generation_prompt TEXT,                  -- 최종 프롬프트 (스타일 + 시각 설명)
    -- 선택된 미디어
    media_type      scene_media_type NOT NULL DEFAULT 'image',
    selected_media_id UUID,                  -- FK to scene_media
    -- 편집 설정
    transition      TEXT DEFAULT 'fade',     -- 'fade', 'cut', 'dissolve', 'slide'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scenes_project ON public.scenes(project_id, scene_number);

-- ============================================================
-- 7. Scene Media (씬별 생성된 미디어 후보들)
-- ============================================================

CREATE TABLE public.scene_media (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id        UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
    media_type      scene_media_type NOT NULL,
    -- 미디어 파일
    storage_path    TEXT NOT NULL,           -- Supabase Storage 경로
    url             TEXT NOT NULL,           -- 접근 URL
    thumbnail_url   TEXT,
    -- 생성 메타데이터
    prompt_used     TEXT NOT NULL,
    generation_seed TEXT,                    -- 재현성을 위한 시드값
    width           INT,
    height          INT,
    duration_sec    NUMERIC(5,2),            -- 영상인 경우
    file_size_bytes BIGINT,
    -- 선택 여부
    is_selected     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scene_media_scene ON public.scene_media(scene_id);

-- ============================================================
-- 8. Audio Tracks (TTS 생성 오디오)
-- ============================================================

CREATE TABLE public.audio_tracks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    -- 오디오 파일
    storage_path    TEXT NOT NULL,
    url             TEXT NOT NULL,
    duration_sec    NUMERIC(8,2) NOT NULL,
    -- TTS 설정
    voice_settings  JSONB NOT NULL DEFAULT '{}',  -- { "language": "ko", "speed": 1.0, "voice_id": "..." }
    -- 타임스탬프 (자막 싱크용)
    word_timestamps JSONB NOT NULL DEFAULT '[]',
    -- [{ "word": "안녕", "start": 0.0, "end": 0.3 }, ...]
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audio_tracks_project ON public.audio_tracks(project_id);

-- ============================================================
-- 9. Subtitles (자막)
-- ============================================================

CREATE TABLE public.subtitles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    format          TEXT NOT NULL DEFAULT 'ass',  -- 'srt', 'ass', 'vtt'
    style_settings  JSONB DEFAULT '{}',      -- { "font": "...", "size": 48, "color": "#FFFFFF", "outline": 2 }
    content         TEXT NOT NULL DEFAULT '',  -- 자막 파일 내용
    storage_path    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, format)
);

-- ============================================================
-- 10. Jobs (비동기 작업 큐)
-- ============================================================

CREATE TABLE public.jobs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    job_type        TEXT NOT NULL,            -- 'script_generation', 'scene_generation', 'tts', 'render'
    status          job_status NOT NULL DEFAULT 'pending',
    -- 진행 상태
    progress        INT NOT NULL DEFAULT 0,  -- 0-100
    total_steps     INT DEFAULT 0,
    current_step    INT DEFAULT 0,
    -- 입출력
    input_data      JSONB DEFAULT '{}',
    output_data     JSONB DEFAULT '{}',
    error_message   TEXT,
    -- 재시도
    retry_count     INT NOT NULL DEFAULT 0,
    max_retries     INT NOT NULL DEFAULT 3,
    -- 타이밍
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_project ON public.jobs(project_id);
CREATE INDEX idx_jobs_status ON public.jobs(status) WHERE status IN ('pending', 'processing');

-- ============================================================
-- 11. Templates (사용자 저장 템플릿)
-- ============================================================

CREATE TABLE public.templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    -- 템플릿 내용
    content_type    content_type,
    style_preset_id UUID REFERENCES public.style_presets(id),
    voice_settings  JSONB DEFAULT '{}',
    subtitle_style  JSONB DEFAULT '{}',
    export_settings JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_user ON public.templates(user_id);

-- ============================================================
-- RLS (Row Level Security) Policies
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Profiles: 자신의 프로필만 접근
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects: 자신의 프로젝트만 CRUD
CREATE POLICY "Users can CRUD own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Scripts: 자신의 프로젝트 대본만 접근
CREATE POLICY "Users can access own scripts" ON public.scripts
    FOR ALL USING (
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- Scenes: 자신의 프로젝트 씬만 접근
CREATE POLICY "Users can access own scenes" ON public.scenes
    FOR ALL USING (
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- Scene Media: 자신의 씬 미디어만 접근
CREATE POLICY "Users can access own scene media" ON public.scene_media
    FOR ALL USING (
        scene_id IN (
            SELECT s.id FROM public.scenes s
            JOIN public.projects p ON s.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Audio Tracks: 자신의 오디오만 접근
CREATE POLICY "Users can access own audio" ON public.audio_tracks
    FOR ALL USING (
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- Subtitles: 자신의 자막만 접근
CREATE POLICY "Users can access own subtitles" ON public.subtitles
    FOR ALL USING (
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- Jobs: 자신의 작업만 조회
CREATE POLICY "Users can view own jobs" ON public.jobs
    FOR SELECT USING (
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- Templates: 자신의 템플릿만 CRUD
CREATE POLICY "Users can CRUD own templates" ON public.templates
    FOR ALL USING (auth.uid() = user_id);

-- Style Presets: 시스템 프리셋은 모두 조회 가능, 커스텀은 자신 것만
CREATE POLICY "Anyone can view system presets" ON public.style_presets
    FOR SELECT USING (is_system = true);
CREATE POLICY "Users can CRUD own presets" ON public.style_presets
    FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- Trigger: updated_at 자동 갱신
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_project_styles_updated_at BEFORE UPDATE ON public.project_styles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_scenes_updated_at BEFORE UPDATE ON public.scenes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subtitles_updated_at BEFORE UPDATE ON public.subtitles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
