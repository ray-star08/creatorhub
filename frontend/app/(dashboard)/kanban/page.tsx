import type { Metadata } from "next";
import { KanbanBoard } from "./kanban-board";

export const metadata: Metadata = {
  title: "Kanban",
};

export default function KanbanPage() {
  return <KanbanBoard />;
}
