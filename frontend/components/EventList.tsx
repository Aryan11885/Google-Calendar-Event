"use client";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { dateTime?: string };
}

interface EventListProps {
  events: CalendarEvent[];
  loading: boolean;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

function formatEventDate(dateTime: string) {
  return new Date(dateTime).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventList({
  events,
  loading,
  onEdit,
  onDelete,
}: EventListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-4 w-1/2 rounded bg-white/10" />
            <div className="mt-3 h-3 w-full rounded bg-white/10" />
            <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 rounded-lg bg-white/10" />
              <div className="h-8 w-16 rounded-lg bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 mb-4">
          <CalendarDays className="h-7 w-7 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-white">
          No upcoming events
        </h3>
        <p className="mt-2 max-w-xs text-sm text-slate-400 leading-relaxed">
          Your calendar is clear. Create an event using the form and it will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="group rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 transition-colors hover:border-blue-500/20 hover:bg-white/8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white truncate">
                {event.summary || "Untitled Event"}
              </h3>

              {event.start?.dateTime && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <Clock3 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>{formatEventDate(event.start.dateTime)}</span>
                </div>
              )}

              {event.location && (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}

              {event.description && (
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-400">
                  <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>
              )}

              {event.htmlLink && (
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in Google Calendar
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onEdit(event)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>

              <button
                onClick={() => onDelete(event)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
