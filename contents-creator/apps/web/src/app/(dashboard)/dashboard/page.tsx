import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = user?.email?.split('@')[0] ?? '사용자';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100">
          안녕하세요, {displayName}님
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          오늘도 멋진 영상을 만들어보세요.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-400">최근 프로젝트</h3>
          <Link
            href="/projects/new"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            새 프로젝트
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-10 h-10 text-zinc-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375z"
            />
          </svg>
          <p className="text-sm text-zinc-500">프로젝트가 없습니다</p>
          <p className="mt-1 text-xs text-zinc-600">첫 프로젝트를 만들어보세요</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">빠른 시작</h3>
        <div className="flex gap-3">
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
          >
            새 프로젝트 만들기
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
          >
            템플릿 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
