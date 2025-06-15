"use client";

import { useEffect, useState } from "react";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenMessages, setHiddenMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    }

    fetchMessages();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm("");
  const handleHideMessage = (id) => setHiddenMessages([...hiddenMessages, id]);
  const handleUnhideAll = () => setHiddenMessages([]);
  const handleMarkAsDone = (id) => {
    // Add your logic here — maybe trigger an API call or update state
    console.log(`Marked ${id} as done`);
  };

  const filteredMessages = messages.filter((msg) =>
    [msg.fullname, msg.email, msg.message].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
                className="border p-4 rounded-md shadow-sm bg-white"
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
                    className="bg-gray-200 text-black px-3 py-1 rounded-md"
                  >
                    Mark as Done
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
