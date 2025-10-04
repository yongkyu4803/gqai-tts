import { NextResponse } from "next/server";
import type { TTSVoice } from "@/types/tts";

export const runtime = "edge";

interface VoiceOption {
  value: TTSVoice;
  label: string;
  description: string;
}

const voices: VoiceOption[] = [
  {
    value: "alloy",
    label: "Alloy",
    description: "중성적이고 균형잡힌 목소리",
  },
  {
    value: "echo",
    label: "Echo",
    description: "남성적이고 차분한 목소리",
  },
  {
    value: "fable",
    label: "Fable",
    description: "영국식 억양의 남성 목소리",
  },
  {
    value: "onyx",
    label: "Onyx",
    description: "깊고 권위있는 남성 목소리",
  },
  {
    value: "nova",
    label: "Nova",
    description: "활기차고 젊은 여성 목소리",
  },
  {
    value: "shimmer",
    label: "Shimmer",
    description: "부드럽고 따뜻한 여성 목소리",
  },
];

export async function GET() {
  return NextResponse.json({ voices });
}
