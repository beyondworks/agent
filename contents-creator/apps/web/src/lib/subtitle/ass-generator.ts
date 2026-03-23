// ASS 자막 파일 생성기 — 유튜브 스타일

import type { SubtitleEvent } from './word-grouper';

export interface ASSStyleSettings {
  fontName?: string;
  fontSize?: number;
  primaryColor?: string;   // ASS 색상: &HAABBGGRR (예: &H00FFFFFF = 흰색)
  outlineColor?: string;   // 외곽선 색상
  outlineWidth?: number;
  alignment?: number;      // 2=하단중앙, 5=중앙중앙, 8=상단중앙
}

const DEFAULT_STYLE: Required<ASSStyleSettings> = {
  fontName: 'Arial',
  fontSize: 48,
  primaryColor: '&H00FFFFFF',  // 흰색
  outlineColor: '&H00000000',  // 검정
  outlineWidth: 3,
  alignment: 2,                 // 하단 중앙
};

/**
 * 초(float)를 ASS 시간 포맷 H:MM:SS.cs 으로 변환합니다.
 */
function toASSTime(seconds: number): string {
  const totalCentiseconds = Math.round(seconds * 100);
  const cs = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

/**
 * SubtitleEvent 목록을 ASS 포맷 문자열로 변환합니다.
 */
export function generateASS(events: SubtitleEvent[], styleSettings: ASSStyleSettings = {}): string {
  const style = { ...DEFAULT_STYLE, ...styleSettings };

  const scriptInfo = [
    '[Script Info]',
    'Title: VideoForge Subtitles',
    'ScriptType: v4.00+',
    'Collisions: Normal',
    'PlayDepth: 0',
    '',
  ].join('\n');

  // Styles 섹션
  // Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour,
  //         Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle,
  //         Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
  const stylesSection = [
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    `Style: Default,${style.fontName},${style.fontSize},${style.primaryColor},&H000000FF,${style.outlineColor},&H80000000,-1,0,0,0,100,100,0,0,1,${style.outlineWidth},0,${style.alignment},10,10,30,1`,
    '',
  ].join('\n');

  // Events 섹션
  // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
  const eventLines = events.map((ev) => {
    const start = toASSTime(ev.start);
    const end = toASSTime(ev.end);
    const text = ev.text.replace(/\n/g, '\\N');
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
  });

  const eventsSection = [
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ...eventLines,
    '',
  ].join('\n');

  return [scriptInfo, stylesSection, eventsSection].join('\n');
}
