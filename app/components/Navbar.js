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
  const [totalPosts, setTotalPosts] = useState(null);
  const [memberCount, setMemberCount] = useState(null);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const res = await fetch("/api/membershipcount");
        if (res.ok) {
          const data = await res.json();
          const total = data.reduce((sum, user) => sum + user.count, 0);
          setMemberCount(total);
        }
      } catch (err) {
        console.error("Failed to fetch member count", err);
      }
    };

    fetchMemberCount();

    const handleMemberChange = () => {
      console.log("member:changed event received in navbar");
      fetchMemberCount();
    };

    window.addEventListener("member:changed", handleMemberChange);
    return () =>
      window.removeEventListener("member:changed", handleMemberChange);
  }, []);

  useEffect(() => {
    const fetchPostCounts = async () => {
      try {
        const res = await fetch("/api/user-post-counts");
        if (res.ok) {
          const data = await res.json();
          const total = data.reduce((sum, user) => sum + user.count, 0);
          setTotalPosts(total);
        }
      } catch (err) {
        console.error("Failed to fetch post counts", err);
      }
    };

    fetchPostCounts();

    const handleNewPost = () => {
      console.log("post:created event received in navbar");
      fetchPostCounts();
    };

    window.addEventListener("post:created", handleNewPost);
    return () => window.removeEventListener("post:created", handleNewPost);
  }, []);

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
    await signOut({ callbackUrl: "/" }); // Wait for sign-out to complete
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
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black whitespace-nowrap mt-10">
          <Link className={`${styles.gradientText} p-2`} href="/">
            Tips & Tales
          </Link>
          <div className="flex gap-1 mt-2 justify-center">
            {dateTime ? (
              <>
                <p className="mr-5 text-base text-black font-light">
                  {dateTime.toLocaleDateString()}
                </p>
                <p className="text-base text-black font-light">
                  {dateTime.toLocaleTimeString()}hr
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
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600">
                Blog Post Menu ▼
              </button>
              <div className="absolute hidden group-hover:block bg-white border rounded shadow-lg w-[170px]">
                <Link
                  href="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  href="/blog/create"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Create a Post
                </Link>
                <Link
                  href="/blog"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                >
                  View Posts
                  {totalPosts !== null && (
                    <span className="ml-2 text-sm text-white bg-blue-500 px-2 py-0.5 rounded-full">
                      {totalPosts}
                    </span>
                  )}
                </Link>

                <Link
                  href="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Contact Developer
                </Link>
                {role === "admin" && (
                  <Link
                    href="/admin/submissions"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 "
                  >
                    * Requests
                  </Link>
                )}
                <Link
                  href="/alloweduserlist"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                >
                  Members
                  {memberCount !== null && (
                    <span className="ml-2 text-sm text-white bg-green-500 px-2 py-0.5 rounded-full">
                      {memberCount}
                    </span>
                  )}
                </Link>

                {role === "admin" && (
                  <Link
                    href="/message-list"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    * Messages
                  </Link>
                )}
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-semibold"
                  >
                    * Admin
                  </Link>
                )}
              </div>
            </div>
          )}

          {session?.user && (
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600">
                More Options ▼
              </button>
              <div className="absolute hidden group-hover:block bg-white border rounded shadow-lg w-[160px]">
                <a
                  href="https://mediagoog-lwj.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Media Library
                </a>
                <a
                  href="https://stock-portfolio-manager-psi.vercel.app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Stock Portfolio
                </a>
                <a
                  href="https://utility-app-nu.vercel.app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Handy Apps
                </a>
              </div>
            </div>
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
        <h1 className="mt-10 font-bold text-center mb-4">
          {" "}
          <span className={styles.subgradientText}>Blog Post Menu</span>
        </h1>
        <div className="grid grid-cols-2 gap-3 px-6  text-center">
          {session?.user && (
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full"
            >
              Home
            </Link>
          )}
          {session?.user && (
            <Link
              href="/blog/create"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full"
            >
              Create a Post
            </Link>
          )}
          {session?.user && (
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full flex justify-center items-center"
            >
              View Posts
              {totalPosts !== null && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {totalPosts}
                </span>
              )}
            </Link>
          )}
          {session?.user && (
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full"
            >
              Contact Developer
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin/submissions"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full"
            >
              * Requests
            </Link>
          )}
          {session?.user && (
            <Link
              href="/alloweduserlist"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full flex justify-center items-center"
            >
              Members
              {memberCount !== null && (
                <span className="ml-2 text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                  {memberCount}
                </span>
              )}
            </Link>
          )}

          {role === "admin" && (
            <Link
              href="/message-list"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full"
            >
              * Messages
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 bg-blue-200 rounded-full font-semibold"
            >
              * Admin
            </Link>
          )}
        </div>
        <h1 className="mt-8 font-bold text-center">
          <span className={styles.subgradientText}>Other Applications</span>
        </h1>
        <p className="text-sm text-slate-400 text-center mb-3">
          (May require registration or sign-in)
        </p>
        <div className="grid grid-cols-2 gap-3 px-6 text-center ">
          {session?.user && (
            <a
              href="https://mediagoog-lwj.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 bg-pink-200 rounded-full "
            >
              Media Library
            </a>
          )}
          {session?.user && (
            <a
              href="https://stock-portfolio-manager-psi.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 bg-pink-200 rounded-full"
            >
              Stock Portfolio
            </a>
          )}
          {session?.user && (
            <a
              href="https://utility-app-nu.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 bg-pink-200 rounded-full"
            >
              Handy Apps
            </a>
          )}
          <div className="flex justify-center w-full col-span-2">
            {" "}
            {/* ✅ Prevents grid interference */}
            {session ? (
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-2 font-bold rounded hover:bg-red-600 mt-6"
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
                  style={{ width: "auto", height: "auto" }}
                  className="rounded-md mr-2"
                />
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
