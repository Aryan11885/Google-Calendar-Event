"use client";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  htmlLink?: string;
  start?: {
    dateTime?: string;
  };
}

interface EventListProps {
  events: CalendarEvent[];
  loading: boolean;
  onEdit: (event: CalendarEvent) => void;
}

export default function EventList({ events, loading,  onEdit, }: EventListProps) {
  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10">Loading events...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Upcoming Events</h2>

      {events.length === 0 ? (
        <p className="text-gray-400">No upcoming events.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">
                {event.summary || "Untitled Event"}
              </h3>

              <p className="text-gray-600 mt-1">{event.description}</p>

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
              <div className="mt-4 flex gap-3">
                <button 
                onClick={() => onEdit(event)} 
                className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
                  Edit
                </button>

                <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
