import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const appPassword = process.env.APP_PASSWORD;

    if (!appPassword) {
      return NextResponse.json(
        { error: "서버 설정 오류입니다." },
        { status: 500 }
      );
    }

    if (password === appPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { error: "인증 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
