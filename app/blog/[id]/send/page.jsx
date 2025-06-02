"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function SendPostPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/blogs/${id}`)
        .then((res) => res.json())
        .then(setPost)
        .catch((err) => console.error("Failed to load post", err));

      fetch("/api/allowed-users")
        .then((res) => res.json())
        .then((data) => setAllowedUsers(data.emails || []))
        .catch((err) => console.error("Failed to load users", err));
    }
  }, [id, status]);

  const handleSend = async () => {
    if (!selectedRecipients.length) {
      alert("Select at least one recipient.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/email/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl || "",
          recipients: selectedRecipients,
        }),
      });

      if (res.ok) {
        alert("Post sent successfully.");
        router.push("/blog");
        router.refresh();
      } else {
        alert("Failed to send post.");
      }
    } catch (err) {
      console.error("Email send failed", err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !post) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-slate-700">
        Send: {post.title}
      </h1>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post image"
          className="mb-4 rounded max-h-64 object-cover w-full"
        />
      )}

      <div className="text-gray-800 whitespace-pre-wrap mb-6">
        {post.content}
      </div>

      <div className="border p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Select Recipients:</h2>
        <button
          type="button"
          onClick={() =>
            setSelectedRecipients(
              selectedRecipients.length === allowedUsers.length
                ? []
                : [...allowedUsers]
            )
          }
          className="mb-3 px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
        >
          {selectedRecipients.length === allowedUsers.length
            ? "Deselect All"
            : "Select All"}
        </button>
        {allowedUsers.map((email) => (
          <label key={email} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={selectedRecipients.includes(email)}
              onChange={(e) =>
                setSelectedRecipients((prev) =>
                  e.target.checked
                    ? [...prev, email]
                    : prev.filter((r) => r !== email)
                )
              }
            />
            {email}
          </label>
        ))}
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Sending..." : "Send Post"}
      </button>
    </div>
  );
}
