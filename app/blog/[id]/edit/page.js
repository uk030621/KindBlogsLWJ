// app/blog/[id]/edit/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`/api/blogs/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      } else {
        setError("Failed to load blog");
      }
    }
    fetchBlog();
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/blogs/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: blog.title, content: blog.content }),
    });

    if (res.ok) {
      router.push("/blog");
      router.refresh(); // Refreshes the page
    } else {
      setError("Update failed");
    }
  };

  if (!blog) return <p className="p-4">Loading...</p>;

  return (
    <div className=" mx-auto py-5 px-4 bg-background w-screen h-screen">
      <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="space-y-4 mr-3">
        <input
          type="text"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          className="w-full px-4 py-2 border rounded h-40"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
