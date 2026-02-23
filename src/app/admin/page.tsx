import Link from "next/link";

const sections = [
  { href: "/admin/site", label: "Site Info", description: "Name, tagline, description" },
  { href: "/admin/home", label: "Home Page", description: "Hero image, intro text, quotes, image strip" },
  { href: "/admin/about", label: "About Page", description: "Bio paragraphs, pull quotes, images" },
  { href: "/admin/gallery", label: "Photos", description: "Add, remove, and reorder gallery images" },
  { href: "/admin/videos", label: "Videos", description: "Manage video entries" },
  { href: "/admin/music", label: "Music", description: "Manage Spotify track and album embeds" },
  { href: "/admin/social", label: "Social Links", description: "Instagram, Spotify, Facebook, etc." },
  { href: "/admin/contact", label: "Contact Page", description: "Hero image, heading, intro text" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-[#222] mb-6">Content Sections</h2>
      <div className="grid gap-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center justify-between border border-[#eee] rounded-lg px-5 py-4 hover:border-[#ccc] transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-[#222] group-hover:text-black">
                {s.label}
              </p>
              <p className="text-xs text-[#888] mt-0.5">{s.description}</p>
            </div>
            <span className="text-[#ccc] group-hover:text-[#888] transition-colors">
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
