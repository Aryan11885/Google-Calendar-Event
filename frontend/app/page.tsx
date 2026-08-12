"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  LogOut,
  Loader2,
  CheckCircle2,
  Globe,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: string;
  full_name: string;
  email: string;
  specialization: string;
  working_start: string;
  working_end: string;
  slot_duration: number;
  is_active: boolean;
}

interface Slot {
  start: string;
  end: string;
}

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const LABEL_CLASS =
  "flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 mb-1.5";

export default function Home() {
  const { data: session, status } = useSession();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const googleEmail = session?.user?.email || "";

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchDoctors() {
      try {
        setLoadingDoctors(true);
        const response = await fetch(`${API_URL}/api/v1/doctors/`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data: Doctor[] = await response.json();
        setDoctors(data.filter((d) => d.is_active));
      } catch {
        toast.error("Unable to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    }

    fetchDoctors();
  }, [status]);

  useEffect(() => {
    if (session?.user?.name) setFullName(session.user.name);
  }, [session]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        setSelectedSlot(null);
        const response = await fetch(
          `${API_URL}/api/v1/doctors/${selectedDoctor}/slots?date=${selectedDate}`,
          { headers: { Accept: "application/json" }, cache: "no-store" },
        );
        if (!response.ok) throw new Error("Failed to fetch slots");
        const data: Slot[] = await response.json();
        setSlots(data);
      } catch {
        setSlots([]);
        toast.error("Unable to load available time slots.");
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  function formatTime(value: string) {
    const [hours, minutes] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  async function getPatientId(): Promise<string> {
    if (!googleEmail) throw new Error("Google email not found.");

    const response = await fetch(
      `${API_URL}/api/v1/patients/me?email=${encodeURIComponent(googleEmail)}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );

    if (response.ok) {
      const patient: Patient = await response.json();
      if (patient.full_name) setFullName(patient.full_name);
      if (patient.phone) setPhone(patient.phone);
      return patient.id;
    }

    if (response.status === 404) {
      if (!fullName.trim()) throw new Error("Please enter your full name.");
      if (!phone.trim()) throw new Error("Please enter your phone number.");

      const createResponse = await fetch(`${API_URL}/api/v1/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ full_name: fullName.trim(), email: googleEmail, phone: phone.trim() }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => null);
        throw new Error(getBackendErrorMessage(errorData, "Unable to create patient profile."));
      }

      const newPatient: Patient = await createResponse.json();
      return newPatient.id;
    }

    const errorData = await response.json().catch(() => null);
    throw new Error(getBackendErrorMessage(errorData, "Unable to find patient profile."));
  }

  function getBackendErrorMessage(errorData: unknown, fallback: string): string {
    if (!errorData) return fallback;
    if (typeof errorData === "string") return errorData;
    if (typeof errorData === "object" && errorData !== null) {
      const data = errorData as { detail?: unknown; message?: unknown };
      if (typeof data.detail === "string") return data.detail;
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              const v = item as { msg?: unknown };
              return typeof v.msg === "string" ? v.msg : JSON.stringify(item);
            }
            return String(item);
          })
          .join(", ");
      }
      try { return JSON.stringify(errorData); } catch { return fallback; }
    }
    return fallback;
  }

  async function handleBooking() {
    if (!selectedDoctor) { toast.error("Please select a doctor."); return; }
    if (!selectedDate) { toast.error("Please select a date."); return; }
    if (!selectedSlot) { toast.error("Please select a time slot."); return; }
    if (!fullName.trim()) { toast.error("Please enter your name."); return; }
    if (!phone.trim()) { toast.error("Please enter your phone number."); return; }
    if (!reason.trim()) { toast.error("Please enter the reason for your appointment."); return; }
    if (reason.trim().length < 5) { toast.error("Reason must be at least 5 characters."); return; }
    if (!googleEmail) { toast.error("Please connect your Google account first."); return; }

    try {
      setBooking(true);
      const patientId = await getPatientId();

      const response = await fetch(`${API_URL}/api/v1/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          doctor_id: selectedDoctor,
          patient_id: patientId,
          appointment_date: selectedDate,
          start_time: selectedSlot.start,
          reason: reason.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(getBackendErrorMessage(errorData, "Unable to book appointment."));
      }

      toast.success("Appointment booked successfully!");
      setSelectedSlot(null);
      setReason("");

      const slotsResponse = await fetch(
        `${API_URL}/api/v1/doctors/${selectedDoctor}/slots?date=${selectedDate}`,
        { headers: { Accept: "application/json" }, cache: "no-store" },
      );
      if (slotsResponse.ok) setSlots(await slotsResponse.json());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to book appointment.");
    } finally {
      setBooking(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <CalendarDays className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="text-xl font-bold text-slate-900">CareBook</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to book and manage your doctor appointments.
          </p>

          <button
            onClick={() => signIn("google")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Globe className="h-4 w-4" />
            Continue with Google
          </button>
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shrink-0">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900">CareBook</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Book and manage your appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/appointment"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">My Appointments</span>
            </Link>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-slate-900 leading-tight">{session?.user?.name}</p>
              <p className="text-xs text-slate-500 truncate max-w-[160px]">{googleEmail}</p>
            </div>

            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-slate-200 shrink-0"
              />
            )}

            <button
              onClick={() => signOut()}
              title="Sign out"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Book an Appointment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select a doctor, choose a date and pick an available slot.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left — Doctor / Date / Slots */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">

            {/* Doctor */}
            <div>
              <label className={LABEL_CLASS}>
                <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                Select doctor
              </label>

              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedSlot(null);
                  setSlots([]);
                }}
                disabled={loadingDoctors}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">
                  {loadingDoctors ? "Loading doctors..." : "Choose a doctor"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.full_name} — {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor info */}
            {selectedDoctor && (() => {
              const doctor = doctors.find((d) => d.id === selectedDoctor);
              if (!doctor) return null;
              return (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{doctor.full_name}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{doctor.specialization}</p>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Working hours: {formatTime(doctor.working_start)} – {formatTime(doctor.working_end)}
                  </p>
                </div>
              );
            })()}

            {/* Date */}
            <div className="mt-5">
              <label className={LABEL_CLASS}>
                <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                Select date
              </label>

              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className={INPUT_CLASS}
              />
            </div>

            {/* Slots */}
            {selectedDoctor && selectedDate && (
              <div className="mt-5">
                <label className={LABEL_CLASS}>
                  <Clock3 className="h-3.5 w-3.5 text-blue-500" />
                  Available slots
                </label>

                {loadingSlots ? (
                  <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    Loading available slots...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    No available slots for this date. Try a different date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {slots.map((slot) => {
                      const selected = selectedSlot?.start === slot.start;
                      return (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {formatTime(slot.start)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — Patient info + Booking */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Your Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Used to create or update your patient profile.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email (readonly) */}
              <div>
                <label className={LABEL_CLASS}>
                  <UserRound className="h-3.5 w-3.5" />
                  Google email
                </label>
                <input
                  value={googleEmail}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Phone number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  type="tel"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Reason for visit</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine checkup, back pain, follow-up..."
                  rows={3}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>
            </div>

            {/* Selected slot summary */}
            {selectedSlot && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                      Selected slot
                    </p>
                    <p className="text-sm text-slate-700 mt-0.5">
                      {formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={booking || !selectedSlot}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {booking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarDays className="h-4 w-4" />
                  Confirm booking
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}