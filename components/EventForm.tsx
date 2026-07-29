"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    dateTime?: string;
  };
  end?: {
    dateTime?: string;
  };
}

interface EventFormData {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
}

interface EventFormProps {
  onSuccess: () => void;
  selectedEvent: CalendarEvent | null;
  onCancelEdit: () => void;
}

export default function EventForm({
  onSuccess,
  selectedEvent,
  onCancelEdit,
}: EventFormProps) {
  const [event, setEvent] = useState<EventFormData>({
    summary: "",
    description: "",
    location: "",
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(false);

  const isEditing = selectedEvent !== null;

  useEffect(() => {
    if (!selectedEvent) {
      setEvent({
        summary: "",
        description: "",
        location: "",
        start: "",
        end: "",
      });

      return;
    }

    setEvent({
      summary: selectedEvent.summary || "",
      description: selectedEvent.description || "",
      location: selectedEvent.location || "",
      start: selectedEvent.start?.dateTime
        ? selectedEvent.start.dateTime.slice(0, 16)
        : "",
      end: selectedEvent.end?.dateTime
        ? selectedEvent.end.dateTime.slice(0, 16)
        : "",
    });
  }, [selectedEvent]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEvent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/calendar", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...event,
          id: selectedEvent?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update event" : "Failed to create event",
        );
      }

      alert(
        isEditing
          ? "✅ Event updated successfully!"
          : "✅ Event created successfully!",
      );

      await onSuccess();

      if (isEditing) {
        onCancelEdit();
      }

      setEvent({
        summary: "",
        description: "",
        location: "",
        start: "",
        end: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        isEditing ? "❌ Failed to update event" : "❌ Failed to create event",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
          {isEditing ? (
            <Pencil className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? "Edit Event" : "Create Event"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {isEditing
              ? "Update your existing Google Calendar event."
              : "Fill in the details below to create a new calendar event."}
          </p>
        </div>
      </div>

      {/* Event Title */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <CalendarDays className="h-4 w-4" />
          Event Title
        </label>

        <input
          type="text"
          name="summary"
          placeholder="Weekly Team Meeting"
          value={event.summary}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <FileText className="h-4 w-4" />
          Description
        </label>

        <textarea
          name="description"
          rows={4}
          placeholder="Write event details..."
          value={event.description}
          onChange={handleChange}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <MapPin className="h-4 w-4" />
          Location
        </label>

        <input
          type="text"
          name="location"
          placeholder="Conference Room A"
          value={event.location}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        />
      </div>

      {/* Date & Time */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Clock3 className="h-4 w-4" />
            Start Time
          </label>

          <input
            type="datetime-local"
            name="start"
            value={event.start}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Clock3 className="h-4 w-4" />
            End Time
          </label>

          <input
            type="datetime-local"
            name="end"
            value={event.end}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />

              <span>
                {isEditing ? "Updating Event..." : "Creating Event..."}
              </span>
            </>
          ) : (
            <>
              {isEditing ? (
                <>
                  <Pencil className="h-5 w-5" />
                  <span>Update Event</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Create Event</span>
                </>
              )}
            </>
          )}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
