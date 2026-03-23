'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Palette,
  Film,
  Edit3,
  Download,
  Check,
} from 'lucide-react';

interface Step {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  { id: 'script', label: '대본', href: 'script', icon: FileText },
  { id: 'style', label: '스타일', href: 'style', icon: Palette },
  { id: 'scenes', label: '씬', href: 'scenes', icon: Film },
  { id: 'edit', label: '편집', href: 'edit', icon: Edit3 },
  { id: 'export', label: '내보내기', href: 'export', icon: Download },
];

interface StepNavigationProps {
  projectId: string;
}

export function StepNavigation({ projectId }: StepNavigationProps) {
  const pathname = usePathname();

  const currentStepIndex = STEPS.findIndex((s) =>
    pathname.startsWith(`/projects/${projectId}/${s.href}`)
  );

  return (
    <nav className="flex flex-col py-3">
      {STEPS.map((step, index) => {
        const href = `/projects/${projectId}/${step.href}`;
        const isActive = pathname.startsWith(href);
        const isDone = currentStepIndex > index;
        const isPending = !isActive && !isDone;

        const Icon = step.icon;

        return (
          <Link
            key={step.id}
            href={href}
            className={`group flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-zinc-800/60 text-zinc-200'
                : isDone
                ? 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-300'
                : 'text-zinc-600 hover:bg-zinc-800/20 hover:text-zinc-500'
            }`}
          >
            {/* 번호 뱃지 */}
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-blue-500 text-white ring-2 ring-blue-500/30'
                  : isDone
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {isDone ? <Check className="h-3 w-3" /> : index + 1}
            </span>

            {/* 아이콘 + 라벨 */}
            <span className="flex items-center gap-2">
              <Icon
                className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                  isActive
                    ? 'text-zinc-400'
                    : isDone
                    ? 'text-zinc-500'
                    : 'text-zinc-700'
                }`}
              />
              <span className={isPending ? 'text-zinc-600' : ''}>{step.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
