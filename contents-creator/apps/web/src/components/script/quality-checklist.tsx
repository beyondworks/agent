interface CategoryScore {
  score: number;
  reason?: string;
}

interface QualityScore {
  categories: {
    hook: CategoryScore;
    storytelling: CategoryScore;
    density: CategoryScore;
    cta: CategoryScore;
    visual: CategoryScore;
  };
  total: number;
  suggestions: string[];
}

const CATEGORY_META = {
  hook: { label: '첫 3초 훅', max: 20 },
  storytelling: { label: '스토리 구조', max: 25 },
  density: { label: '정보 밀도', max: 20 },
  cta: { label: 'CTA 효과', max: 15 },
  visual: { label: '영상화 적합성', max: 20 },
} as const;

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const color =
    pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-800">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function TotalRing({ total }: { total: number }) {
  const color =
    total >= 70 ? 'text-emerald-400' : total >= 40 ? 'text-amber-400' : 'text-red-400';
  const ringColor =
    total >= 70 ? 'bg-emerald-500/10 ring-emerald-500/20' : total >= 40 ? 'bg-amber-500/10 ring-amber-500/20' : 'bg-red-500/10 ring-red-500/20';
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ${ringColor}`}>
      <span className={`text-sm font-bold font-mono ${color}`}>{total}</span>
    </div>
  );
}

interface QualityChecklistProps {
  quality: QualityScore;
}

export function QualityChecklist({ quality }: QualityChecklistProps) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-5 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">품질 평가</span>
        <TotalRing total={quality.total} />
      </div>

      {/* 카테고리 바 */}
      <div className="space-y-3">
        {(Object.entries(CATEGORY_META) as Array<[keyof typeof CATEGORY_META, { label: string; max: number }]>).map(
          ([key, meta]) => {
            const cat = quality.categories?.[key] ?? { score: 0 };
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{meta.label}</span>
                  <span className="text-xs font-mono text-zinc-300">
                    {cat.score}
                    <span className="text-zinc-600">/{meta.max}</span>
                  </span>
                </div>
                <ScoreBar score={cat.score} max={meta.max} />
                {cat.reason && (
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{cat.reason}</p>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* 개선 제안 */}
      {(quality.suggestions?.length ?? 0) > 0 && (
        <div className="space-y-2 pt-1 border-t border-zinc-800/50">
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pt-1">
            개선 제안
          </h4>
          <ul className="space-y-1.5">
            {quality.suggestions.map((suggestion, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-400 leading-relaxed">
                <span className="mt-0.5 shrink-0 text-amber-500">·</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
