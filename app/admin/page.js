"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setMessage("Failed to load users.");
      }
    };
    loadUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });

    const result = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setMessage(`Role changed to ${newRole}`);
    } else {
      setMessage(result.error || "Error updating role.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-2xl font-bold mb-6 text-left text-slate-700 ml-2">
        Admin dashboard...
      </h1>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      <div className="overflow-x-auto mr-3">
        <table className="min-w-full border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      updateRole(
                        user._id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
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
