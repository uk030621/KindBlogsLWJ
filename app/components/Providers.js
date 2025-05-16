// components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      {children}
      <footer className="pt-0 mx-auto">
        <p className="text-slate-500 ">
          © {new Date().getFullYear()} LWJ Helpful Posts. All rights reserved.
        </p>
      </footer>
    </SessionProvider>
  );
}
