// components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      {children}
      <footer>
        <p className="text-slate-600">
          © {new Date().getFullYear()} LWJ Helpful Posts. All rights reserved.
        </p>
      </footer>
    </SessionProvider>
  );
}
