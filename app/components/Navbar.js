"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // optional: hamburger icons
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setRole(data.role);
      }
    };

    if (session?.user) {
      fetchRole();
    }
  }, [session]);

  useEffect(() => {
    const now = new Date();
    setDateTime(now);
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Corrected: Define toggleMenu properly
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    setLoadingSignOut(true); // Show loading for sign-out
    await signOut(); // Wait for sign-out to complete
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white py-10 px-2 bg-background2 ">
      <div className="flex justify-between items-center">
        {/* Hamburger Button */}
        <div className="ml-4">
          {session?.user && (
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="md:hidden"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          <div className="hidden md:block w-6 h-6" />
        </div>

        {/* Site Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black whitespace-nowrap">
          <Link className={styles.gradientText} href="/">
            SmartShare
          </Link>
          <div className="flex gap-1 mt-2 justify-center">
            {dateTime ? (
              <>
                <p className="mr-5 text-sm text-blue-700">
                  {dateTime.toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-700">
                  {dateTime.toLocaleTimeString()} hr
                </p>
              </>
            ) : (
              <p className="text-sm text-black">Loading time...</p>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 ml-auto mr-10">
          {session?.user && (
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          )}
          {session?.user && (
            <Link href="/blog" className="text-gray-700 hover:text-blue-600">
              Posts
            </Link>
          )}
          {session?.user && (
            <Link
              href="/blog/create"
              className="text-gray-700 hover:text-blue-600"
            >
              Create
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              className="text-gray-700 hover:text-blue-600 font-semibold"
            >
              Admin
            </Link>
          )}
          {session && (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                {session.user.name}
              </span>
              {loadingSignOut ? (
                <div className="flex flex-col items-center justify-center min-h-[50px] mt-1">
                  <p className="text-black text-sm mb-4">
                    Signing out, please wait...
                  </p>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-red-600"></div>
                </div>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Sign Out
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-6">
          {session?.user && (
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
          )}
          {session?.user && (
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Posts
            </Link>
          )}
          {session?.user && (
            <Link
              href="/blog/create"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600"
            >
              Create
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-semibold"
            >
              Admin
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-3 py-2 font-bold rounded hover:bg-red-600"
            >
              {loadingSignOut ? (
                <div className="flex flex-col items-center justify-center min-h-[50px] mt-1">
                  <p className="text-white text-lg">
                    Signing out, please wait...
                  </p>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white mt-4"></div>
                </div>
              ) : (
                "Sign Out"
              )}
            </button>
          ) : (
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center"
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
          )}
        </div>
      </div>
    </nav>
  );
}
