"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
        // Step 1: Get signature and credentials from your API route
        const signRes = await fetch("/api/cloudinary/sign");
        const { signature, timestamp, apiKey, cloudName, folder } =
          await signRes.json();

        // Step 2: Prepare FormData for direct Cloudinary upload
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        // Step 3: Upload directly to Cloudinary
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");

        const cloudinaryData = await cloudinaryRes.json();
        imageUrl = cloudinaryData.secure_url;
      } catch (err) {
        alert("Image upload failed: " + err.message);
        setLoading(false);
        return;
      }
    }

    // Step 4: Submit blog post with uploaded image URL
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
      router.push("/blog");
      router.refresh();
    } else {
      alert("Failed to create blog");
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
