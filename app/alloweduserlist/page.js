// app/alloweduserlist/page.js
"use client";
import { useEffect, useState } from "react";

export default function AllowedUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/alloweduserlist")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Allowed Users</h1>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 text-blue-600 hover:underline">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No allowed users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
