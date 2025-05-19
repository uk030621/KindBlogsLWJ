"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      setBlog(data);
    };
    if (id) fetchBlog();
  }, [id]);

  if (!blog) return <p className="p-4">Loading blog...</p>;

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
        By {blog.authorName} on {new Date(blog.createdAt).toLocaleString()}
      </p>
      <p className="text-lg">{blog.content}</p>
    </div>
  );
}
