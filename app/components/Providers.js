"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className=" text-black text-center py-4 pb-8 opacity-20 font-bold ">
          © {new Date().getFullYear()} LWJ Tips & Tales. All rights reserved.
        </footer>
      </div>
    </SessionProvider>
  );
}
