'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  LayoutTemplate,
  Settings,
  LogOut,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const navItems = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '프로젝트', href: '/projects', icon: FolderKanban },
  { label: '템플릿', href: '/templates', icon: LayoutTemplate },
  { label: '설정', href: '/settings', icon: Settings },
];

interface SidebarProps {
  user: User;
  onSignOut: () => void;
}

export function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-zinc-950 border-r border-zinc-800/50">
      <div className="px-5 py-5">
        <span className="text-lg font-bold text-zinc-100">VideoForge</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-zinc-100 bg-zinc-800/80'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/50 px-4 py-4">
        <p className="text-xs text-zinc-500 truncate mb-3">{user.email}</p>
        <button
          onClick={onSignOut}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
