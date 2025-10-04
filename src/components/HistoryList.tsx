"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Mic2 } from "lucide-react";
import type { TTSHistoryItem } from "@/types/tts";

export function HistoryList() {
  const [history, setHistory] = useState<TTSHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem("tts-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    };

    loadHistory();

    // Listen for storage changes
    window.addEventListener("storage", loadHistory);

    // Refresh every second to catch updates
    const interval = setInterval(loadHistory, 1000);

    return () => {
      window.removeEventListener("storage", loadHistory);
      clearInterval(interval);
    };
  }, []);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        최근 생성 이력
      </h2>

      <div className="grid gap-4">
        {history.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm line-clamp-2 flex-1">
                  {item.text}
                  {item.text.length >= 100 && "..."}
                </p>
                <Mic2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.model}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.voice}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.format.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.speed}x 속도
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
