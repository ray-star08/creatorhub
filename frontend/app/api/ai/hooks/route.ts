import { NextRequest, NextResponse } from "next/server";
import { tabiGenerate, tabiToList, mockHooksList } from "@/lib/api/ai";

export async function POST() {
  try {
    const prompt = `You are a data-driven Trend Analyst & Content Strategist. Respond ONLY in Bahasa Indonesia.
Tugas: Buatkan 6 hook pembuka video yang sangat viral.

Kriteria:
- Bahasa Indonesia yang profesional dan impactful.
- Gaya: data-backed, thought-provoking, atau contrarian insight yang bikin penasaran.
- Fokus pada: retention psychology, content strategy, audience insight, dan platform algorithm.
- Angka dan data spesifik sangat dianjurkan (contoh: "80% kreator...", "3 metrik yang...", "Data dari 100 video...").
- HANYA LIST HOOK SAJA.`;

    let list: string[];
    try {
      const result = await tabiGenerate(prompt, 300);
      list = tabiToList(result, 6);
    } catch {
      list = mockHooksList();
    }

    return NextResponse.json({ hooks: list });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}