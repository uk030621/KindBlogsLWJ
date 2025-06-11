"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div className="min-h-screen flex justify-center px-4 mt-12">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="mb-4">
          {error === "AccessDenied"
            ? "Your email is not authorized to access this app."
            : "An unknown error occurred during sign-in."}
        </p>
        {/* Call to Action Button */}
        <div className="mt-10 text-center">
          <a
            href="/request-access"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Request Access 🚀
          </a>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
