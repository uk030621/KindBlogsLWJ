"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, userName }) {
  const [animateImage, setAnimateImage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateImage(true);
    }, 100); // Starts animation shortly after component mounts
  }, []);

  return (
    <div className="mx-auto px-4 py-4 pt-4">
      {isAuthenticated ? (
        <>
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold text-black mt-20">
            Hello {userName}!
          </h1>
          <p className="text-lg text-black mb-3">You&apos;re signed in.</p>
          <Image
            src="/post.jpg"
            alt="Welcome illustration"
            width={200}
            height={200}
            className={`mx-auto mb-6 rounded-full transition-transform duration-700 ease-out ${
              animateImage ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <p className="text-basic text-black mb-3">View and submit posts...</p>
          <p className="text-sm text-black">
            <span className="underline font-bold">Note:</span> You can edit or
            delete your own posts.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg text-black mb-6 mt-20">
            Share your stories and thoughts.
            <br />
            <span>Sign in to get started!</span>
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="ml-4 text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center"
          >
            <Image
              src="/G.png"
              alt="Google logo"
              width={30}
              height={30}
              className="rounded-md mr-2"
            />
            Sign In with Google
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have a Google account?{" "}
            <Link
              href="https://support.google.com/accounts/answer/27441?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <br />
              <span>Create one here</span>
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
