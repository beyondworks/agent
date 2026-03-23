export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectCard } from '@/components/projects/project-card';

export const metadata = {
  title: '프로젝트 — VideoForge',
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, topic, status, content_type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (projectsError) throw new Error(projectsError.message);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">프로젝트</h1>
          <p className="text-sm text-zinc-500 mt-1">내 영상 제작 프로젝트 목록</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 프로젝트
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Plus className="w-10 h-10 text-zinc-700 mb-4" />
          <p className="text-sm text-zinc-500 mb-1">아직 프로젝트가 없습니다</p>
          <p className="text-xs text-zinc-600 mb-6">첫 번째 영상 프로젝트를 만들어 보세요.</p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            새 프로젝트 만들기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
