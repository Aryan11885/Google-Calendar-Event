import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Google Calendar Scheduler",
  description: "Google Calendar Scheduler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}

          <Toaster
            position="top-center"
            richColors
            theme="dark"
            expand
            closeButton
            duration={3000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}