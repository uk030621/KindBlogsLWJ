"use client";

import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenMessages, setHiddenMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/contact");
      const data = await res.json();

      const initialized = data.map((msg) => ({
        ...msg,
        done: msg.done ?? false,
      }));

      setMessages(initialized);
      setFilteredMessages(initialized);
      setLoading(false);
    }

    fetchMessages();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = messages.filter((msg) =>
      [msg.fullname, msg.email, msg.message].some((field) =>
        field.toLowerCase().includes(value)
      )
    );

    setFilteredMessages(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredMessages(messages);
  };

  const handleHideMessage = (id) => setHiddenMessages((prev) => [...prev, id]);

  const handleUnhideAll = () => setHiddenMessages([]);

  const handleMarkAsDone = async (id) => {
    const message = messages.find((msg) => msg._id === id);
    const newDoneStatus = !message.done;

    // Optimistic update
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, done: newDoneStatus } : msg
      )
    );

    setFilteredMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, done: newDoneStatus } : msg
      )
    );

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: newDoneStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update status in database.");
      }
    } catch (err) {
      console.error("Error updating done status:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-6 ml-4">Messages</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4 ml-4">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded-md flex-grow"
        />
        <button
          onClick={handleClearSearch}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Clear
        </button>
        <button
          onClick={handleUnhideAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Unhide All
        </button>
      </div>

      {loading ? (
        <p className="ml-4">Loading...</p>
      ) : filteredMessages.length > 0 ? (
        <div className="space-y-4">
          {filteredMessages.map((msg) =>
            hiddenMessages.includes(msg._id) ? null : (
              <div
                key={msg._id}
                className={`border p-4 rounded-md shadow-sm ${
                  msg.done ? "bg-green-100" : "bg-white"
                }`}
              >
                <p className="font-semibold text-lg">{msg.fullname}</p>
                <p className="text-sm text-gray-500 mb-1">{msg.email}</p>
                <p className="mb-2">{msg.message}</p>
                <p className="text-xs text-gray-400">
                  Sent: {new Date(msg.date).toLocaleString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleMarkAsDone(msg._id)}
                    className={`px-3 py-1 rounded-md ${
                      msg.done
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.done ? "Mark as Undone" : "Mark as Done"}
                  </button>
                  <button
                    onClick={() => handleHideMessage(msg._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Hide
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="ml-4">No messages found.</p>
      )}
    </div>
  );
}
