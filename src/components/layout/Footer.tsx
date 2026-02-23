import Link from "next/link";
import { getSection } from "@/lib/content";

export default async function Footer() {
  const site = await getSection("site");

  return (
    <footer className="border-t border-border py-8">
      <div className="flex items-center justify-center gap-4">
        <p className="text-[0.85rem] text-text-tertiary">
          {site.copyright.replace(/\d{4}/, String(new Date().getFullYear()))}
        </p>
        <Link
          href="/admin"
          className="text-[0.75rem] text-text-tertiary/50 hover:text-text-tertiary transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
