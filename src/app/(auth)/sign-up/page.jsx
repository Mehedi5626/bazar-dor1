"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "../../../lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setMessage(result.error.message || "লগইন করা যায়নি।");
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      setMessage("লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold">Sign In</h1>
      <p className="mb-6 text-gray-600">
        আপনার অ্যাকাউন্টে লগইন করুন।
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-3"
            placeholder="আপনার ইমেইল"
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-3"
            placeholder="আপনার পাসওয়ার্ড"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "লগইন হচ্ছে..." : "Sign In"}
        </button>

        {message && (
          <p className="text-sm text-red-600">{message}</p>
        )}
      </form>

      <p className="mt-5 text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/sign-up" className="font-semibold underline">
          Sign Up
        </Link>
      </p>
    </main>
  );
}