"use client";
import { useState } from "react";

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    justification: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Capitalize every word (first, middle, last names)
    const formattedValue =
      name === "name"
        ? value
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : value;

    setFormData({ ...formData, [name]: formattedValue });
  };

  const [requestCount, setRequestCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limit client-side submissions (prevents spamming)
    if (requestCount >= 5) {
      alert("Too many requests! Please wait.");
      return;
    }

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Request submitted successfully!");
      setFormData({ name: "", email: "", justification: "" });
      setRequestCount((prev) => prev + 1); // Increment request counter
      setTimeout(() => setRequestCount(0), 60000); // Reset after 60 seconds
      window.location.href = "/";
    } else {
      alert("Apologies. Submission limit reached. Try again later.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6  shadow-md rounded bg-background">
      <h2 className="text-2xl font-bold text-center mb-4">
        Request Access or{" "}
        <a href="/" className="text-red-500 hover:underline">
          Exit
        </a>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your gmail address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="justification"
          placeholder="Why do you need access?"
          value={formData.justification}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
