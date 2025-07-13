"use client";
import { useState, useEffect } from "react";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);

  // Fetch submissions and allowedUsers on mount
  useEffect(() => {
    const fetchData = async () => {
      const [subsRes, allowedRes, adminsRes] = await Promise.all([
        fetch("/api/submissions"),
        fetch("/api/alloweduserlist"),
        fetch("/api/admins/list"),
      ]);

      const [subsData, allowedData, adminData] = await Promise.all([
        subsRes.json(),
        allowedRes.json(),
        adminsRes.json(),
      ]);

      setSubmissions(subsData);
      setAllowedEmails(allowedData.map((u) => u.email));
      setAdminEmails(adminData); // ✅ Now safe and private
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus, email, submission) => {
    const name = submission?.name ?? "Unknown User";

    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update submission.");
        return;
      }

      if (newStatus === "given") {
        const addUserRes = await fetch("/api/allowedUsers/addfromrequests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        if (!addUserRes.ok) {
          alert("Failed to add allowed user.");
          return;
        }

        window.dispatchEvent(new Event("member:changed"));

        // update local allowedEmails
        setAllowedEmails((prev) => [...prev, email]);
      }

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status: newStatus } : sub
        )
      );
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const handleDeleteAllowed = async (email, submissionId) => {
    const res = await fetch("/api/allowedUsers/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert(`✅ Removed ${email} from allowed users`);

      // Remove from local allowedEmails
      setAllowedEmails((prev) => prev.filter((e) => e !== email));
      window.dispatchEvent(new Event("member:changed"));

      // 🔁 Patch the submission status to "declined"
      await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "declined" }),
      });

      // Update local submissions state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId ? { ...sub, status: "declined" } : sub
        )
      );
    } else {
      const { error } = await res.json();
      alert(`❌ ${error || "Failed to remove allowed user"}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Access Requests</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm md:text-base">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Justification</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub._id}
                className="border text-sm text-center md:text-base"
              >
                <td className="p-2">{sub.name}</td>
                <td className="p-2">
                  <a
                    href={`mailto:${sub.email}`}
                    className="text-blue-600 underline"
                  >
                    {sub.email}
                  </a>
                </td>
                <td className="p-2">{sub.justification}</td>
                <td className="p-2 font-semibold">{sub.status}</td>
                <td className="p-2 flex flex-col md:flex-row space-y-2 md:space-x-4 justify-center">
                  <button
                    onClick={() =>
                      handleStatusChange(sub._id, "given", sub.email, sub)
                    }
                    className="hover:bg-green-200 transition rounded-full text-lg"
                  >
                    👍
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(sub._id, "declined", sub.email, sub)
                    }
                    className="hover:bg-red-200 transition rounded-full text-lg"
                  >
                    👎🏾
                  </button>

                  {allowedEmails.includes(sub.email) &&
                    !adminEmails.includes(sub.email) && (
                      <button
                        onClick={() => handleDeleteAllowed(sub.email, sub._id)}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        ❌ Remove from allowed
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
