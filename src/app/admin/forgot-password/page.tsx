"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold tracking-wide text-[#222]">
            RESET PASSWORD
          </h1>
          <p className="text-sm text-[#888] mt-1">
            Enter your email to receive a reset link
          </p>
        </div>
        <div className="bg-white border border-[#eee] rounded-lg p-6">
          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#555]">
                If that email is registered, you&apos;ll receive a reset link
                shortly.
              </p>
              <Link
                href="/admin/login"
                className="inline-block text-sm text-[#888] hover:text-[#222] transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#ddd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#222] transition-colors"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2.5 text-sm tracking-wider uppercase transition-opacity hover:opacity-80 disabled:opacity-50 rounded"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <div className="text-center">
                <Link
                  href="/admin/login"
                  className="text-sm text-[#888] hover:text-[#222] transition-colors"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
