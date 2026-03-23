'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { VOICE_CATALOG, EMOTION_PRESETS } from '@/lib/ai/tts';

export interface VoiceSettingsValue {
  language: 'ko' | 'en';
  speed: number;
  voiceId: string;
  emotionId: string;
  pitch: number;
}

interface VoiceSettingsProps {
  value: VoiceSettingsValue;
  onChange: (value: VoiceSettingsValue) => void;
}

export function VoiceSettings({ value, onChange }: VoiceSettingsProps) {
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');

  const filteredVoices = VOICE_CATALOG.filter(v => {
    const langMatch = value.language === 'ko'
      ? v.languageCode.startsWith('ko')
      : v.languageCode.startsWith('en');
    const genderMatch = genderFilter === 'all' || v.gender === genderFilter;
    return langMatch && genderMatch;
  });

  const selectedVoice = VOICE_CATALOG.find(v => v.id === value.voiceId);
  const selectedEmotion = EMOTION_PRESETS.find(e => e.id === value.emotionId);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
      <h3 className="text-sm font-semibold text-zinc-200">음성 설정</h3>

      {/* 언어 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">언어</label>
        <div className="flex gap-2">
          {(['ko', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                const defaultVoice = lang === 'ko' ? 'ko-f-bright' : 'en-f-bright';
                onChange({ ...value, language: lang, voiceId: defaultVoice });
              }}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                value.language === lang
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
              )}
            >
              {lang === 'ko' ? '한국어' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* 성별 필터 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">성별</label>
        <div className="flex gap-1.5">
          {([['all', '전체'], ['female', '여성'], ['male', '남성']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setGenderFilter(id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                genderFilter === id
                  ? 'bg-zinc-700 text-zinc-200'
                  : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 음성 선택 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">음색</label>
        <div className="grid grid-cols-2 gap-2">
          {filteredVoices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => onChange({ ...value, voiceId: voice.id })}
              className={cn(
                'rounded-lg border px-3 py-2.5 text-left transition-colors',
                value.voiceId === voice.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-600'
              )}
            >
              <div className="flex items-center gap-1.5">
                <p className={cn(
                  'text-sm font-medium',
                  value.voiceId === voice.id ? 'text-blue-400' : 'text-zinc-300'
                )}>
                  {voice.name}
                </p>
                {voice.badge && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
                    {voice.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">{voice.tone}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 감정/말투 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400">말투 / 감정</label>
        <div className="flex flex-wrap gap-1.5">
          {EMOTION_PRESETS.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => onChange({ ...value, emotionId: emotion.id })}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                value.emotionId === emotion.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              )}
            >
              {emotion.emoji} {emotion.name}
            </button>
          ))}
        </div>
      </div>

      {/* 속도 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">속도</label>
          <span className="text-xs tabular-nums text-zinc-300">{value.speed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.1}
          value={value.speed}
          onChange={(e) => onChange({ ...value, speed: parseFloat(e.target.value) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>2.0x</span>
        </div>
      </div>

      {/* 피치 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">음높이</label>
          <span className="text-xs tabular-nums text-zinc-300">{value.pitch > 0 ? '+' : ''}{value.pitch}</span>
        </div>
        <input
          type="range"
          min={-10}
          max={10}
          step={1}
          value={value.pitch}
          onChange={(e) => onChange({ ...value, pitch: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>낮게</span>
          <span>기본</span>
          <span>높게</span>
        </div>
      </div>

      {/* 선택 요약 */}
      {selectedVoice && (
        <div className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500">
          {selectedVoice.name} · {selectedEmotion?.name ?? '기본'} · {value.speed.toFixed(1)}x
        </div>
      )}
    </div>
  );
}
