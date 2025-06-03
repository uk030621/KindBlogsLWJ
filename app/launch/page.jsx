//app/launch/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LaunchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get("id");

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // ✅ Redirect to actual blog post
      router.replace(`/blog/${postId}`);
    } else {
      // ✅ Redirect to signin
      router.replace("/");
    }
  }, [session, status, postId, router]);

  console.log("🚀 Launch page loaded. Post ID:", postId);

  return <p className="p-4">Redirecting...</p>;
}
