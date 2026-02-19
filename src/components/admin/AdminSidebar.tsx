"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/site", label: "Site Info" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/social", label: "Social Links" },
  { href: "/admin/contact", label: "Contact" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#fafafa] border-r border-[#eee] min-h-screen pt-6 pb-12 px-4 flex flex-col">
      <nav className="flex flex-col gap-1 flex-1">
        {sections.map((s) => {
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
      </nav>
      <Link
        href="/"
        className="mt-4 px-3 py-2 text-sm text-[#888] hover:text-[#222] transition-colors"
        target="_blank"
      >
        View Site &rarr;
      </Link>
    </aside>
  );
}
