"use client";

import {
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  Plus,
  Users,
  CalendarCheck,
} from "lucide-react";

export default function DoctorDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Doctor Appointment
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage doctors, patients and appointments
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
            <Stethoscope className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-6 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">
                  Appointment Management
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Good to see you 👋
                </h2>

                <p className="mt-2 max-w-xl text-sm text-slate-400">
                  Schedule appointments, manage patients and keep your
                  doctors' calendars organized.
                </p>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <Plus className="h-4 w-4" />
                New Appointment
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Appointments"
            value="0"
            icon={<CalendarCheck className="h-5 w-5" />}
          />

          <StatCard
            title="Upcoming"
            value="0"
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            title="Doctors"
            value="0"
            icon={<Stethoscope className="h-5 w-5" />}
          />

          <StatCard
            title="Patients"
            value="0"
            icon={<Users className="h-5 w-5" />}
          />
        </section>

        {/* Main sections */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Upcoming appointments */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  Upcoming Appointments
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Your next scheduled appointments
                </p>
              </div>

              <CalendarDays className="h-5 w-5 text-blue-400" />
            </div>

            <div className="mt-6 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/10">
              <div className="text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  No upcoming appointments
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your scheduled appointments will appear here.
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold">Quick Actions</h3>

            <p className="mt-1 text-xs text-slate-400">
              Manage your clinic quickly
            </p>

            <div className="mt-5 space-y-3">
              <QuickAction
                icon={<CalendarCheck className="h-4 w-4" />}
                title="Book Appointment"
                description="Schedule a patient visit"
              />

              <QuickAction
                icon={<UserRound className="h-4 w-4" />}
                title="Add Patient"
                description="Create a new patient"
              />

              <QuickAction
                icon={<Stethoscope className="h-4 w-4" />}
                title="Manage Doctors"
                description="View and manage doctors"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}