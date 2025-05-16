"use client";

import { useState } from "react";

export default function UserTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");

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
      setMessage(`✅ Role changed to ${newRole}`);
    } else {
      setMessage(result.error || "❌ Error updating role.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded mt-10">
          {message}
        </div>
      )}
      <h2 className="text-lg font-semibold mt-6 mb-2 ">Registered Users</h2>
      <table className="min-w-full border text-sm mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
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
                  className="px-3  py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Make {user.role === "admin" ? "User" : "Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
