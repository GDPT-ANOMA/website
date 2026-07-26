import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { googleCalendarLoader } from "./loaders/googleCalendar";

const localeString = z.object({
  en: z.string(),
  vi: z.string(),
});

const nganh = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/nganh" }),
  schema: z.object({
    order: z.number(),
    name: localeString,
    ages: localeString,
    summary: localeString,
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: localeString,
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: localeString,
    place: localeString,
    summary: localeString,
    featured: z.boolean().default(false),
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/announcements" }),
  schema: z.object({
    title: localeString,
    date: z.coerce.date(),
    body: localeString,
    pinned: z.boolean().default(false),
  }),
});

const schedule = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/schedule" }),
  schema: z.object({
    order: z.number(),
    time: z.string(),
    title: localeString,
    detail: localeString,
  }),
});

const calendarEvents = defineCollection({
  loader: googleCalendarLoader({
    apiKey: import.meta.env.GOOGLE_CALENDAR_API_KEY,
    calendarId: import.meta.env.GOOGLE_CALENDAR_ID,
    maxResults: 100,
    includePastEvents: false,
  }),
});

export const collections = {
  nganh,
  events,
  announcements,
  schedule,
  "calendar-events": calendarEvents,
};
