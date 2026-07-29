"use client";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

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
  onDelete: (id: string) => void;
}

export default function EventList({
  events,
  loading,
  onEdit,
  onDelete,
}: EventListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="h-5 w-1/2 rounded bg-white/10" />

            <div className="mt-4 h-4 w-full rounded bg-white/10" />

            <div className="mt-2 h-4 w-3/4 rounded bg-white/10" />

            <div className="mt-6 h-10 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-8 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
          <CalendarDays className="h-10 w-10 text-blue-400" />
        </div>

        <h3 className="mt-6 text-2xl font-bold text-white">
          No Upcoming Events
        </h3>

        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Your calendar is empty. Create your first event using the form on the
          left and it will appear here instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {events.map((event) => (
        <div
          key={event.id}
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xl font-semibold text-white">
                {event.summary || "Untitled Event"}
              </h3>

              {event.description && (
                <div className="mt-4 flex items-start gap-3">
                  <FileText className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400" />

                  <p className="leading-7 text-slate-300">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 text-slate-300">
                <Clock3 className="h-4 w-4 text-blue-400" />

                <span>
                  {event.start?.dateTime
                    ? new Date(event.start.dateTime).toLocaleString()
                    : "No date selected"}
                </span>
              </div>

              {event.htmlLink && (
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Calendar
                </a>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                onClick={() => onEdit(event)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-amber-600 active:scale-[0.98]"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={() => onDelete(event.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:bg-red-700 active:scale-[0.98]"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
