import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { TTSRequest } from "@/types/tts";

// Use Node.js runtime for environment variables
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { text, model, voice, format = "mp3", speed = 1.0 } = body;

    // Validation
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: "텍스트는 최대 4096자까지 입력 가능합니다." },
        { status: 400 }
      );
    }

    if (speed < 0.25 || speed > 4.0) {
      return NextResponse.json(
        { error: "속도는 0.25에서 4.0 사이여야 합니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("Environment variable OPENAI_API_KEY is not set");
      console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('OPENAI')));
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다. Vercel 환경변수를 확인해주세요." },
        { status: 500 }
      );
    }

    // Log API key prefix for debugging (안전하게 앞 7자만)
    console.log("API Key prefix:", apiKey.substring(0, 7) + "...");

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Call OpenAI TTS API
    const mp3 = await openai.audio.speech.create({
      model,
      voice,
      input: text,
      response_format: format,
      speed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Return audio stream
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": `audio/${format}`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("TTS API Error:", error);

    // Handle OpenAI API errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "OpenAI API 키가 유효하지 않습니다." },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    if (error?.status >= 500) {
      return NextResponse.json(
        { error: "OpenAI 서비스에 일시적인 문제가 발생했습니다." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "음성 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
