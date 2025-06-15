"use client";

import { useState } from "react";

export default function ContactForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState([]);
  const [success, setSuccess] = useState(false);

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
      setFullname("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <h1 className="text-3xl font-bold">Contact Developer</h1>
      <p className="mb-4">Please fill in the form below</p>
      {/*<h2 className="text-2xl font-bold mb-4">Contact Us</h2>*/}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
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
