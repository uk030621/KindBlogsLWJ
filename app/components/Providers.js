"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-slate-200 text-black text-center py-4 pb-8">
          © {new Date().getFullYear()} LWJ Tips & Tales Posts. All rights
          reserved.
        </footer>
      </div>
    </SessionProvider>
  );
}
