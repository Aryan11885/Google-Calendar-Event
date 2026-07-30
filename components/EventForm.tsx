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
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
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

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-blue-500/60 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const LABEL_CLASS =
  "flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5";

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
      setEvent({ summary: "", description: "", location: "", start: "", end: "" });
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
    setEvent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading(isEditing ? "Updating event..." : "Creating event...");

    try {
      const response = await fetch("/api/calendar", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, id: selectedEvent?.id }),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update event" : "Failed to create event");
      }

      toast.dismiss(toastId);
      toast.success(isEditing ? "Event updated." : "Event created.");

      await onSuccess();

      if (isEditing) onCancelEdit();

      setEvent({ summary: "", description: "", location: "", start: "", end: "" });
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(isEditing ? "Failed to update event." : "Failed to create event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && (
        <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">
              Editing: {selectedEvent?.summary || "Untitled Event"}
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-amber-400 hover:text-amber-200 transition-colors"
            aria-label="Cancel edit"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div>
        <label className={LABEL_CLASS}>
          <CalendarDays className="h-3.5 w-3.5" />
          Event title
        </label>
        <input
          type="text"
          name="summary"
          placeholder="Weekly team meeting"
          value={event.summary}
          onChange={handleChange}
          required
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          <FileText className="h-3.5 w-3.5" />
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Write event details..."
          value={event.description}
          onChange={handleChange}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>
          <MapPin className="h-3.5 w-3.5" />
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="Conference Room A"
          value={event.location}
          onChange={handleChange}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>
            <Clock3 className="h-3.5 w-3.5" />
            Start time
          </label>
          <input
            type="datetime-local"
            name="start"
            value={event.start}
            onChange={handleChange}
            required
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            <Clock3 className="h-3.5 w-3.5" />
            End time
          </label>
          <input
            type="datetime-local"
            name="end"
            value={event.end}
            onChange={handleChange}
            required
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            <>
              <Pencil className="h-4 w-4" />
              Update event
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create event
            </>
          )}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}