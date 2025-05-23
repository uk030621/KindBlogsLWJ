"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [sendEmail, setSendEmail] = useState(true);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  useEffect(() => {
    if (sendEmail) {
      fetch("/api/allowed-users")
        .then((res) => res.json())
        .then((data) => setAllowedUsers(data.emails || []))
        .catch((err) => console.error("Error fetching users", err));
    }
  }, [sendEmail]);

  if (status === "loading") return <p className="p-4">Loading...</p>;
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (imageFile) {
      try {
        setImageLoading(true);
        const signRes = await fetch("/api/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "blog-images" }),
        });

        const { signature, timestamp, apiKey, cloudName, folder } =
          await signRes.json();

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const debugText = await cloudinaryRes.text();

        if (!cloudinaryRes.ok) {
          throw new Error(`Cloudinary upload failed: ${debugText}`);
        }

        const cloudinaryData = JSON.parse(debugText);
        imageUrl = cloudinaryData.secure_url;
      } catch (err) {
        alert("Image upload failed: " + err.message);
        console.error("Upload error:", err);
      } finally {
        setImageLoading(false);
      }
    }

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: session.user.name,
          email: session.user.email,
          imageUrl,
        }),
      });

      if (res.ok) {
        if (sendEmail && selectedRecipients.length > 0) {
          await fetch("/api/email/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              content,
              imageUrl,
              recipients: selectedRecipients,
            }),
          });
        }

        router.push("/blog");
        router.refresh();
      } else {
        alert("Failed to create blog");
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-4 text-slate-700 ml-4">
        Submit a post...
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full px-4 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          className="w-full px-4 py-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="block"
        />
        {imageLoading && (
          <p className="text-sm text-gray-500 bg-green-200 w-fit px-2 py-2">
            Uploading image...
          </p>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
            className="h-4 w-4"
          />
          <span>Send this post to selected allowed users</span>
        </label>

        {sendEmail && allowedUsers.length > 0 && (
          <div className="w-full border p-2 rounded">
            <button
              type="button"
              onClick={() => {
                if (selectedRecipients.length === allowedUsers.length) {
                  setSelectedRecipients([]); // Deselect all
                } else {
                  setSelectedRecipients([...allowedUsers]); // Select all
                }
              }}
              className="mb-2 px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            >
              {selectedRecipients.length === allowedUsers.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {allowedUsers.map((email) => (
              <label key={email} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={email}
                  checked={selectedRecipients.includes(email)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecipients([...selectedRecipients, email]);
                    } else {
                      setSelectedRecipients(
                        selectedRecipients.filter(
                          (recipient) => recipient !== email
                        )
                      );
                    }
                  }}
                  className="h-4 w-4"
                />
                <span>{email}</span>
              </label>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Submit Post"}
        </button>
      </form>
    </div>
  );
}
