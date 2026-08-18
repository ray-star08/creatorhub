import type { Metadata } from "next";
import { ScriptGenerator } from "./script-generator";

export const metadata: Metadata = {
  title: "Script Generator",
};

export default async function ScriptsGeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ ideaId?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.ideaId;
  const initialIdeaId =
    typeof raw === "string" ? raw : Array.isArray(raw) ? (raw[0] ?? "") : "";

  return <ScriptGenerator initialIdeaId={initialIdeaId} />;
}
