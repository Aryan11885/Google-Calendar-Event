"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import LoginButton from "@/components/LoginButton";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import DeleteDialog from "@/components/DeleteDialog";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";

interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
}

export default function Home() {
  const { status } = useSession();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  async function fetchEvents() {
    try {
      const response = await fetch("/api/calendar");

      if (response.status === 401) return;

      if (!response.ok) throw new Error("Failed to fetch events");

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
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function deleteEvent(event: CalendarEvent) {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!eventToDelete || deleteLoading) return;

    setDeleteLoading(true);
    try {
      const response = await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventToDelete.id }),
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Event deleted.");
      await fetchEvents();
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch {
      toast.error("Failed to delete event.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Calendar
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Create and manage your Google Calendar events
              </p>
            </div>

            <div className="w-full max-w-xs">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 xl:grid-cols-[400px_1fr]">

          {/* Left — Form */}
          <div ref={formRef}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-white">
                  {selectedEvent ? "Edit Event" : "New Event"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedEvent
                    ? "Update the details for this event."
                    : "Fill in the details below to create an event."}
                </p>
              </div>

              <EventForm
                onSuccess={fetchEvents}
                selectedEvent={selectedEvent}
                onCancelEdit={() => setSelectedEvent(null)}
              />
            </div>
          </div>

          {/* Right — Events list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Upcoming Events
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  View, edit and manage your calendar events
                </p>
              </div>

              {!loading && events.length > 0 && (
                <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">
                    {events.length} {events.length === 1 ? "event" : "events"}
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
                if (!open) setEventToDelete(null);
              }}
              onConfirm={confirmDelete}
            />
          </div>
        </div>
      </section>
    </main>
  );
}