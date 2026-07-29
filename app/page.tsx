"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import LoginButton from "@/components/LoginButton";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: {
    dateTime?: string;
  };
  end?: {
    dateTime?: string;
  };
}

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] =
  useState<CalendarEvent | null>(null);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="mx-auto max-w-3xl p-8">
        <LoginButton />

        <EventForm onSuccess={fetchEvents} selectedEvent={selectedEvent} />

        <EventList events={events} loading={loading} onEdit={setSelectedEvent} />
      </section>
    </main>
  );
}
