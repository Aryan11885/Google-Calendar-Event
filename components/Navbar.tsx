"use client";

import { CalendarDays } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Google Calendar
            </h1>

            <p className="text-sm text-slate-400">
              Smart Event Scheduler
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 md:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-sm font-medium text-emerald-300">
            Google Calendar Connected
          </span>
        </div>
      </nav>
    </header>
  );
}