"use client";
import { useState, useEffect } from "react";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      setSubmissions(data);
    };
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id, newStatus, email) => {
    try {
      // Update submission status
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update submission.");
        return;
      }

      // If status is "given", add user to allowedUsers
      if (newStatus === "given") {
        const addUserRes = await fetch("/api/allowedUsers/addfromrequests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!addUserRes.ok) {
          alert("Failed to add allowed user.");
          return;
        }
      }

      // Update local state
      setSubmissions(
        submissions.map((sub) =>
          sub._id === id ? { ...sub, status: newStatus } : sub
        )
      );
    } catch (error) {
      console.error("Error updating submission:", error);
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
              <tr key={sub._id} className="border text-sm md:text-base">
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
                <td className="p-2 flex flex-col md:flex-row space-y-2 md:space-x-2">
                  <button
                    onClick={() =>
                      handleStatusChange(sub._id, "given", sub.email)
                    }
                    className="hover:bg-green-200 transition rounded-full text-lg"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleStatusChange(sub._id, "declined")}
                    className="hover:bg-red-200 transition rounded-full text-lg"
                  >
                    👎🏾
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
