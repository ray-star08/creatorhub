import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    data: {
      base_url: "https://ai.autoapp.biz.id/v1",
      primary: "gpt-5.6",
      backups: ["glm-5.3", "gpt-5.6-luna", "deepseek-v4-flash", "deepseek-v4-flash-0731"],
      all: ["gpt-5.6", "glm-5.3", "gpt-5.6-luna", "deepseek-v4-flash", "deepseek-v4-flash-0731"],
    },
  });
}