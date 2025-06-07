"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, authorName }) {
  const [animateImage, setAnimateImage] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false); // Loading for sign-in
  const [loadingSignOut, setLoadingSignOut] = useState(false); // Loading for sign-

  useEffect(() => {
    setTimeout(() => {
      setAnimateImage(true);
    }, 100);
  }, []);

  const handleSignIn = async () => {
    setLoadingSignIn(true); // Show loading for sign-in
    await signIn("google", { callbackUrl: "/" }); // Wait for authentication to complete
  };

  const handleSignOut = async () => {
    setLoadingSignOut(true); // Show loading for sign-out
    await signOut({ callbackUrl: "/" }); // Wait for sign-out to complete
  };

  return (
    <div className="mx-auto px-4 py-4 pt-0">
      {/* Show loading screen when signing in */}
      {loadingSignIn && !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[50px] mt-1">
          <p className="text-black text-lg mb-4">Signing in, please wait...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-700"></div>
        </div>
      ) : loadingSignOut ? (
        /* Show loading screen when signing out */
        <div className="flex flex-col items-center justify-center min-h-[50px] mt-1">
          <p className="text-black text-lg mb-4">Signing out, please wait...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600"></div>
        </div>
      ) : isAuthenticated ? (
        /* Signed-in screen */
        <>
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold text-black mt-1">
            Hello {authorName}!
          </h1>
          <p className="text-lg text-black mb-3">You&apos;re signed in.</p>
          <Image
            src="/post.jpg"
            alt="Welcome illustration"
            className={`mx-auto mb-6 rounded-full transition-transform duration-700 ease-out ${
              animateImage ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            width={200}
            height={200}
            style={{ width: "100%", height: "auto" }}
          />
          <p className="text-basic text-black mb-3">
            Tips & Tales from Your Group.
          </p>
          {/* Sign-Out Button */}
          <button
            onClick={handleSignOut}
            className="mt-4 text-lg px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        /* Sign-in screen */
        <>
          <div className="w-full flex justify-center items-center py-6">
            <Image
              src="/tips-and-tales.jpg" // ✅ Replace with your actual image path
              alt="Tips & Tales - Share your wisdom and stories"
              width={500} // ✅ Adjust width as needed
              height={400} // ✅ Adjust height as needed
              unoptimized // ✅ Disables Next.js optimization
              className="rounded-lg shadow-2xl object-cover max-w-full h-auto "
            />
          </div>

          <div className="flex flex-col items-center justify-center min-h-[50px] w-full">
            <button
              onClick={handleSignIn}
              className="ml-0 text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center mt-6"
            >
              <Image
                src="/G.png"
                alt="Google logo"
                width={80}
                height={80}
                className="rounded-md mr-2"
              />
              Sign In with Google
              <Image
                src="/tips.png"
                alt="tips icon"
                width={80}
                height={80}
                className="rounded-md ml-2"
              />
            </button>
          </div>

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
          </p>

          {/* Dropdown for Tips & Tales Messages & Links */}
          <div className="mt-6">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded"
            >
              {showExamples ? "Hide Guide" : "Guide"}
            </button>

            {showExamples && (
              <div className="mt-4 p-4 border rounded bg-background shadow-lg text-black">
                <p className="text-container">
                  <strong>✨ Got a great hack?</strong> Share the tricks that
                  make life easier—whether it&apos;s mastering productivity,
                  traveling smarter, or navigating challenges.{" "}
                </p>

                <p className="text-container">
                  {" "}
                  <strong>📖 Have a story worth telling?</strong> From funny
                  misadventures to meaningful encounters, let your experiences
                  leave a lasting impact.{" "}
                </p>

                <p className="text-container">
                  Post your <strong>tips</strong> for others to learn from.
                  Share your <strong>tales</strong> for others to relate to.
                  Let’s inspire, laugh, and grow together!{" "}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
