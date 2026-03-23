export interface Cue {
  ms: number;
  target: string;
  action: 'fadeIn' | 'slideUp' | 'typeIn' | 'clickSim' | 'staggerReveal';
}

export interface SlideTiming {
  startMs: number;
  endMs: number;
  cues: Cue[];
}

export interface SlideData {
  id: number;
  layout: string;
  content: Record<string, any>;
  timing: SlideTiming;
}

export interface SubtitleWord {
  text: string;
  startMs: number;
  endMs: number;
}

export interface SubtitleSentence {
  text: string;
  startMs: number;
  endMs: number;
}

export interface SlidesJson {
  meta: {
    title: string;
    theme?: string;
    font?: string;
    totalSlides?: number;
    narrationFile?: string;
  };
  slides: SlideData[];
  subtitles?: {
    words: SubtitleWord[];
    sentences: SubtitleSentence[];
  };
}
