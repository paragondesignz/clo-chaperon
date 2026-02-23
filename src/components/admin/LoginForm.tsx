"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-[#ddd] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#222] transition-colors"
        />
        <div className="mt-1.5 text-right">
          <Link
            href="/admin/forgot-password"
            className="text-xs text-[#aaa] hover:text-[#222] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2.5 text-sm tracking-wider uppercase transition-opacity hover:opacity-80 disabled:opacity-50 rounded"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
