'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type ContentType = 'short_form' | 'long_form';

const PLATFORMS = [
  { id: 'youtube_shorts', label: '유튜브 쇼츠' },
  { id: 'instagram_reels', label: '인스타 릴스' },
  { id: 'tiktok', label: '틱톡' },
  { id: 'youtube', label: '유튜브 본편' },
] as const;

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('short_form');
  const [targetPlatform, setTargetPlatform] = useState<string[]>([]);
  const [spicyLevel, setSpicyLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePlatform(platformId: string) {
    setTargetPlatform((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic,
          content_type: contentType,
          target_platform: targetPlatform,
          export_settings: { spicy_level: spicyLevel },
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message ?? '프로젝트 생성에 실패했습니다.');
      }

      const json = await res.json();
      router.push(`/projects/${json.data.id}/script`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-zinc-600 mb-8">
        <Link href="/projects" className="hover:text-zinc-400 transition-colors">
          프로젝트
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400">새 프로젝트</span>
      </nav>

      <h1 className="text-2xl font-semibold text-zinc-100 mb-8">새 프로젝트</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2025 AI 트렌드 총정리"
              required
              maxLength={200}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* 주제 키워드 */}
          <div>
            <label htmlFor="topic" className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              주제 키워드
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: AI, 인공지능, 트렌드, 2025"
              required
              maxLength={500}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* 콘텐츠 타입 */}
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">콘텐츠 타입</p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'short_form', label: '숏폼', sub: '9:16 세로형' },
                  { value: 'long_form', label: '롱폼', sub: '16:9 가로형' },
                ] as const
              ).map(({ value, label, sub }) => (
                <label
                  key={value}
                  className={`relative flex flex-col gap-1 rounded-lg border p-4 cursor-pointer transition-colors ${
                    contentType === value
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="content_type"
                    value={value}
                    checked={contentType === value}
                    onChange={() => setContentType(value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-zinc-200">{label}</span>
                  <span className="text-xs text-zinc-500">{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 타겟 플랫폼 */}
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">타겟 플랫폼</p>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(({ id, label }) => (
                <label
                  key={id}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                    targetPlatform.includes(id)
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={targetPlatform.includes(id)}
                    onChange={() => togglePlatform(id)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-zinc-400"
                  />
                  <span className="text-sm text-zinc-400">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Spicy Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Spicy Level</p>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{
                  color: `hsl(${Math.round((1 - spicyLevel / 100) * 220)}, 80%, 60%)`,
                }}
              >
                {spicyLevel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={spicyLevel}
              onChange={(e) => setSpicyLevel(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-2"
              style={{
                background: `linear-gradient(to right, hsl(220, 80%, 55%) 0%, hsl(${Math.round((1 - spicyLevel / 100) * 220)}, 80%, 55%) ${spicyLevel}%, #27272a ${spicyLevel}%, #27272a 100%)`,
                accentColor: `hsl(${Math.round((1 - spicyLevel / 100) * 220)}, 80%, 55%)`,
              }}
            />
            <p className="text-xs text-zinc-500">
              {spicyLevel >= 80
                ? '매우 자극적 — 디시/블라인드식 구어체, 밈, 감탄사 활용'
                : spicyLevel >= 60
                  ? '직설적이고 강렬한 — 과감한 주장과 자극적 표현'
                  : spicyLevel >= 30
                    ? '친근하고 편안한 — 자연스러운 대화체'
                    : '차분하고 전문적 — 정제된 강의·교육 톤'}
            </p>
          </div>

          {/* 에러 */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* 제출 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/projects"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '생성 중...' : '프로젝트 생성'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
