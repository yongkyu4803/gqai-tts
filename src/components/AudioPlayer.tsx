"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  filename?: string;
}

export function AudioPlayer({ audioUrl, filename = "speech.mp3" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Auto-play when audio URL changes
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Auto-play prevented:", error);
      });
    }
  }, [audioUrl]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">생성된 음성</h3>
        </div>

        <audio
          ref={audioRef}
          controls
          className="w-full"
          src={audioUrl}
        >
          Your browser does not support the audio element.
        </audio>

        <Button onClick={handleDownload} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          다운로드
        </Button>
      </div>
    </Card>
  );
}
