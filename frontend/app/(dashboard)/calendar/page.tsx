import type { Metadata } from "next";
import { ContentCalendar } from "./content-calendar";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return <ContentCalendar />;
}
