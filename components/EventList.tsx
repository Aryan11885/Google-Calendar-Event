"use client";

import { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  htmlLink?: string;
  start?: {
    dateTime?: string;
  };
}

export default function EventList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const response = await fetch("/api/calendar");

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        Loading events...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Upcoming Events
      </h2>

      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                {event.summary || "Untitled Event"}
              </h3>

              <p className="text-gray-600 mt-1">
                {event.description}
              </p>

              <p className="mt-2">
                📅{" "}
                {event.start?.dateTime
                  ? new Date(event.start.dateTime).toLocaleString()
                  : "No date"}
              </p>

              {event.htmlLink && (
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Open in Google Calendar
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}