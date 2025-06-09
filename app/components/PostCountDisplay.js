"use client"; // ✅ Client component

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function PostCountDisplay() {
  const [postCounts, setPostCounts] = useState([]);

  useEffect(() => {
    const fetchPostCounts = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_URL || "http://localhost:3000"; // ✅ Dynamic base URL
        console.log(
          "API Base URL:",
          process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        );
        const response = await fetch(`${apiBaseUrl}/api/user-post-counts`, {
          cache: "no-store",
        });
        const data = await response.json();
        setPostCounts(data);
      } catch (error) {
        console.error("Error fetching post counts:", error);
      }
    };

    fetchPostCounts();
  }, []);

  return (
    <div className="  bg-background mb-6">
      <h2 className="text-lg font-semibold  text-gray-700">User Post Counts</h2>
      <ul className="list-disc pl-4">
        {postCounts.length > 0 ? (
          postCounts.map((user) => (
            <li key={user._id} className="text-gray-600">
              {user._id} - {user.count} posts
            </li>
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </ul>
    </div>
  );
}
