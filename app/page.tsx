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

  async function deleteEvent(id: string) {
    const confirmed = confirm("Are you sure you want to delete this event?");

    if (!confirmed) return;

    const response = await fetch("/api/calendar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      alert("Failed to delete event.");
      return;
    }

    fetchEvents();
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
          <EventForm
            onSuccess={fetchEvents}
            selectedEvent={selectedEvent}
            onCancelEdit={clearSelectedEvent}
          />
        </div>

        <EventList events={events} loading={loading} onEdit={handleEdit} onDelete={deleteEvent}/>
      </section>
    </main>
  );
}
