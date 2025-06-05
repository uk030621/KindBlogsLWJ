"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        if (!res.ok) throw new Error("Failed to load blog");
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchBlog();
  }, [params.id]);

  const uploadImageToCloudinary = async () => {
    setImageUploading(true);

    try {
      const sigRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "blog-images" }),
      });

      const { timestamp, signature, apiKey, cloudName, folder } =
        await sigRes.json();

      const formData = new FormData();
      formData.append("file", newImage);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const debugText = await res.text();
      if (!res.ok) {
        throw new Error(
          `Image upload failed. A second attempt usually works!: ${debugText}`
        );
      }

      const data = JSON.parse(debugText);
      return data.secure_url;
    } catch (error) {
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let imageUrl = blog.imageUrl;

      if (newImage) {
        imageUrl = await uploadImageToCloudinary();
      }

      const res = await fetch(`/api/blogs/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/blog");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!blog) return <p className="p-4">Loading...</p>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 mt-1">
      <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          placeholder="Title"
        />

        <textarea
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          className="w-full px-4 py-2 border rounded h-40"
          placeholder="Content"
        />

        {blog.imageUrl && (
          <div>
            <p className="font-medium">Current Image:</p>
            <div className="relative w-[400px] h-[250px] mt-2">
              <a href={blog.imageUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={blog.imageUrl}
                  alt="Current Blog Image"
                  fill
                  className="rounded shadow object-cover"
                />
              </a>
            </div>
          </div>
        )}

        <div>
          <label className="block font-medium">Change Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            className="mt-2"
          />
          {newImage && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {newImage.name}
            </p>
          )}
        </div>

        {imageUploading && (
          <p className="text-sm text-gray-500 bg-green-200 w-fit px-2 py-2">
            Uploading image...
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={uploading}
        >
          {uploading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
