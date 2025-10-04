"use client";

import { TTSForm } from "@/components/TTSForm";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HistoryList } from "@/components/HistoryList";
import { useTTS } from "@/lib/hooks/useTTS";
import { toast } from "sonner";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { isLoading, error, audioUrl, generateSpeech, clearError } = useTTS();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-neutral-900 dark:via-orange-950/30 dark:to-amber-950/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-orange-500 dark:text-orange-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400">
                한국어 TTS
              </h1>
            </div>
            <p className="text-amber-800 dark:text-amber-300 text-lg">
              텍스트를 자연스러운 한국어 음성으로 변환하세요
            </p>
          </div>

          {/* TTS Form */}
          <TTSForm onSubmit={generateSpeech} isLoading={isLoading} />

          {/* Audio Player */}
          {audioUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AudioPlayer audioUrl={audioUrl} />
            </div>
          )}

          {/* History */}
          <HistoryList />
        </div>
      </div>
    </div>
  );
}
