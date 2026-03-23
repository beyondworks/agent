'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, FolderKanban, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProjectStatus =
  | 'draft'
  | 'scripting'
  | 'styling'
  | 'generating'
  | 'editing'
  | 'rendering'
  | 'completed'
  | 'failed';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: '초안',
  scripting: '스크립트 작성',
  styling: '스타일 설정',
  generating: '생성 중',
  editing: '편집 중',
  rendering: '렌더링',
  completed: '완료',
  failed: '실패',
};

const STATUS_CLASSES: Record<ProjectStatus, string> = {
  draft: 'bg-zinc-800 text-zinc-400',
  scripting: 'bg-blue-500/10 text-blue-400',
  styling: 'bg-violet-500/10 text-violet-400',
  generating: 'bg-amber-500/10 text-amber-400',
  editing: 'bg-orange-500/10 text-orange-400',
  rendering: 'bg-yellow-500/10 text-yellow-400',
  completed: 'bg-emerald-500/10 text-emerald-400',
  failed: 'bg-red-500/10 text-red-400',
};

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    topic: string;
    status: string;
    content_type: string;
    created_at: Date;
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const status = project.status as ProjectStatus;
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusClass = STATUS_CLASSES[status] ?? 'bg-zinc-800 text-zinc-400';
  const contentTypeLabel = project.content_type === 'short_form' ? '숏폼 (9:16)' : '롱폼 (16:9)';

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Link
      href={`/projects/${project.id}/script`}
      className={cn(
        'group relative block bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="h-32 bg-zinc-800/30 flex items-center justify-center">
        <FolderKanban className="w-8 h-8 text-zinc-700" />
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 opacity-0 group-hover:opacity-100 hover:border-red-500 hover:bg-red-500/10 transition-all"
        title="프로젝트 삭제"
      >
        <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400" />
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-200 truncate">{project.title}</h3>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{project.topic}</p>
          </div>
          <ChevronRight className="flex-shrink-0 w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-0.5" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full',
                statusClass
              )}
            >
              {statusLabel}
            </span>
            <span className="text-[10px] text-zinc-600">{contentTypeLabel}</span>
          </div>
          <span className="text-[10px] text-zinc-600">{formatDate(project.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
