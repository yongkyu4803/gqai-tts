"use client";

import { useState, useCallback } from "react";
import type { TTSRequest, TTSHistoryItem, TTSError } from "@/types/tts";

interface UseTTSReturn {
  isLoading: boolean;
  error: TTSError | null;
  audioUrl: string | null;
  generateSpeech: (request: TTSRequest) => Promise<void>;
  clearError: () => void;
  clearAudio: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useTTS(): UseTTSReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TTSError | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
  }, [audioUrl]);

  const generateSpeech = useCallback(
    async (request: TTSRequest) => {
      setIsLoading(true);
      setError(null);
      clearAudio();

      let lastError: TTSError | null = null;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const response = await fetch("/api/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw {
              message: errorData.error || "음성 생성에 실패했습니다.",
              status: response.status,
            };
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);

          // Save to history
          const historyItem: TTSHistoryItem = {
            id: Date.now().toString(),
            text: request.text.substring(0, 100),
            model: request.model,
            voice: request.voice,
            format: request.format || "mp3",
            speed: request.speed || 1.0,
            createdAt: new Date().toISOString(),
            audioUrl: url,
          };

          const history = JSON.parse(
            localStorage.getItem("tts-history") || "[]"
          );
          const newHistory = [historyItem, ...history].slice(0, 5);
          localStorage.setItem("tts-history", JSON.stringify(newHistory));

          setIsLoading(false);
          return;
        } catch (err: any) {
          lastError = err;

          // Don't retry on client errors (400-499) except 429
          if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
            break;
          }

          // Wait before retry
          if (attempt < MAX_RETRIES - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
            );
          }
        }
      }

      setError(lastError || { message: "음성 생성에 실패했습니다." });
      setIsLoading(false);
    },
    [clearAudio]
  );

  return {
    isLoading,
    error,
    audioUrl,
    generateSpeech,
    clearError,
    clearAudio,
  };
}
