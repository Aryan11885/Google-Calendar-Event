"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <div>
          <p className="font-semibold">
            {session.user?.name}
          </p>

          <p className="text-sm text-gray-500">
            {session.user?.email}
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 flex justify-end">
      <button
        onClick={() => signIn("google")}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
}