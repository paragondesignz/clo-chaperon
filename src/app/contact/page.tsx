import type { Metadata } from "next";
import { Instagram, Music, Headphones, Facebook } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
};

const iconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  music: Music,
  headphones: Headphones,
  facebook: Facebook,
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-20 px-6">
      <SectionHeading title="Get in Touch" />

      <ContactForm />

      <AnimatedSection className="mt-16 text-center">
        <p className="text-text-secondary text-sm tracking-wider uppercase mb-6">
          Follow along
        </p>
        <div className="flex justify-center gap-6">
          {SOCIAL_LINKS.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-text-secondary hover:text-accent-gold transition-colors"
              >
                <Icon size={22} />
              </a>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}
