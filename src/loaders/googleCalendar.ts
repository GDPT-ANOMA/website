import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';
import { AstroError } from 'astro/errors';

export interface GoogleCalendarLoaderOptions {
  /** Google Calendar API Key */
  apiKey: string;
  /** ID of the public Google Calendar */
  calendarId: string;
  /** Number of events to fetch (default: 100) */
  maxResults?: number;
  /** Whether to include past events (default: false) */
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
  { logger, parseData, store }: LoaderContext
) {
  const timeMin = options.includePastEvents 
    ? undefined 
    : encodeURIComponent(new Date().toISOString());
  
  const queryParams = new URLSearchParams({
    key: options.apiKey,
    ...(timeMin && { timeMin }),
    maxResults: (options.maxResults || 100).toString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(options.calendarId)}/events?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }

    const data = await response.json();
    logger.info(`Fetched ${data.items.length} events`);
    store.clear();

    for (const event of data.items) {
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
    logger.error(`Error fetching calendar events: ${error}`);
    throw new AstroError('Failed to load Google Calendar data');
  }
}

export function googleCalendarLoader(options: GoogleCalendarLoaderOptions): Loader {
  return {
    name: 'google-calendar-loader',
    load: async (context: LoaderContext) => {
      const { logger } = context;
      logger.info('Starting to fetch calendar events...');
      
      await fetchCalendarData(options, context);

      // Optionally set up polling to refresh data periodically
      setInterval(async () => {
        logger.info('Refreshing calendar events...');
        await fetchCalendarData(options, context);
      }, 5 * 60 * 1000); // Refresh every 5 minutes
    },
    schema: async () => EventSchema,
  };
}


