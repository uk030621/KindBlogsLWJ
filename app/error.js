"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({ error }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-6">
        Sorry! We could not find that page or an unexpected error occurred.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go back to Home
      </button>
    </div>
  );
}
