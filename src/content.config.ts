import { defineCollection } from "astro:content";
import { googleCalendarLoader } from "./loaders/googleCalendar";

export const collections = {
  "calendar-events": defineCollection({
    loader: googleCalendarLoader({
      apiKey: import.meta.env.GOOGLE_CALENDAR_API_KEY,
      calendarId: import.meta.env.GOOGLE_CALENDAR_ID,
      maxResults: 100,
      includePastEvents: false,
    }),
  }),
};
