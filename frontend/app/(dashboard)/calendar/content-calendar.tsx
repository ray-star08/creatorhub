"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type SlotInfo,
  Views,
} from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import api, { getApiErrorMessage } from "@/lib/axios";
import { unwrapList } from "@/lib/format";
import type { Schedule } from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
} from "@/components/ui/dialog";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

/** Parse a `YYYY-MM-DD` string as a local date (avoids UTC off-by-one). */
function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (year && month && day) return new Date(year, month - 1, day);
  return new Date(value);
}

function toDateInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toEvent(schedule: Schedule): CalendarEvent {
  const day = parseDateOnly(schedule.publish_date);
  return {
    id: schedule.id,
    title: schedule.title,
    start: day,
    end: day,
    allDay: true,
  };
}

export function ContentCalendar() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [presetDate, setPresetDate] = useState("");
  const [defaultDate] = useState(() => new Date());

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } =
          await api.get<Schedule[] | { data: Schedule[] }>("/schedules");
        if (active) setSchedules(unwrapList(data));
      } catch {
        // Backend offline — show an empty calendar.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const events = useMemo(() => schedules.map(toEvent), [schedules]);

  function openDialog(date: Date) {
    setPresetDate(toDateInput(date));
    setDialogOpen(true);
  }

  function handleSelectSlot(slot: SlotInfo) {
    openDialog(slot.start);
  }

  function handleCreated(schedule: Schedule) {
    setSchedules((prev) => [...prev, schedule]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Calendar"
        description="Plan and visualize your publishing schedule at a glance."
      >
        <Button onClick={() => openDialog(new Date())}>
          <CalendarPlus />
          New schedule
        </Button>
      </PageHeader>

      <Card className="p-3 sm:p-4">
        {loading ? (
          <Skeleton className="h-[70vh] min-h-[560px] w-full" />
        ) : (
          <div className="h-[70vh] min-h-[560px]">
            <Calendar
              localizer={localizer}
              events={events}
              defaultDate={defaultDate}
              defaultView={Views.MONTH}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              popup
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) =>
                toast.info((event as CalendarEvent).title)
              }
              style={{ height: "100%" }}
            />
          </div>
        )}
      </Card>

      <NewScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        presetDate={presetDate}
        onCreated={handleCreated}
      />
    </div>
  );
}

function NewScheduleDialog({
  open,
  onOpenChange,
  presetDate,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presetDate: string;
  onCreated: (schedule: Schedule) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Radix unmounts content on close, so the form resets each open. */}
        <ScheduleForm
          presetDate={presetDate}
          onCreated={onCreated}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ScheduleForm({
  presetDate,
  onCreated,
  onDone,
}: {
  presetDate: string;
  onCreated: (schedule: Schedule) => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(presetDate);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !date) return;

    setSubmitting(true);
    try {
      const { data } = await api.post<Schedule | { data: Schedule }>(
        "/schedules",
        { title: trimmed, publish_date: date },
      );
      const created =
        data && typeof data === "object" && "data" in data ? data.data : data;
      onCreated(created);
      toast.success("Schedule added.");
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't create the schedule."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Schedule content</DialogTitle>
        <DialogDescription>
          Pick a title and the date you plan to publish.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="schedule-title">Title</Label>
          <Input
            id="schedule-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Publish “5 editing hacks” Reel"
            autoFocus
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="schedule-date">Publish date</Label>
          <Input
            id="schedule-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={submitting || !title.trim() || !date}>
          {submitting ? <Loader2 className="animate-spin" /> : <CalendarPlus />}
          Add schedule
        </Button>
      </DialogFooter>
    </form>
  );
}
