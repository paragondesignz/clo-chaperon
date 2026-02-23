"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const topItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/site", label: "Site Info" },
];

const pageItems = [
  { href: "/admin/home", label: "Home" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/social", label: "Social Links" },
  { href: "/admin/contact", label: "Contact" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isPagesActive = pageItems.some((p) => pathname === p.href);
  const [pagesOpen, setPagesOpen] = useState(isPagesActive);

  return (
    <aside className="w-56 bg-[#fafafa] border-r border-[#eee] min-h-screen pt-6 pb-12 px-4 flex flex-col">
      <nav className="flex flex-col gap-1 flex-1">
        <Link
          href="/"
          className="px-3 py-2 mb-3 text-sm text-[#888] hover:text-[#222] transition-colors"
          target="_blank"
        >
          View Site &rarr;
        </Link>

        {topItems.map((s) => {
          const active = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                active
                  ? "bg-black text-white"
                  : "text-[#555] hover:bg-[#eee]"
              }`}
            >
              {s.label}
            </Link>
          );
        })}

        <button
          onClick={() => setPagesOpen(!pagesOpen)}
          className={`px-3 py-2 rounded text-sm transition-colors text-left flex items-center justify-between ${
            isPagesActive && !pagesOpen
              ? "bg-black text-white"
              : "text-[#555] hover:bg-[#eee]"
          }`}
        >
          Pages
          <span
            className={`text-xs transition-transform ${pagesOpen ? "rotate-90" : ""}`}
          >
            ▸
          </span>
        </button>

        {pagesOpen && (
          <div className="flex flex-col gap-1 ml-3">
            {pageItems.map((s) => {
              const active = pathname === s.href;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    active
                      ? "bg-black text-white"
                      : "text-[#555] hover:bg-[#eee]"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
