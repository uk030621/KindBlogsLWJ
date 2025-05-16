"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, userName }) {
  return (
    <div className="mx-auto px-4 py-4 pt-3">
      {isAuthenticated ? (
        <>
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold text-black ">
            Hello {userName}!
          </h1>
          <p className="text-lg text-blac mb-3">You&apos;re signed in.</p>
          <p className="text-basic text-black mb-3">View and submit posts...</p>
          <p className="text-sm text-black">
            <span className="underline font-bold">Note:</span> You can edit or
            delete your own posts.
          </p>
          {/*<button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>*/}
        </>
      ) : (
        <>
          {/*<h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-800 mt-4">
            Welcome to Kind Blogs
          </h1>*/}
          <p className="text-lg text-black mb-6">
            Share your stories and thoughts.
            <br />
            <span>Sign in to get started!</span>
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="ml-4 text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center"
          >
            <Image
              src="/G.png" // Replace with the path to your Google logo
              alt="Google logo"
              width={30} // Set the width of the image
              height={30} // Set the height of the image
              className="rounded-md mr-2"
            />
            Sign In with Google
          </button>
          {/* Friendly Link to Create a Google Account */}
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
