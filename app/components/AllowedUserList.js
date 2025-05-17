"use client";

import { useState } from "react";

export default function AllowedUsersList({ initialAllowed }) {
  const [allowed, setAllowed] = useState(initialAllowed);
  const [message, setMessage] = useState("");

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
    } else {
      setMessage(`❌ ${result.error || "Failed to delete email"}`);
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      {/*<h2 className="text-xl font-semibold mb-2">Allowed Sign-In Emails</h2>*/}
      <ul className="list-disc ml-2 mb-4 space-y-1">
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
