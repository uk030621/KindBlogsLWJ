"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinkedText from "./components/LinkedText"; // ✅ keep this import only

export default function BlogList({ blogs }) {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/role")
        .then((res) => res.json())
        .then((data) => {
          setIsAdmin(data.role === "admin");
        });
    }
  }, [status]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const lower = searchTerm.toLowerCase();
      const results = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(lower) ||
          blog.content.toLowerCase().includes(lower) ||
          blog.userName.toLowerCase().includes(lower)
      );
      setFilteredBlogs(results);
    }
  }, [searchTerm, blogs]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-700">
        Posts...
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by author, title or content..."
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blog posts found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-4 sm:p-6 border rounded shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 whitespace-pre-wrap break-words">
                {blog.title}
              </h2>

              <LinkedText
                text={blog.content}
                className="text-gray-600 mb-4 whitespace-pre-wrap break-words"
              />

              <p className="text-sm text-gray-500 mb-2">
                By <span className="font-medium">{blog.userName}</span> on{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </p>

              {(session?.user?.email === blog.userEmail || isAdmin) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link
                    href={`/blog/${blog._id}/edit`}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    ✍️ Edit
                  </Link>

                  <button
                    onClick={async () => {
                      if (
                        !confirm("Are you sure you want to delete this post?")
                      )
                        return;

                      const res = await fetch(`/api/blogs/${blog._id}`, {
                        method: "DELETE",
                      });

                      if (res.ok) {
                        location.reload();
                      } else {
                        alert("Delete failed");
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
