"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButtons({ isAuthenticated, userName }) {
  const [animateImage, setAnimateImage] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateImage(true);
    }, 100);
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
          <p className="text-basic text-black mb-3">
            View and submit &apos;handy&apos; posts...
          </p>
          <p className="text-sm text-black">
            <span className="underline font-bold">Note:</span> You can edit or
            delete your own posts.
          </p>
        </>
      ) : (
        <>
          <p className="text-lg text-black mb-6 mt-20">
            Share your messages and links.
            <br />
            <span>Sign in to get started!</span>
          </p>
          <div className="flex flex-col items-center justify-center min-h-[50px] w-full">
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

          {/* Dropdown for Handy Messages & Links */}
          <div className="mt-6">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded "
            >
              {showExamples ? "Hide Examples" : "Show Examples"}
            </button>

            {showExamples && (
              <div className="mt-4 p-4 border rounded bg-white shadow-lg text-black">
                <h2 className="font-bold text-sm">Handy Messages & Links:</h2>
                <ul className="list-disc pl-5 mt-2 text-xs">
                  <li>
                    🌞 *Morning check-in:* &quot;Hope you all have a great
                    day!&quot;
                  </li>
                  <li>
                    🍽 *Dinner plans:* &quot;Who&apos;s up for Sunday
                    lunch?&quot;
                  </li>
                  <li>
                    ☔ *Weather alerts:* &quot;It&apos;s looking rainy
                    today—don’t forget your umbrellas!&quot;
                  </li>
                  <li>
                    📚 *School & work reminders:* &quot;Reminder: Parent-teacher
                    meeting at 6 PM tonight!&quot;
                  </li>
                  <li>
                    🚦 *Traffic updates:* &quot;Avoid the town center, big
                    accident!&quot;
                  </li>
                  <li>
                    🎭 **Local Events:**{" "}
                    <Link
                      href="https://www.eventbrite.co.uk"
                      className="text-blue-500 hover:underline"
                    >
                      Eventbrite UK
                    </Link>
                  </li>
                  <li>
                    ⛅ **Weather Forecast:**{" "}
                    <Link
                      href="https://www.bbc.co.uk/weather"
                      className="text-blue-500 hover:underline"
                    >
                      BBC Weather
                    </Link>
                  </li>
                  <li>
                    🗓 **Family Calendar:**{" "}
                    <Link
                      href="https://www.google.com/calendar"
                      className="text-blue-500 hover:underline"
                    >
                      Google Calendar
                    </Link>
                  </li>
                  <li>
                    🛒 **Shopping Deals:**{" "}
                    <Link
                      href="https://www.hotukdeals.com"
                      className="text-blue-500 hover:underline"
                    >
                      Hot UK Deals
                    </Link>
                  </li>
                  <li>
                    ⚕ **Emergency Contacts:**{" "}
                    <Link
                      href="https://www.nhs.uk"
                      className="text-blue-500 hover:underline"
                    >
                      NHS Emergency Info
                    </Link>
                  </li>
                  <li>
                    🧠 *Weekly family trivia:* &quot;Who can guess this
                    week&apos;s riddle first?&quot;
                  </li>
                  <li>
                    📸 *Throwback pictures:* &quot;Look at this gem from 10
                    years ago!&quot;
                  </li>
                  <li>
                    📊 *Polls:* &quot;Where should we go for our next family
                    trip? Vote below!&quot;
                  </li>
                  <li>
                    🍝 *Recipe sharing:* &quot;Tried this new pasta
                    dish—here&apos;s the recipe if anyone wants to give it a
                    go!&quot;
                  </li>
                  <li>
                    🎉 *Good news updates:* &quot;Big congratulations to Sam for
                    passing their driving test!&quot;
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
