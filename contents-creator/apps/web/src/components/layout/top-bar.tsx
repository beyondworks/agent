'use client';

import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

const pageNames: Record<string, string> = {
  '/dashboard': '대시보드',
  '/projects': '프로젝트',
  '/templates': '템플릿',
  '/settings': '설정',
};

function getPageName(pathname: string): string {
  for (const [prefix, name] of Object.entries(pageNames)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return name;
    }
  }
  return '대시보드';
}

function getInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}

interface TopBarProps {
  user: User;
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800/50 bg-zinc-950 px-6">
      <h1 className="text-sm font-medium text-zinc-300">{pageName}</h1>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400">
          {getInitials(user.email ?? 'U')}
        </div>
      </div>
    </header>
  );
}
