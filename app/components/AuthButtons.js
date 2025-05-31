"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, userName }) {
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
    await signOut(); // Wait for sign-out to complete
  };

  return (
    <div className="mx-auto px-4 py-4 pt-4">
      {/* Show loading screen when signing in */}
      {loadingSignIn && !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[50px] mt-20">
          <p className="text-black text-lg mb-4">Signing in, please wait...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-700"></div>
        </div>
      ) : loadingSignOut ? (
        /* Show loading screen when signing out */
        <div className="flex flex-col items-center justify-center min-h-[50px] mt-20">
          <p className="text-black text-lg mb-4">Signing out, please wait...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600"></div>
        </div>
      ) : isAuthenticated ? (
        /* Signed-in screen */
        <>
          <h1 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold text-black mt-20">
            Hello {userName}!
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
            Practical Tips from Your Group.
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
          <p className="text-lg text-black mb-6 mt-20">
            Share your tips, pics, and links.
            <br />
            <span className="text-slate-700 text-sm">
              Sign in below to get started!
            </span>
          </p>

          <div className="flex flex-col items-center justify-center min-h-[50px] w-full">
            <button
              onClick={handleSignIn}
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

          {/* Dropdown for SmartShare Messages & Links */}
          <div className="mt-6">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded"
            >
              {showExamples ? "Hide Examples" : "Show Examples"}
            </button>

            {showExamples && (
              <div className="mt-4 p-4 border rounded bg-white shadow-lg text-black">
                <p className="text-container">
                  🕒{" "}
                  <strong>10 Time-Saving Hacks for Busy Professionals:</strong>{" "}
                  A list of practical tips to boost productivity.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://zeenews.india.com/web-stories/lifestyle/10-time-saving-hacks-for-busy-professionals-2746737"
                    target="_blank"
                  >
                    Examples
                  </a>
                </p>

                <p className="text-container">
                  🦉{" "}
                  <strong>
                    How to Organize Your Workspace for Maximum Efficiency:
                  </strong>{" "}
                  A step-by-step guide to decluttering and optimizing your work
                  environment.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://www.microsoft.com/en-us/microsoft-365-life-hacks/organization/how-to-organize-your-desk-for-maximum-productivity"
                    target="_blank"
                  >
                    Examples
                  </a>
                </p>

                <p className="text-container">
                  💰{" "}
                  <strong>
                    The Best Budgeting Tips for Financial Success:
                  </strong>{" "}
                  A breakdown of smart money management strategies.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://bethebudget.com/budgeting-tips/"
                    target="_blank"
                  >
                    Examples
                  </a>
                </p>

                <p className="text-container">
                  🥗{" "}
                  <strong>
                    Quick and Healthy Meal Prep Ideas for the Week:
                  </strong>{" "}
                  A collection of easy-to-follow meal prep tips.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://www.eatingwell.com/article/7940198/healthy-meal-prep-ideas/"
                    target="_blank"
                  >
                    Examples
                  </a>
                </p>

                <p className="text-container">
                  💻{" "}
                  <strong>
                    Essential Tech Tools to Streamline Your Workflow:
                  </strong>{" "}
                  A curated list of apps and software that enhance productivity.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://www.businesstechweekly.com/apps-and-tools/applications-and-tools/best-workflow-apps/"
                    target="_blank"
                  >
                    Examples
                  </a>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
