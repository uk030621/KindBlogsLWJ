"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AllowedUsersList({ initialAllowed }) {
  const [allowed, setAllowed] = useState(initialAllowed);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const deleteEmail = async (email) => {
    const res = await fetch("/api/allowedUsers/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (res.ok) {
      setAllowed((prev) => prev.filter((entry) => entry.email !== email));
      setMessage(`✅ Removed ${email}`);

      // ✅ Notify other components like Navbar
      window.dispatchEvent(new Event("member:changed"));

      setTimeout(() => router.refresh(), 100); // smoother with event propagation
    } else {
      setMessage(`❌ ${result.error || "Failed to delete email"}`);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // ✅ Re-fetch when another component triggers a change
  useEffect(() => {
    const refreshList = async () => {
      try {
        const res = await fetch("/api/alloweduserlist");
        if (!res.ok) throw new Error("Failed to fetch updated list");
        const data = await res.json();
        setAllowed(data);
      } catch (err) {
        console.error("Error refreshing allowed users:", err);
      }
    };

    window.addEventListener("member:changed", refreshList);
    return () => window.removeEventListener("member:changed", refreshList);
  }, []);

  return (
    <>
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      <ul className="list-disc ml-2 mb-4 space-y-3">
        {allowed.map((entry) => (
          <li
            key={entry._id}
            className="flex items-center justify-between border"
          >
            <span className="text-sm">{entry.email}</span>
            <button
              onClick={() => deleteEmail(entry.email)}
              className="ml-4 mr-2 text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
