"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function BlogDetail() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Blog fetch error:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && id) {
      fetchBlog();
    }
  }, [id, status]);

  if (status === "loading" || loading) {
    return <p className="p-4">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-red-600">
        Blog not found or you don’t have access.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {blog.imageUrl && (
        <a href={blog.imageUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            width={1200}
            height={600}
            className="rounded-lg mb-6 w-full max-h-[500px] object-cover"
          />
        </a>
      )}
      <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600 text-sm mb-4">
        By <span className="font-medium">{blog.authorName || "Unknown"}</span>{" "}
        on{" "}
        {blog.createdAt
          ? new Date(blog.createdAt).toLocaleString()
          : "Unknown date"}
      </p>
      <p className="text-lg whitespace-pre-wrap">{blog.content}</p>
    </div>
  );
}
