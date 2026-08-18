import { NextRequest, NextResponse } from "next/server";
import { tabiTryModel } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const model = body.model as string;

    if (!model || typeof model !== "string") {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const start = Date.now();

    try {
      const result = await tabiTryModel(
        model,
        "You are a helpful assistant. Reply with valid JSON only.",
        'Reply with {"status":"ok"}',
      );
      const latency_ms = Date.now() - start;

      return NextResponse.json({
        data: { model, status: "ok", latency_ms, response: result },
      });
    } catch (e: unknown) {
      return NextResponse.json(
        {
          data: { model, status: "error", error: (e as Error).message },
        },
        { status: 502 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}