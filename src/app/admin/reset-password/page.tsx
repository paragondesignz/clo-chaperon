"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-500">
          Invalid reset link. Please request a new one.
        </p>
        <Link
          href="/admin/forgot-password"
          className="inline-block text-sm text-[#888] hover:text-[#222] transition-colors"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-[#555]">
          Your password has been updated successfully.
        </p>
        <Link
          href="/admin/login"
          className="inline-block bg-black text-white py-2.5 px-6 text-sm tracking-wider uppercase transition-opacity hover:opacity-80 rounded"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-[#ddd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#222] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-[#ddd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#222] transition-colors"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2.5 text-sm tracking-wider uppercase transition-opacity hover:opacity-80 disabled:opacity-50 rounded"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold tracking-wide text-[#222]">
            NEW PASSWORD
          </h1>
          <p className="text-sm text-[#888] mt-1">Choose a new password</p>
        </div>
        <div className="bg-white border border-[#eee] rounded-lg p-6">
          <Suspense
            fallback={
              <p className="text-sm text-[#888] text-center">Loading...</p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
