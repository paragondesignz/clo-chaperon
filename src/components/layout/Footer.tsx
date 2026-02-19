import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <p className="text-center text-sm text-text-secondary tracking-widest">
        {SITE.copyright}
      </p>
    </footer>
  );
}
