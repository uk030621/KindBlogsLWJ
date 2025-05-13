// app/components/ForceRefresh.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForceRefresh({ delay = 500 }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh(); // or use location.reload() if needed
    }, delay);

    return () => clearTimeout(timer);
  }, [router, delay]);

  return null;
}
