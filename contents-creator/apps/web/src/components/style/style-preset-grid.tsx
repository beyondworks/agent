'use client';

import { Check, Sparkles, PenTool, Film, BarChart3, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StylePreset {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  prompt_prefix: string;
  prompt_suffix: string;
  negative_prompt: string;
  style_params: {
    mood?: string;
    color_palette?: string[];
    motion?: string;
  } | null;
}

interface StylePresetGridProps {
  presets: StylePreset[];
  selectedId: string | null;
  onSelect: (preset: StylePreset) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  character_animation: Sparkles,
  comic_style: PenTool,
  cinematic_real: Film,
  infographic_motion: BarChart3,
  '3d_motion': Box,
};

export function StylePresetGrid({ presets, selectedId, onSelect }: StylePresetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {presets.map((preset) => {
        const isSelected = preset.id === selectedId;
        const colors = preset.style_params?.color_palette ?? [];
        const Icon = CATEGORY_ICONS[preset.category] ?? Sparkles;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              'relative text-left rounded-xl p-5 cursor-pointer transition-all duration-150 border',
              isSelected
                ? 'bg-blue-500/5 border-blue-500/50 ring-1 ring-blue-500/20'
                : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'
            )}
          >
            {/* 선택 체크 */}
            {isSelected && (
              <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                <Check className="w-3 h-3 text-white" />
              </span>
            )}

            {/* 아이콘 */}
            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-zinc-400" />
            </div>

            {/* 이름 */}
            <p className="text-sm font-semibold text-zinc-200">{preset.name}</p>

            {/* 설명 */}
            {preset.description && (
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{preset.description}</p>
            )}

            {/* 분위기 태그 + 컬러 팔레트 */}
            <div className="flex items-center justify-between mt-3">
              {preset.style_params?.mood ? (
                <span className="text-[10px] bg-zinc-800/50 text-zinc-500 rounded px-2 py-0.5 capitalize">
                  {preset.style_params.mood}
                </span>
              ) : (
                <span />
              )}

              {colors.length > 0 && (
                <div className="flex items-center gap-1">
                  {colors.slice(0, 4).map((color) => (
                    <span
                      key={color}
                      className="w-3.5 h-3.5 rounded-full border border-zinc-700/50 shrink-0"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
