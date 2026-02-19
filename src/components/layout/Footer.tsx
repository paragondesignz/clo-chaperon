import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <p className="text-center text-[0.85rem] text-text-tertiary">
        {SITE.copyright}
      </p>
    </footer>
  );
}
