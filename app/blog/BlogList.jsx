"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className=" mx-auto px-4 py-8 ">
      <h1 className="text-2xl font-bold mb-6 text-left text-slate-700 ml-4">
        Posts...
      </h1>

      <div className="mb-6 mr-4">
        <input
          type="text"
          placeholder="Search by title or content..."
          className="w-full px-4 py-2 border rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blog posts found.</p>
      ) : (
        <div className="space-y-6 mr-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 whitespace-pre-wrap break-words">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">
                {blog.content}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                By <span className="font-medium">{blog.userName}</span> on{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </p>

              {(session?.user?.email === blog.userEmail ||
                session?.user?.role === "admin") && (
                <div className="flex space-x-4 mt-2">
                  <Link
                    href={`/blog/${blog._id}/edit`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const confirmed = confirm("Are you sure?");
                      if (!confirmed) return;

                      const res = await fetch(`/api/blogs/${blog._id}`, {
                        method: "DELETE",
                      });

                      if (res.ok) {
                        location.reload();
                      } else {
                        alert("Delete failed");
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
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
