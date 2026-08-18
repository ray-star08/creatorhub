"use client";

import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import api, { getApiErrorMessage } from "@/lib/axios";
import { unwrapList } from "@/lib/format";
import { KANBAN_COLUMNS } from "@/lib/constants";
import type { Task, TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { TaskCard } from "@/components/kanban/task-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Columns = Record<TaskStatus, Task[]>;

function emptyColumns(): Columns {
  return {
    idea: [],
    draft: [],
    editing: [],
    ready: [],
    published: [],
  };
}

function groupByStatus(tasks: Task[]): Columns {
  const columns = emptyColumns();
  for (const task of tasks) {
    (columns[task.status] ?? columns.idea).push(task);
  }
  return columns;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  editing: "Editing",
  ready: "Ready",
  published: "Published",
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Columns>(emptyColumns);
  const [loading, setLoading] = useState(true);
  // Which mobile accordion columns are expanded. `null` = user hasn't toggled
  // yet, so we fall back to "columns that have tasks".
  const [userOpen, setUserOpen] = useState<Set<TaskStatus> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get<Task[] | { data: Task[] }>("/tasks");
        if (active) setColumns(groupByStatus(unwrapList(data)));
      } catch {
        // Backend offline — start from an empty board.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const openColumns =
    loading
      ? null
      : (userOpen ??
        new Set(
          KANBAN_COLUMNS.filter((c) => columns[c.id].length > 0).map(
            (c) => c.id,
          ),
        ));

  function toggleColumn(id: TaskStatus) {
    setUserOpen((prev) => {
      const next = new Set(prev ?? openColumns ?? []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Persist a status change (used by both drag-and-drop and the mobile menu). */
  function persistMove(task: Task, to: TaskStatus, snapshot: Columns) {
    api
      .put(`/tasks/${task.id}/status`, { status: to })
      .then(() => toast.success(`Moved “${task.title}” to ${STATUS_LABELS[to]}`))
      .catch((error) => {
        setColumns(snapshot);
        toast.error(getApiErrorMessage(error, "Couldn't move the task."));
      });
  }

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;

    const from = source.droppableId as TaskStatus;
    const to = destination.droppableId as TaskStatus;
    if (from === to && source.index === destination.index) return;

    const fromItems = Array.from(columns[from]);
    const [moved] = fromItems.splice(source.index, 1);
    if (!moved) return;

    const next: Columns = { ...columns, [from]: fromItems };
    const toItems = from === to ? fromItems : Array.from(columns[to]);
    toItems.splice(destination.index, 0, { ...moved, status: to });
    next[to] = toItems;

    const snapshot = columns;
    setColumns(next);

    if (from === to) return;
    persistMove(moved, to, snapshot);
  }

  /** Fallback move triggered by the card's "Move to…" menu on touch devices. */
  function moveTask(task: Task, to: TaskStatus) {
    const from = task.status;
    if (from === to) return;

    const snapshot = columns;
    setColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((item) => item.id !== task.id),
      [to]: [...prev[to], { ...task, status: to }],
    }));
    // Make sure the destination column is visible after a mobile move.
    setUserOpen((prev) => new Set(prev ?? openColumns ?? []).add(to));
    persistMove(task, to, snapshot);
  }

  function addTask(task: Task) {
    setColumns((prev) => ({
      ...prev,
      [task.status]: [...prev[task.status], task],
    }));
  }

  const total = Object.values(columns).reduce(
    (sum, items) => sum + items.length,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kanban"
        description="Drag content across stages — from raw idea to published."
      >
        <NewTaskDialog onCreated={addTask} />
      </PageHeader>

      {loading ? (
        <BoardSkeleton />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {/*
            ONE tree for every breakpoint (CSS switches mobile accordion /
            desktop grid). Swapping trees unmounts Droppables mid-drag and
            crashes @hello-pangea/dnd, so never conditionally mount columns.
          */}
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4 xl:grid-cols-5">
            {KANBAN_COLUMNS.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                items={columns[column.id]}
                open={openColumns?.has(column.id) ?? false}
                onToggle={() => toggleColumn(column.id)}
                onMove={moveTask}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {!loading && total === 0 ? (
        <p className="text-muted-foreground text-center text-sm">
          No tasks yet. Add one to start planning your content pipeline.
        </p>
      ) : null}
    </div>
  );
}

function BoardColumn({
  column,
  items,
  open,
  onToggle,
  onMove,
}: {
  column: (typeof KANBAN_COLUMNS)[number];
  items: Task[];
  open: boolean;
  onToggle: () => void;
  onMove: (task: Task, to: TaskStatus) => void;
}) {
  const header = (
    <>
      <span className={cn("size-2 rounded-full", column.accent)} />
      <h3 className="text-sm font-semibold">{column.title}</h3>
      <Badge variant="secondary" className="ml-auto tabular-nums">
        {items.length}
      </Badge>
    </>
  );

  return (
    <div className="bg-muted/40 flex flex-col rounded-xl border">
      {/* Toggle exists only on mobile; desktop shows a static header. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-3 text-left md:hidden"
      >
        {header}
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <div className="hidden items-center gap-2 px-3 py-3 md:flex">
        {header}
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-1 flex-col gap-2 px-3 pb-3 transition-colors",
              snapshot.isDraggingOver && "bg-primary/5",
              // Collapse on mobile without unmounting the Droppable.
              !open && "max-md:hidden",
            )}
          >
            {items.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                  >
                    <TaskCard
                      task={task}
                      isDragging={dragSnapshot.isDragging}
                      dragHandleProps={dragProvided.dragHandleProps}
                      onMove={(to) => onMove(task, to)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {items.length === 0 && !snapshot.isDraggingOver ? (
              <p className="text-muted-foreground/70 rounded-lg border border-dashed py-6 text-center text-xs">
                Drop tasks here
              </p>
            ) : null}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function NewTaskDialog({ onCreated }: { onCreated: (task: Task) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("idea");
  const [submitting, setSubmitting] = useState(false);
  const tempId = useRef(-1);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const { data } = await api.post<Task | { data: Task }>("/tasks", {
        title: trimmed,
        status,
      });
      const created =
        data && typeof data === "object" && "data" in data ? data.data : data;
      onCreated(
        created ?? {
          id: tempId.current--,
          user_id: 0,
          title: trimmed,
          status,
        },
      );
      toast.success("Task added.");
      setTitle("");
      setStatus("idea");
      setOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't create the task."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>
              Add a card to your content pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Film the studio tour B-roll"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-status">Stage</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger id="task-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KANBAN_COLUMNS.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {submitting ? <Loader2 className="animate-spin" /> : <Plus />}
              Add task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4 xl:grid-cols-5">
      {KANBAN_COLUMNS.map((column) => (
        <div
          key={column.id}
          className="bg-muted/40 space-y-2 rounded-xl border p-3"
        >
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
