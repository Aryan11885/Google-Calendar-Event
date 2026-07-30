"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import LoginButton from "@/components/LoginButton";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import DeleteDialog from "@/components/DeleteDialog";
import { toast } from "sonner";

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
  const { status } = useSession();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(
    null,
  );

  const [deleteLoading, setDeleteLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  async function fetchEvents() {
    try {
      const response = await fetch("/api/calendar");

      if (response.status === 401) {
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

  function deleteEvent(event: CalendarEvent) {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!eventToDelete || deleteLoading) return;

    try {
      setDeleteLoading(true);

      const response = await fetch("/api/calendar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: eventToDelete.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Event deleted successfully.");

      await fetchEvents();

      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch {
      toast.error("Failed to delete event.");
    } finally {
      setDeleteLoading(false);
    }
  }

  function clearSelectedEvent() {
    setSelectedEvent(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="glass card-shadow mb-8 overflow-hidden rounded-3xl border border-white/10">
          <div className="relative p-8 sm:p-10 lg:p-14">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-300">
                  Google Calendar Scheduler
                </span>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Manage Your Calendar
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Faster & Smarter
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Create, update and organize your Google Calendar events from
                  one clean dashboard. Built for speed, productivity and a
                  seamless scheduling experience.
                </p>
              </div>

              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Account
                </p>

                <LoginButton />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 xl:grid-cols-[430px_1fr]">
          {/* Left Side */}
          <div className="space-y-8">
            <div
              ref={formRef}
              className="glass card-shadow rounded-3xl border border-white/10 p-6 sm:p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  {selectedEvent ? "Edit Event" : "Create Event"}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Fill in the details below to schedule your Google Calendar
                  event.
                </p>
              </div>

              <EventForm
                onSuccess={fetchEvents}
                selectedEvent={selectedEvent}
                onCancelEdit={clearSelectedEvent}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="glass card-shadow rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Upcoming Events
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  View, edit and manage all your upcoming Google Calendar
                  events.
                </p>
              </div>

              {!loading && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2">
                  <span className="text-sm font-medium text-blue-300">
                    {events.length} {events.length === 1 ? "Event" : "Events"}
                  </span>
                </div>
              )}
            </div>

            <EventList
              events={events}
              loading={loading}
              onEdit={handleEdit}
              onDelete={deleteEvent}
            />
            <DeleteDialog
              open={deleteDialogOpen}
              loading={deleteLoading}
              title={eventToDelete?.summary || "Untitled Event"}
              onOpenChange={(open) => {
                setDeleteDialogOpen(open);

                if (!open) {
                  setEventToDelete(null);
                }
              }}
              onConfirm={confirmDelete}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
