"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // ⬅️ Import session

export default function ContactForm() {
  const { data: session } = useSession(); // ⬅️ Grab session
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFullname(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, message }),
    });

    const data = await res.json();
    setResponseMsg(data.msg || []);
    setSuccess(data.success || false);

    if (data.success) {
      setMessage(""); // only reset message so user can send more
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold">Contact Developer</h1>
      <p className="mb-4">Please add your message below</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Your Full Name"
          className="w-full p-2 border rounded"
          readOnly={!!session?.user?.name} // optional: prevent editing
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          readOnly={!!session?.user?.email} // optional: prevent editing
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          className="w-full p-2 border rounded h-32"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {responseMsg.map((msg, idx) => (
          <p
            key={idx}
            className={`text-sm ${success ? "text-green-600" : "text-red-600"}`}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
