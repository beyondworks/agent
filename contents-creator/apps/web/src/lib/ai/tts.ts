// TTS 클라이언트 — Google Cloud Text-to-Speech (Chirp3-HD + Neural2)

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface TTSResult {
  audioBuffer: Buffer;
  wordTimestamps: WordTimestamp[];
  durationSec: number;
}

// --- 음성 카탈로그 ---

export type VoiceBackend = 'google' | 'local';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male';
  tone: string;
  backend: VoiceBackend;
  googleName?: string;
  languageCode: string;
  localVoiceId?: string;
  badge?: string;
  instruction?: string;
}

const TTS_LOCAL_URL = process.env.TTS_SERVER_URL ?? 'http://127.0.0.1:8000';

export const VOICE_CATALOG: VoiceOption[] = [
  // 커스텀 (클론)
  { id: 'ko-custom-hyoyul', name: '김효율', gender: 'male', tone: '에너지 넘치는 기획자', backend: 'local', languageCode: 'ko-KR', localVoiceId: 'bfdb8b63-3203-43f5-a16c-f6c9011d4556', badge: '클론', instruction: 'An energetic and enthusiastic Korean male speaker in his 30s. Speak with high energy, confident tone, and dynamic rhythm like a passionate tech YouTuber presenting exciting content.' },
  // 한국어 여성
  { id: 'ko-f-bright', name: '하늘', gender: 'female', tone: '밝고 에너지 넘치는', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Aoede', languageCode: 'ko-KR' },
  { id: 'ko-f-calm', name: '서연', gender: 'female', tone: '차분하고 신뢰감 있는', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Kore', languageCode: 'ko-KR' },
  { id: 'ko-f-warm', name: '유진', gender: 'female', tone: '따뜻하고 친근한', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Leda', languageCode: 'ko-KR' },
  { id: 'ko-f-pro', name: '민서', gender: 'female', tone: '또렷하고 전문적인', backend: 'google', googleName: 'ko-KR-Neural2-A', languageCode: 'ko-KR' },
  // 한국어 남성
  { id: 'ko-m-deep', name: '준혁', gender: 'male', tone: '깊고 안정적인', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Charon', languageCode: 'ko-KR' },
  { id: 'ko-m-bright', name: '시우', gender: 'male', tone: '활기차고 젊은', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Puck', languageCode: 'ko-KR' },
  { id: 'ko-m-narrator', name: '도윤', gender: 'male', tone: '내레이션에 적합한', backend: 'google', googleName: 'ko-KR-Chirp3-HD-Fenrir', languageCode: 'ko-KR' },
  { id: 'ko-m-pro', name: '현우', gender: 'male', tone: '명확하고 전문적인', backend: 'google', googleName: 'ko-KR-Neural2-C', languageCode: 'ko-KR' },
  // 영어 여성
  { id: 'en-f-bright', name: 'Aria', gender: 'female', tone: 'Bright and energetic', backend: 'google', googleName: 'en-US-Chirp3-HD-Aoede', languageCode: 'en-US' },
  { id: 'en-f-calm', name: 'Luna', gender: 'female', tone: 'Calm and professional', backend: 'google', googleName: 'en-US-Neural2-F', languageCode: 'en-US' },
  // 영어 남성
  { id: 'en-m-deep', name: 'James', gender: 'male', tone: 'Deep and authoritative', backend: 'google', googleName: 'en-US-Chirp3-HD-Charon', languageCode: 'en-US' },
  { id: 'en-m-casual', name: 'Ryan', gender: 'male', tone: 'Casual and friendly', backend: 'google', googleName: 'en-US-Neural2-D', languageCode: 'en-US' },
];

// --- 감정 프리셋 ---

export interface EmotionPreset {
  id: string;
  name: string;
  emoji: string;
  pitch: number;   // -20 ~ +20 semitones
  rate: number;     // 0.5 ~ 2.0
  volumeGainDb: number; // -10 ~ +10
}

export const EMOTION_PRESETS: EmotionPreset[] = [
  { id: 'neutral', name: '기본', emoji: '😐', pitch: 0, rate: 1.0, volumeGainDb: 0 },
  { id: 'cheerful', name: '밝은', emoji: '😊', pitch: 3, rate: 1.1, volumeGainDb: 1 },
  { id: 'excited', name: '열정적', emoji: '🔥', pitch: 5, rate: 1.2, volumeGainDb: 2 },
  { id: 'calm', name: '차분한', emoji: '🧘', pitch: -2, rate: 0.9, volumeGainDb: -1 },
  { id: 'serious', name: '진지한', emoji: '🎯', pitch: -3, rate: 0.95, volumeGainDb: 0 },
  { id: 'warm', name: '따뜻한', emoji: '☀️', pitch: 1, rate: 0.95, volumeGainDb: 0 },
  { id: 'urgent', name: '긴급한', emoji: '⚡', pitch: 2, rate: 1.3, volumeGainDb: 3 },
  { id: 'whisper', name: '속삭이는', emoji: '🤫', pitch: 1, rate: 0.85, volumeGainDb: -4 },
];

// --- 하위 호환 ---

export const VOICES = Object.fromEntries(
  VOICE_CATALOG.map(v => [v.id, v])
) as Record<string, VoiceOption>;

export type VoiceId = string;

// --- SSML 변환 (한국어 자연스러운 읽기) ---

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function textToSSML(text: string, opts: { rate: number; pitch: number; volume: number }): string {
  // 1. 다중 공백/줄바꿈 정리
  let cleaned = text.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();

  // 2. 문장 단위로 분리하여 자연스러운 호흡 추가
  // 마침표/물음표/느낌표 뒤에 짧은 break
  cleaned = escapeXml(cleaned);
  cleaned = cleaned
    .replace(/([.!?])\s+/g, '$1<break time="300ms"/> ')
    .replace(/([,;])\s+/g, '$1<break time="150ms"/> ')
    // 한국어 조사/어미 뒤 쉼표 없는 경우에도 자연스러운 흐름 유지
    .replace(/\s*…\s*/g, '<break time="500ms"/>')
    .replace(/\s*—\s*/g, '<break time="200ms"/>');

  const ratePercent = `${Math.round(opts.rate * 100)}%`;
  const pitchSt = opts.pitch >= 0 ? `+${opts.pitch}st` : `${opts.pitch}st`;
  const volumeDb = opts.volume >= 0 ? `+${opts.volume}dB` : `${opts.volume}dB`;

  return `<speak><prosody rate="${ratePercent}" pitch="${pitchSt}" volume="${volumeDb}">${cleaned}</prosody></speak>`;
}

// --- 로컬 TTStudio 합성 (Qwen3 클론 보이스) ---

async function synthesizeLocal(text: string, voice: VoiceOption, speed: number): Promise<TTSResult> {
  const res = await fetch(`${TTS_LOCAL_URL}/api/tts/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice_id: voice.localVoiceId,
      language: voice.languageCode.split('-')[0],
      temperature: 0.5,
      top_p: 0.85,
      instruction: voice.instruction,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 0 || body.includes('ECONNREFUSED')) {
      throw new Error('로컬 TTS 서버가 실행 중이 아닙니다. TTStudio를 시작해주세요.');
    }
    throw new Error(`로컬 TTS 실패 (${res.status}): ${body}`);
  }

  const audioBuffer = Buffer.from(await res.arrayBuffer());
  const durationHeader = res.headers.get('X-Audio-Duration');
  const durationSec = durationHeader ? parseFloat(durationHeader) : audioBuffer.length / (2 * 24000);

  return { audioBuffer, wordTimestamps: [], durationSec };
}

// --- 합성 ---

export interface SynthesizeOptions {
  voiceId?: string;
  speed?: number;
  pitch?: number;
  volumeGainDb?: number;
  emotionId?: string;
}

export async function synthesizeWithVoiceId(
  text: string,
  voiceId: string = 'ko-f-bright',
  speed: number = 1.0,
  options?: { pitch?: number; volumeGainDb?: number; emotionId?: string }
): Promise<TTSResult> {
  const voice = VOICE_CATALOG.find(v => v.id === voiceId) ?? VOICE_CATALOG[0];

  // 로컬 TTStudio 보이스 (클론 등)
  if (voice.backend === 'local') {
    return synthesizeLocal(text, voice, speed);
  }

  // Google Cloud TTS
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY가 필요합니다.');

  // 감정 프리셋 적용
  const emotion = options?.emotionId
    ? EMOTION_PRESETS.find(e => e.id === options.emotionId) ?? EMOTION_PRESETS[0]
    : EMOTION_PRESETS[0];

  const finalPitch = (options?.pitch ?? 0) + emotion.pitch;
  const finalRate = speed * emotion.rate;
  const finalVolume = (options?.volumeGainDb ?? 0) + emotion.volumeGainDb;

  const ssml = textToSSML(text, {
    rate: finalRate,
    pitch: finalPitch,
    volume: finalVolume,
  });

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { ssml },
        voice: { languageCode: voice.languageCode, name: voice.googleName },
        audioConfig: {
          audioEncoding: 'MP3',
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google TTS 실패 (${res.status}): ${body}`);
  }

  const data = await res.json();
  const audioBuffer = Buffer.from(data.audioContent, 'base64');
  const durationSec = audioBuffer.length / 16000;

  return { audioBuffer, wordTimestamps: [], durationSec };
}

export async function synthesize(
  text: string,
  language: string,
  speed: number,
  voiceId?: string
): Promise<TTSResult> {
  const vid = voiceId ?? (language === 'en' ? 'en-f-calm' : 'ko-f-bright');
  return synthesizeWithVoiceId(text, vid, speed);
}
