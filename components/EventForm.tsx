"use client";

import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";

export default function EventForm() {
  const [event, setEvent] = useState<CalendarEvent>({
    summary: "",
    description: "",
    location: "",
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      alert("✅ Event created successfully!");

      setEvent({
        summary: "",
        description: "",
        location: "",
        start: "",
        end: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-4 bg-amber-950"
    >
      <input
        type="text"
        name="summary"
        placeholder="Meeting Title"
        value={event.summary}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={event.description}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={event.location}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="datetime-local"
        name="start"
        value={event.start}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="datetime-local"
        name="end"
        value={event.end}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}