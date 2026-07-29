"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";

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
  const formRef = useRef<HTMLDivElement>(null);
  const { status } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  async function fetchEvents() {
    try {
      const response = await fetch("/api/calendar");

      if (response.status === 401) {
        console.log("Session expired");

        return;
      }

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
    if (status === "authenticated") {
      fetchEvents();
    } else if (status === "unauthenticated") {
      setEvents([]);
      setLoading(false);
    }
  }, [status]);

  function handleEdit(event: CalendarEvent) {
    setSelectedEvent(event);

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function clearSelectedEvent() {
    setSelectedEvent(null);
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="mx-auto max-w-3xl p-8">
        <LoginButton />

        <div ref={formRef}>
          <EventForm onSuccess={fetchEvents} selectedEvent={selectedEvent} onCancelEdit={clearSelectedEvent} />
        </div>

        <EventList events={events} loading={loading} onEdit={handleEdit} />
      </section>
    </main>
  );
}
