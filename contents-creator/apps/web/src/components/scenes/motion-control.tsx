'use client';

import { MoveRight, ZoomIn, ZoomOut, Activity, Shuffle } from 'lucide-react';

export interface MotionParams {
  camera_pan: 'none' | 'slow' | 'medium' | 'fast';
  camera_zoom: 'none' | 'slow_in' | 'slow_out' | 'fast_in' | 'fast_out';
  motion_bucket: 'low' | 'medium' | 'high';
}

interface MotionControlProps {
  motionParams: MotionParams;
  transition: string;
  onChange: (params: MotionParams) => void;
  onTransitionChange: (transition: string) => void;
}

const PAN_OPTIONS: { value: MotionParams['camera_pan']; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'slow', label: '느리게' },
  { value: 'medium', label: '보통' },
  { value: 'fast', label: '빠르게' },
];

const ZOOM_OPTIONS: { value: MotionParams['camera_zoom']; label: string; icon: 'in' | 'out' | null }[] = [
  { value: 'none', label: '없음', icon: null },
  { value: 'slow_in', label: '천천히 줌인', icon: 'in' },
  { value: 'slow_out', label: '천천히 줌아웃', icon: 'out' },
  { value: 'fast_in', label: '빠른 줌인', icon: 'in' },
  { value: 'fast_out', label: '빠른 줌아웃', icon: 'out' },
];

const MOTION_BUCKET_OPTIONS: { value: MotionParams['motion_bucket']; label: string }[] = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
];

const TRANSITION_OPTIONS = [
  { value: 'cut', label: '컷' },
  { value: 'crossfade', label: '크로스페이드' },
  { value: 'zoom_in', label: '줌인' },
  { value: 'zoom_out', label: '줌아웃' },
  { value: 'slide_left', label: '슬라이드 좌' },
  { value: 'slide_right', label: '슬라이드 우' },
];

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-zinc-500">{icon}</span>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            value === opt.value
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function MotionControl({
  motionParams,
  transition,
  onChange,
  onTransitionChange,
}: MotionControlProps) {
  const motionBucketIndex = MOTION_BUCKET_OPTIONS.findIndex(
    (o) => o.value === motionParams.motion_bucket
  );

  function handleMotionBucketSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const idx = Number(e.target.value);
    const opt = MOTION_BUCKET_OPTIONS[idx];
    if (opt) onChange({ ...motionParams, motion_bucket: opt.value });
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-5">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Motion Control</p>

      {/* Camera Pan */}
      <div>
        <SectionLabel
          icon={<MoveRight className="h-3.5 w-3.5" />}
          label="Camera Pan"
        />
        <RadioGroup
          options={PAN_OPTIONS}
          value={motionParams.camera_pan}
          onChange={(v) => onChange({ ...motionParams, camera_pan: v })}
        />
      </div>

      {/* Camera Zoom */}
      <div>
        <SectionLabel
          icon={<ZoomIn className="h-3.5 w-3.5" />}
          label="Camera Zoom"
        />
        <div className="flex flex-wrap gap-1.5">
          {ZOOM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...motionParams, camera_zoom: opt.value })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                motionParams.camera_zoom === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
            >
              {opt.icon === 'in' && <ZoomIn className="h-3 w-3" />}
              {opt.icon === 'out' && <ZoomOut className="h-3 w-3" />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motion Bucket */}
      <div>
        <SectionLabel
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Motion Bucket"
        />
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={motionBucketIndex}
            onChange={handleMotionBucketSlider}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            {MOTION_BUCKET_OPTIONS.map((opt) => (
              <span
                key={opt.value}
                className={motionParams.motion_bucket === opt.value ? 'text-blue-400' : ''}
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Transition */}
      <div>
        <SectionLabel
          icon={<Shuffle className="h-3.5 w-3.5" />}
          label="Transition"
        />
        <select
          value={transition}
          onChange={(e) => onTransitionChange(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {TRANSITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
