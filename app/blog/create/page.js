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
        console.log("📤 Preparing to upload image:", imageFile);

        // Step 1: Get signature
        const signRes = await fetch("/api/cloudinary/sign");

        if (!signRes.ok) {
          throw new Error(
            "Failed to fetch signature from /api/cloudinary/sign"
          );
        }

        const { signature, timestamp, apiKey, cloudName, folder } =
          await signRes.json();

        console.log("✅ Signature fetched:", {
          signature,
          timestamp,
          apiKey,
          cloudName,
          folder,
        });

        // Step 2: Prepare FormData
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        // Log the FormData entries
        console.log("📦 FormData being sent to Cloudinary:");
        for (let [key, value] of formData.entries()) {
          if (key === "file") {
            console.log(`${key}:`, value.name); // just log filename for file
          } else {
            console.log(`${key}:`, value);
          }
        }

        // Step 3: Upload to Cloudinary
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        // DEBUG: capture raw response
        const debugText = await cloudinaryRes.text();
        console.log("📨 Cloudinary raw response:", debugText);

        if (!cloudinaryRes.ok) {
          throw new Error(`Cloudinary upload failed: ${debugText}`);
        }

        // Only parse JSON after checking success
        const cloudinaryData = JSON.parse(debugText);
        imageUrl = cloudinaryData.secure_url;
      } catch (err) {
        alert("Image upload failed: " + err.message);
        console.error("Upload error:", err);
        setLoading(false);
        return;
      }
    }

    // Step 4: Submit blog post
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
        console.log("✅ Blog post created");
        router.push("/blog");
        router.refresh();
      } else {
        console.error("❌ Failed to create blog:", await res.text());
        alert("Failed to create blog");
      }
    } catch (err) {
      console.error("❌ Blog submission error:", err);
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
