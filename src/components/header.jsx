"use client";

import Link from "next/link";
import { useSession, signOut } from "../lib/auth-client";

export default function Header() {
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        Bazar Dor
      </Link>

      <nav className="site-nav">
        <Link href="/">হোম</Link>
        <Link href="/#categories">ক্যাটাগরি</Link>
        <Link href="/#products">পণ্যের দাম</Link>

        {!isPending &&
          (session?.user ? (
            <>
              <span className="user-name">
                {session.user.name || session.user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="nav-button"
              >
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-button nav-button-outline">
                সাইন ইন
              </Link>
              <Link href="/sign-up" className="nav-button">
                অ্যাকাউন্ট তৈরি
              </Link>
            </>
          ))}
      </nav>
    </header>
  );
}