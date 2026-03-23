import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StepNavigation } from '@/components/workspace/step-navigation';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, title, user_id, content_type')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    redirect('/projects');
  }

  return (
    <div className="flex h-full -m-6">
      {/* 좌측 스텝 네비게이션 */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-zinc-800/50 bg-zinc-950">
        <div className="border-b border-zinc-800/50 px-4 py-4">
          <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-1.5">프로젝트</p>
          <h2 className="text-sm font-semibold text-zinc-200 truncate leading-snug">{project.title}</h2>
          <span className="mt-1.5 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
            {project.content_type === 'short_form' ? '숏폼' : '롱폼'}
          </span>
        </div>
        <StepNavigation projectId={id} />
      </aside>

      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
