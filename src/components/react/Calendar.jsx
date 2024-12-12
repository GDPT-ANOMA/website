import React, { useEffect, useState } from "react";
import moment from "moment";

const GoogleCalendar = ({ CALENDAR_API_KEY }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function stripHtml(htmlString) {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
  }

  useEffect(() => {
    const apiKey = CALENDAR_API_KEY;
    const calendarId = "gdptanoma@gmail.com";
    const userTimeZone = "America/Los_Angeles";

    const loadGapiAndListEvents = () => {
      return new Promise((resolve, reject) => {
        if (typeof window.gapi === "undefined") {
          const script = document.createElement("script");
          script.src = "https://apis.google.com/js/api.js";
          document.body.appendChild(script);
          script.onload = () => {
            window.gapi.load("client", resolve);
          };
          script.onerror = (error) => {
            reject(new Error("Failed to load the Google API script."));
          };
        } else {
          window.gapi.load("client", resolve);
        }
      })
        .then(() => {
          return gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
        })
        .then(() => {
          return gapi.client.calendar.events.list({
            calendarId: calendarId,
            timeZone: userTimeZone,
            singleEvents: true,
            timeMin: new Date().toISOString(),
            maxResults: 10,
            orderBy: "startTime",
          });
        })
        .then((response) => {
          if (response.result.items && response.result.items.length > 0) {
            setEvents(response.result.items);
          } else {
            setError("No upcoming events found.");
          }
        })
        .catch((error) => {
          console.error("Error: ", error.message);
          setError(error.message);
        });
    };

    setLoading(true);
    loadGapiAndListEvents().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {events.map((event, index) => {
        // Check for all-day events
        const allDay = event.start.date && !event.start.dateTime;
        const startDate = moment(
          allDay ? event.start.date : event.start.dateTime,
        );
        const endDate = moment(allDay ? event.end.date : event.end.dateTime);

        const formattedDate = startDate.format("D MMMM, YYYY");
        // For all-day events, don't show specific start/end times
        const startsAt = allDay ? "All day" : startDate.format("LT");
        const endsAt = allDay ? "All day" : endDate.format("LT");

        return (
          <div key={index}>
            {/* Code for displaying the event goes here */}
            <div className="my-1 ps-2 first:mt-0">
              <h3 className="text-xl font-medium uppercase text-gray-500 dark:text-gray-400">
                {formattedDate}
              </h3>
            </div>
            <div className="mb-4 flex gap-x-3">
              <div className="relative after:absolute after:bottom-0 after:start-3.5 after:top-7 after:w-px after:-translate-x-[0.5px] after:bg-gray-700 last:after:hidden">
                <div className="relative z-10 flex size-7 items-center justify-center">
                  <div className="size-2 rounded-full bg-gray-600"></div>
                </div>
              </div>
              <div className="grow pb-3 pt-0.5 text-2xl">
                <h3 className="flex flex-wrap gap-x-1.5 font-semibold text-gray-800">
                  {event.summary}
                </h3>
                <div className="text-md">
                  {allDay
                    ? "All day event"
                    : `Starts at: ${startsAt} - Ends at: ${endsAt}`}
                </div>
                <p className="text-md mt-1 flex flex-wrap text-wrap text-gray-600">
                  {event.description
                    ? stripHtml(event.description)
                    : "No description provided."}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoogleCalendar;
