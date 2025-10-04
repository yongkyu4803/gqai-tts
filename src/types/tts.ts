export type TTSModel = "tts-1" | "tts-1-hd";

export type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export type AudioFormat = "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm";

export interface TTSRequest {
  text: string;
  model: TTSModel;
  voice: TTSVoice;
  format?: AudioFormat;
  speed?: number; // 0.25 to 4.0, default 1.0
}

export interface TTSHistoryItem {
  id: string;
  text: string;
  model: TTSModel;
  voice: TTSVoice;
  format: AudioFormat;
  speed: number;
  createdAt: string;
  audioUrl?: string;
}

export interface TTSError {
  message: string;
  code?: string;
  status?: number;
}
