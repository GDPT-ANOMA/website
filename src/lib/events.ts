import type { CollectionEntry } from "astro:content";

/** Today's calendar date in Gardena, as UTC midnight (event dates are stored as UTC midnight). */
function startOfTodayPacific(): number {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(
    new Date(),
  );
  return new Date(ymd).valueOf();
}

/** Events sorted by date, with any event that has already ended removed. */
export function upcomingEvents(events: CollectionEntry<"events">[]): CollectionEntry<"events">[] {
  const today = startOfTodayPacific();
  return events
    .filter((event) => (event.data.endDate ?? event.data.date).valueOf() >= today)
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
}
