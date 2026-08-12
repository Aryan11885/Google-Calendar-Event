"use client";

import { useSession } from "next-auth/react";
import { CalendarDays } from "lucide-react";

export default function Navbar() {
  const { status } = useSession();
  const connected = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20 shrink-0">
            <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Google Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Smart Event Scheduler
            </p>
          </div>
        </div>

        {connected && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 sm:px-4 sm:py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-emerald-300 hidden xs:block">
              Connected
            </span>
            <span className="text-xs sm:text-sm font-medium text-emerald-300 hidden sm:block">
                Google Calendar Connected
            </span>
          </div>
        )}
      </nav>
    </header>
  );
}