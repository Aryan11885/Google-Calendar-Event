"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Globe, LogOut, Mail, User } from "lucide-react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <User className="h-7 w-7" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">
              {session.user?.name}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <Mail className="h-4 w-4" />

              <span className="truncate">
                {session.user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-medium text-red-300 transition-all duration-300 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-blue-500/30 bg-white/5 p-6 backdrop-blur">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
          <Globe className="h-8 w-8 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-white">
          Connect Google Calendar
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Sign in with your Google account to create, edit and manage your
          calendar events from one beautiful dashboard.
        </p>

        <button
          onClick={() => signIn("google")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Globe className="h-5 w-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}