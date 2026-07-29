"use client";

import { useEffect, useState } from "react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEvent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-4 rounded-lg bg-amber-950 p-6"
    >
      <h2 className="text-2xl font-bold text-white">
        {isEditing ? "Edit Event" : "Create Event"}
      </h2>

      <input
        type="text"
        name="summary"
        placeholder="Meeting Title"
        value={event.summary}
        onChange={handleChange}
        className="w-full rounded border p-2"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={event.description}
        onChange={handleChange}
        className="w-full rounded border p-2"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={event.location}
        onChange={handleChange}
        className="w-full rounded border p-2"
      />

      <input
        type="datetime-local"
        name="start"
        value={event.start}
        onChange={handleChange}
        className="w-full rounded border p-2"
        required
      />

      <input
        type="datetime-local"
        name="end"
        value={event.end}
        onChange={handleChange}
        className="w-full rounded border p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
            ? "Update Event"
            : "Create Event"}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="w-full rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}
