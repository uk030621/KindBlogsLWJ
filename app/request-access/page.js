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
  const [showGuidelines, setShowGuidelines] = useState(false); // Toggle dropdown

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
    <div className="max-w-lg mx-auto mt-4 p-6 shadow-lg rounded bg-background">
      <h2 className="text-2xl font-bold text-center mb-4">
        Request Access or{" "}
        <a href="/" className="text-red-500 hover:underline">
          Exit
        </a>
      </h2>

      {/* Community Guidelines Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
        >
          Community Guidelines {showGuidelines ? "▲" : "▼"}
        </button>
        {showGuidelines && (
          <div className=" p-4 bg-gray-100 rounded text-gray-800 text-sm">
            <h3 className="font-bold text-lg mb-2">
              Creating a Safe & Supportive Space
            </h3>
            <p className="mb-2">
              This platform is committed to maintaining a{" "}
              <strong>positive, respectful, and welcoming environment.</strong>
            </p>
            <p className="text-red-500 font-semibold">
              🚫 What is NOT allowed?
            </p>
            <ul className="list-disc ml-6 mb-2">
              <li>Unsavoury, harmful, or toxic content</li>
              <li>Pornographic material</li>
              <li>Hateful, offensive, or damaging interactions</li>
            </ul>
            <p className="text-green-500 font-semibold">
              ✅ What is encouraged?
            </p>
            <ul className="list-disc ml-6">
              <li>Helpful, thoughtful contributions</li>
              <li>Kindness and support for others</li>
              <li>Engagement that uplifts rather than harms</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ⚠️ Violating these principles will result in immediate access
              withdrawal at the discretion of the site/application owner.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              There are no likes, rewards, or incentives — just an opportunity
              to make the world a little kinder. Thank you for helping keep this
              platform safe and meaningful for everyone.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Enter Your Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Your gmail Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="justification"
          placeholder="What inspires you to join our community?"
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
