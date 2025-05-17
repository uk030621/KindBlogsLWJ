"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-yellow-100 text-black text-center py-4">
          © {new Date().getFullYear()} LWJ Helpful Posts. All rights reserved.
        </footer>
      </div>
    </SessionProvider>
  );
}
