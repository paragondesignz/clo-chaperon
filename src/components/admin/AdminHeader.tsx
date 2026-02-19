"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="h-14 border-b border-[#eee] bg-white flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold tracking-wide text-[#222]">
        ADMIN
      </h1>
      <button
        onClick={handleLogout}
        className="text-sm text-[#888] hover:text-[#222] transition-colors"
      >
        Log out
      </button>
    </header>
  );
}
