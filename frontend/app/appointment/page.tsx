"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  RefreshCw,
  Stethoscope,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CalendarCheck,
  CalendarX,
} from "lucide-react";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  status: string;
  google_event_id: string | null;
  doctor: Doctor;
}

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const STATUS_LABEL: Record<string, string> = {
  BOOKED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_CLASS: Record<string, string> = {
  BOOKED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COMPLETED: "border-blue-200 bg-blue-50 text-blue-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};

export default function AppointmentsPage() {
  const { data: session, status: sessionStatus } = useSession();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  function getBackendErrorMessage(errorData: unknown, fallback: string): string {
    if (!errorData) return fallback;
    if (typeof errorData === "string") return errorData;
    if (typeof errorData === "object" && errorData !== null) {
      const data = errorData as { detail?: unknown; message?: unknown };
      if (typeof data.detail === "string") return data.detail;
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.detail)) {
        return data.detail.map((item) => {
          if (typeof item === "object" && item !== null) {
            const v = item as { msg?: unknown };
            return typeof v.msg === "string" ? v.msg : JSON.stringify(item);
          }
          return String(item);
        }).join(", ");
      }
      try { return JSON.stringify(errorData); } catch { return fallback; }
    }
    return fallback;
  }

  const fetchPatient = useCallback(async () => {
    const email = session?.user?.email;
    if (!email) return null;

    try {
      setError("");
      const response = await fetch(
        `${API_URL}/api/v1/patients/me?email=${encodeURIComponent(email)}`,
        { headers: { Accept: "application/json" }, cache: "no-store" },
      );

      const responseText = await response.text();
      let errorData: unknown = null;
      if (responseText) {
        try { errorData = JSON.parse(responseText); } catch { errorData = responseText; }
      }

      if (!response.ok) {
        if (response.status === 404) throw new Error("Patient profile not found. Please book an appointment first.");
        throw new Error(getBackendErrorMessage(errorData, "Unable to find patient profile."));
      }

      const currentPatient = errorData as Patient;
      setPatient(currentPatient);
      return currentPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to find patient.");
      return null;
    }
  }, [session?.user?.email]);

  const fetchAppointments = useCallback(async (patientId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/appointments/patient/${patientId}`,
        { headers: { Accept: "application/json" }, cache: "no-store" },
      );

      const responseText = await response.text();
      let responseData: unknown = null;
      if (responseText) {
        try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }
      }

      if (!response.ok) throw new Error(getBackendErrorMessage(responseData, `API error ${response.status}`));

      const data = responseData as Appointment[];
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch appointments.");
      return null;
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user?.email) {
      setError("Please sign in with Google.");
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      setError("");
      const currentPatient = await fetchPatient();
      if (currentPatient) await fetchAppointments(currentPatient.id);
      setLoading(false);
    }

    loadData();
  }, [session, sessionStatus, fetchPatient, fetchAppointments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const currentPatient = await fetchPatient();
      if (currentPatient) await fetchAppointments(currentPatient.id);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const getAppointmentDateTime = (a: Appointment) =>
    new Date(`${a.appointment_date}T${a.start_time}`);

  const { upcomingAppointments, previousAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const previous: Appointment[] = [];

    appointments.forEach((a) => {
      if (getAppointmentDateTime(a) >= now) upcoming.push(a);
      else previous.push(a);
    });

    upcoming.sort((a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime());
    previous.sort((a, b) => getAppointmentDateTime(b).getTime() - getAppointmentDateTime(a).getTime());

    return { upcomingAppointments: upcoming, previousAppointments: previous };
  }, [appointments]);

  function AppointmentCard({ appointment }: { appointment: Appointment }) {
    const statusKey = appointment.status.toUpperCase();
    const statusClass = STATUS_CLASS[statusKey] ?? "border-slate-200 bg-slate-50 text-slate-600";
    const statusLabel = STATUS_LABEL[statusKey] ?? appointment.status;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {appointment.doctor.full_name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {appointment.doctor.specialization}
              </p>
            </div>
          </div>

          <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
              Date
            </div>
            <p className="text-sm text-slate-900">{formatDate(appointment.appointment_date)}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
              <Clock3 className="h-3.5 w-3.5 text-blue-500" />
              Time
            </div>
            <p className="text-sm text-slate-900">
              {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Reason for visit
          </div>
          <p className="text-sm text-slate-900">{appointment.reason}</p>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
          {appointment.google_event_id ? (
            <>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs font-medium text-slate-900">Calendar sync</p>
                <p className="text-xs text-slate-500">Added to Google Calendar</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-medium text-slate-900">Calendar sync</p>
                <p className="text-xs text-slate-500">Calendar event not created</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 rounded bg-slate-100" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-xl bg-slate-100" />
                  <div className="h-16 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Book appointment</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shrink-0">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">CareBook</span>
          </div>

          {patient && (
            <p className="hidden sm:block text-xs text-slate-500 truncate max-w-[160px]">
              {patient.full_name}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Appointments
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View your upcoming and past appointments
              {patient && (
                <span className="ml-1">· <span className="font-medium text-slate-700">{patient.full_name}</span></span>
              )}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Syncing..." : "Sync"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-700">Unable to load appointments</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center px-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-4">
              <CalendarX className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">No appointments yet</h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs">
              Once you book an appointment it will appear here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <CalendarCheck className="h-4 w-4" />
              Book your first appointment
            </Link>
          </div>
        )}

        {/* Upcoming */}
        {upcomingAppointments.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Upcoming
              </h2>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                {upcomingAppointments.length}
              </span>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </div>
          </section>
        )}

        {/* Previous */}
        {previousAppointments.length > 0 && (
          <section className={upcomingAppointments.length > 0 ? "mt-10" : ""}>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Past appointments
              </h2>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                {previousAppointments.length}
              </span>
            </div>

            <div className="space-y-4">
              {previousAppointments.map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}