"use client";

import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    }

    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-6 ml-4">Messages from Members</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="border p-4 rounded-md shadow-sm bg-white"
            >
              <p className="font-semibold text-lg">{msg.fullname}</p>
              <p className="text-sm text-gray-500 mb-1">{msg.email}</p>
              <p className="mb-2">{msg.message}</p>
              <p className="text-xs text-gray-400">
                Sent: {new Date(msg.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
}
