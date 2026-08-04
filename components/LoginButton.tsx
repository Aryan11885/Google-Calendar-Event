"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, Mail, User, Globe } from "lucide-react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white leading-tight">
              {session.user?.name}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{session.user?.email}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 shrink-0">
          <Globe className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Connect Google</p>
          <p className="text-xs text-slate-400">Sign in to manage the events</p>
        </div>
      </div>

      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        <Globe className="h-4 w-4" />
        Continue with Google
      </button>
    </div>
  );
}