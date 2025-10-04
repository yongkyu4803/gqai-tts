"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mic } from "lucide-react";
import type { TTSModel, TTSVoice, AudioFormat } from "@/types/tts";

interface TTSFormProps {
  onSubmit: (data: {
    text: string;
    model: TTSModel;
    voice: TTSVoice;
    format: AudioFormat;
    speed: number;
  }) => void;
  isLoading: boolean;
}

interface VoiceOption {
  value: TTSVoice;
  label: string;
  description: string;
}

export function TTSForm({ onSubmit, isLoading }: TTSFormProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState<TTSModel>("tts-1");
  const [voice, setVoice] = useState<TTSVoice>("alloy");
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    fetch("/api/voices")
      .then((res) => res.json())
      .then((data) => setVoices(data.voices))
      .catch((error) => console.error("Failed to load voices:", error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text, model, voice, format, speed });
    }
  };

  const charCount = text.length;
  const isOverLimit = charCount > 4096;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="text">텍스트 입력</Label>
            <span
              className={`text-sm ${
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {charCount} / 4096
            </span>
          </div>
          <Textarea
            id="text"
            placeholder="여기에 한국어 텍스트를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">모델</Label>
            <Select
              value={model}
              onValueChange={(value) => setModel(value as TTSModel)}
              disabled={isLoading}
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tts-1">TTS-1 (저지연)</SelectItem>
                <SelectItem value="tts-1-hd">TTS-1 HD (고품질)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">보이스</Label>
            <Select
              value={voice}
              onValueChange={(value) => setVoice(value as TTSVoice)}
              disabled={isLoading}
            >
              <SelectTrigger id="voice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label} - {v.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">포맷</Label>
            <Select
              value={format}
              onValueChange={(value) => setFormat(value as AudioFormat)}
              disabled={isLoading}
            >
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="opus">Opus</SelectItem>
                <SelectItem value="aac">AAC</SelectItem>
                <SelectItem value="flac">FLAC</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
                <SelectItem value="pcm">PCM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed">속도</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSpeed(0.75)}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                느리게
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSpeed(1.0)}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                보통
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSpeed(1.5)}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                빠르게
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-right">
                {speed.toFixed(2)}x
              </span>
            </div>
          </div>
          <Slider
            id="speed"
            min={0.25}
            max={4.0}
            step={0.25}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !text.trim() || isOverLimit}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              음성 생성
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
