import type { Loader, LoaderContext } from "astro/loaders";
import { z } from "astro:content";

export interface GoogleCalendarLoaderOptions {
  apiKey: string;
  calendarId: string;
  maxResults?: number;
  includePastEvents?: boolean;
}

const EventSchema = z.object({
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string().optional(),
    date: z.string().optional(),
  }),
  end: z.object({
    dateTime: z.string().optional(),
    date: z.string().optional(),
  }),
  location: z.string().optional(),
});

async function fetchCalendarData(
  options: GoogleCalendarLoaderOptions,
  { logger, parseData, store }: LoaderContext,
) {
  if (!options.apiKey || !options.calendarId) {
    logger.warn("Skipping calendar fetch: missing GOOGLE_CALENDAR_API_KEY or GOOGLE_CALENDAR_ID");
    store.clear();
    return;
  }

  const timeMin = options.includePastEvents
    ? undefined
    : encodeURIComponent(new Date().toISOString());

  const queryParams = new URLSearchParams({
    key: options.apiKey,
    ...(timeMin && { timeMin }),
    maxResults: (options.maxResults || 100).toString(),
    singleEvents: "true",
    orderBy: "startTime",
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(options.calendarId)}/events?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      logger.warn(`Skipping calendar fetch: Google API returned ${response.status}`);
      store.clear();
      return;
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    logger.info(`Fetched ${items.length} calendar events`);
    store.clear();

    for (const event of items) {
      const parsedEvent = await parseData({
        id: event.id,
        data: event,
      });

      store.set({
        id: event.id,
        data: parsedEvent,
      });
    }
  } catch (error) {
    logger.warn(`Skipping calendar fetch due to request error: ${String(error)}`);
    store.clear();
  }
}

export function googleCalendarLoader(options: GoogleCalendarLoaderOptions): Loader {
  return {
    name: "google-calendar-loader",
    load: async (context: LoaderContext) => {
      await fetchCalendarData(options, context);
    },
    schema: async () => EventSchema,
  };
}
