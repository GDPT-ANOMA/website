import { GOOGLE_CALENDAR_API_KEY, GOOGLE_CALENDAR_ID } from "astro:env/server";

export type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
};

type GoogleCalendarListResponse = {
  items?: Array<{
    id?: string;
    summary?: string;
    description?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
    location?: string;
  }>;
};

export async function fetchGoogleCalendarEvents(options?: {
  maxResults?: number;
  includePastEvents?: boolean;
}): Promise<CalendarEvent[]> {
  const apiKey = GOOGLE_CALENDAR_API_KEY;
  const calendarId = GOOGLE_CALENDAR_ID;

  if (!apiKey || !calendarId) {
    return [];
  }

  const queryParams = new URLSearchParams({
    key: apiKey,
    maxResults: String(options?.maxResults ?? 100),
    singleEvents: "true",
    orderBy: "startTime",
  });

  if (!options?.includePastEvents) {
    queryParams.set("timeMin", new Date().toISOString());
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Google Calendar API returned ${response.status}`);
      return [];
    }

    const data = (await response.json()) as GoogleCalendarListResponse;
    const items = Array.isArray(data.items) ? data.items : [];

    return items.flatMap((event) => {
      if (!event.id || !event.summary || !event.start || !event.end) {
        return [];
      }

      return [
        {
          id: event.id,
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
          location: event.location,
        },
      ];
    });
  } catch (error) {
    console.warn(`Google Calendar fetch failed: ${String(error)}`);
    return [];
  }
}
