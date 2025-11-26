"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          The Gray Divide
        </h1>
        <p className="text-gray-300 mb-8">
          A city balanced on the edge of law and crime.
          Build your reputation, manage your heat, and decide which side of the line you stand on.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
          >
            Log in &amp; Continue
          </Link>

          <Link
            href="/auth/sign-up"
            className="px-6 py-3 rounded-lg border border-gray-500 text-gray-200 hover:bg-gray-800 transition"
          >
            Start a New Account
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg border border-green-400 text-green-300 hover:bg-green-400 hover:text-gray-900 transition"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-gray-500 text-sm">
          Tip: If you&apos;re not logged in, the Dashboard button will redirect you to sign in.
        </p>
      </div>
    </main>
  );
}
