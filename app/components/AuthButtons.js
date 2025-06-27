"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, authorName }) {
  const [animateImage, setAnimateImage] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false); // Loading for sign-in
  const [loadingSignOut, setLoadingSignOut] = useState(false); // Loading for sign-out
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-700"></div>
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
            src="/inclusivity.png"
            alt="Welcome illustration"
            className={`mx-auto mb-6 rounded-full transition-transform duration-700 ease-out ${
              animateImage ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            width={200}
            height={200}
            style={{ width: "100%", height: "auto" }}
            priority
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
          <div className="max-w-xl mx-auto mt-8">
            {/* Dropdown Trigger */}
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-md text-lg font-semibold hover:opacity-90 transition duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Hide Invitation ▲" : "▼ Join Our Benevolent Space 💫"}
            </button>

            {/* Dropdown Content */}
            {isOpen && (
              <div className="mt-4 p-6  shadow-lg rounded-lg border border-gray-200 bg-background">
                <h2 className="text-center leading-snug text-2xl font-semibold text-rose-800">
                  Let’s build a <br />
                  <span className="text-3xl font-bold text-rose-600">
                    “Nice Space”
                  </span>
                  <br />
                  <span className="text-xl text-rose-700">
                    where kindness thrives,
                  </span>
                  <br />
                  <span className="text-xl text-rose-700">
                    connection grows,
                  </span>
                  <br />
                  <span className="italic text-rose-500 text-lg">
                    and everyone feels at home.
                  </span>
                </h2>

                {/* Call to Action Button */}
                <div className="mt-6 text-center">
                  <a
                    href="/request-access"
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Request Access 🚀
                  </a>
                </div>
                <div className="w-full flex justify-center items-center py-6">
                  <Image
                    src="/connections.png" // ✅ Replace with your actual image path
                    alt="Tips & Tales - Share your wisdom and stories"
                    width={300} // ✅ Adjust width as needed
                    height={250} // ✅ Adjust height as needed
                    unoptimized // ✅ Disables Next.js optimization
                    className="rounded-lg shadow-2xl object-cover max-w-full h-auto "
                  />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Hey everyone,
                  <br />
                  <br />I know we all have our go-to apps for staying connected,
                  but I’ve been working on something special—a space designed
                  for exchanging kind and helpful tips, stories, and support in
                  a way that feels intentional and uplifting.
                </p>
                <p className="text-gray-600 mt-3">
                  I’d love for you to help me kickstart this journey. Your
                  engagement would mean the world, not just to test things out
                  but to shape a space where encouragement and positivity come
                  first.
                </p>
                <p className="text-gray-600 mt-3">
                  It’s easy to join using your Gmail address — just fill out the
                  request for access form, and we’ll dive in together. Give it a
                  try, and let’s make something truly valuable for our little
                  circle!
                </p>
                <p className="text-gray-700 mt-4 font-semibold">
                  Thank you for indulging me on this — your presence will make
                  all the difference.
                </p>

                {/* Call to Action Button */}
                <div className="mt-6 text-center">
                  <a
                    href="/request-access"
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Request Access 🚀
                  </a>
                </div>
              </div>
            )}
          </div>

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

          {/*<Link
            className="font-semibold py-4 hover:text-red-600 hover:underline"
            href="/request-access"
          >
            Want to join? - Request Access
          </Link>*/}

          <div className="flex flex-col items-center justify-center min-h-[50px] w-full">
            <button
              onClick={handleSignIn}
              className="ml-0 text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center mt-6"
            >
              <Image
                src="/G.png"
                alt="Google logo"
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
                className="rounded-md mr-2"
              />
              Sign In with Google
              <Image
                src="/tips.png"
                alt="tips icon"
                width={50}
                height={50}
                style={{ width: "auto", height: "auto" }}
                className="rounded-md ml-2"
              />
            </button>
          </div>

          <p className="mt-2 text-base text-gray-600">
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-md text-lg font-semibold hover:opacity-90 transition duration-300"
            >
              {showExamples ? "Hide Advice ▲" : "▼ Friendly Advice 💫"}
              {/*<div className="justify-center items-center flex">
                <Image
                  src="/friendly advice.png"
                  alt="tips icon"
                  width={40}
                  height={40}
                  className="rounded-md ml-2"
                />
              </div>*/}
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
