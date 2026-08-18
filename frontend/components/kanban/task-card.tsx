import { GripVertical, MoveRight } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

import { KANBAN_COLUMNS } from "@/lib/constants";
import type { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TaskCard({
  task,
  isDragging,
  dragHandleProps,
  onMove,
}: {
  task: Task;
  isDragging?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  /** Fallback for touch devices where drag-and-drop is fiddly. */
  onMove?: (to: TaskStatus) => void;
}) {
  return (
    <div
      className={cn(
        // touch-manipulation keeps taps snappy and lets the card body pan the
        // page vertically; only the grip claims the drag gesture.
        "group bg-card flex touch-manipulation items-start gap-2 rounded-lg border p-3 shadow-sm transition-shadow",
        isDragging ? "border-primary/50 shadow-md" : "hover:border-border",
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        {...dragHandleProps}
        // touch-none stops the browser from scrolling while dragging the handle.
        className="text-muted-foreground/50 hover:text-muted-foreground mt-0.5 -ml-1 flex size-6 shrink-0 touch-none items-center justify-center rounded-md active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      <p className="flex-1 pt-0.5 text-sm leading-snug font-medium">
        {task.title}
      </p>

      {onMove ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Move task"
              className="size-7 shrink-0"
            >
              <MoveRight className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Move to…</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {KANBAN_COLUMNS.filter((column) => column.id !== task.status).map(
              (column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={() => onMove(column.id)}
                >
                  <span className={cn("size-2 rounded-full", column.accent)} />
                  {column.title}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
