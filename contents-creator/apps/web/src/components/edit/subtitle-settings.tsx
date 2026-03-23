'use client';

export interface SubtitleSettingsValue {
  fontSize: number;
}

interface SubtitleSettingsProps {
  value: SubtitleSettingsValue;
  onChange: (value: SubtitleSettingsValue) => void;
  previewText?: string;
}

export function SubtitleSettings({ value, onChange, previewText }: SubtitleSettingsProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
      <h3 className="text-sm font-semibold text-zinc-200">자막 설정</h3>

      {/* 폰트 크기 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">폰트 크기</label>
          <span className="text-xs tabular-nums text-zinc-300">{value.fontSize}px</span>
        </div>
        <input
          type="range"
          min={24}
          max={72}
          step={2}
          value={value.fontSize}
          onChange={(e) => onChange({ fontSize: parseInt(e.target.value, 10) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>24px</span>
          <span>48px</span>
          <span>72px</span>
        </div>
      </div>

      {/* 고정 설정 안내 */}
      <div className="flex gap-4 text-xs text-zinc-500">
        <span>색상: 흰색 (고정)</span>
        <span>위치: 하단 중앙 (고정)</span>
      </div>

      {/* 미리보기 */}
      {previewText && (
        <div className="relative overflow-hidden rounded-lg bg-zinc-800 h-20 flex items-end justify-center pb-3">
          <p
            className="font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center px-4 leading-tight"
            style={{ fontSize: `${Math.round(value.fontSize * 0.4)}px` }}
          >
            {previewText}
          </p>
        </div>
      )}
    </div>
  );
}
