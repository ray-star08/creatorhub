import { NextRequest, NextResponse } from "next/server";
import { tabiGenerate, mockAnalysis } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const script = body.script as string;

    if (!script || typeof script !== "string" || script.length > 5000) {
      return NextResponse.json({ error: "Script is required (max 5000 chars)" }, { status: 400 });
    }

    const prompt = `You are a data-driven Content Analyst. Respond ONLY in Bahasa Indonesia.
Tugas: Analisa script video berikut dan beri penilaian objektif berdasarkan metrik retention dan engagement.

Script:
${script}

Output Format (Wajib Bahasa Indonesia):
- Viral Probability: XX%
- Retention Score: Low/Medium/High
- Hook Strength: Weak/Good/Strong
- Content Gap Score: XX/100`;

    let result: string;
    try {
      result = await tabiGenerate(prompt, 300);
    } catch {
      result = mockAnalysis();
    }

    return NextResponse.json({ analysis: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}