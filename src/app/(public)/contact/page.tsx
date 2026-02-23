import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ContactForm from "@/components/contact/ContactForm";
import { getSection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
};

export const revalidate = 60;

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  music: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.155-1.07.157-.853.006-1.59-.39-1.986-1.07a1.99 1.99 0 01-.164-1.753c.239-.65.715-1.048 1.37-1.262.352-.115.717-.18 1.08-.244.396-.07.8-.114 1.18-.253.2-.073.37-.193.4-.423.012-.09.014-.18.014-.27V7.37c0-.2-.058-.294-.253-.334l-5.456-1.14c-.255-.053-.31-.015-.334.247-.005.058-.003.118-.003.177v8.636c0 .39-.048.773-.215 1.13-.276.59-.736.972-1.363 1.16-.39.117-.79.17-1.197.168-.733-.004-1.37-.245-1.84-.81-.37-.446-.5-.96-.424-1.52.11-.804.6-1.31 1.326-1.6.358-.14.733-.21 1.108-.283.416-.08.835-.136 1.236-.283.177-.065.336-.166.38-.37.016-.074.022-.15.022-.226V5.27c0-.332.076-.425.403-.348l6.462 1.36c.236.05.35.173.36.42.003.06 0 .12 0 .18v3.23z"/>
    </svg>
  ),
  headphones: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12v7.5c0 1.4 1.1 2.5 2.5 2.5h2c1.4 0 2.5-1.1 2.5-2.5v-4c0-1.4-1.1-2.5-2.5-2.5H2.2C2.9 7.1 7 2.4 12 2.4s9.1 4.7 9.8 10.6h-2.3c-1.4 0-2.5 1.1-2.5 2.5v4c0 1.4 1.1 2.5 2.5 2.5h2c1.4 0 2.5-1.1 2.5-2.5V12c0-6.6-5.4-12-12-12z"/>
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
};

export default async function ContactPage() {
  const [contact, social] = await Promise.all([
    getSection("contact"),
    getSection("social"),
  ]);

  return (
    <>
      {/* Hero strip */}
      <section className="relative h-[65vh] min-h-[400px] overflow-hidden">
        <Image
          src={contact.heroImage}
          alt="Clo Chaperon"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedSection>
            <h1 className="text-white text-3xl sm:text-4xl font-light tracking-[0.15em]">
              {contact.heading}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Intro text */}
      <section className="pt-16 pb-4 px-6">
        <AnimatedSection>
          <p className="max-w-xl mx-auto text-center text-[#555] leading-relaxed">
            {contact.introText}
          </p>
        </AnimatedSection>
      </section>

      {/* Form */}
      <section className="pt-8 pb-20 px-6">
        <ContactForm email={contact.email} />
      </section>

      {/* Social links */}
      <section className="border-t border-[#eee] py-16 px-6">
        <AnimatedSection>
          <p className="text-center text-[#999] text-sm tracking-[0.15em] uppercase mb-6">
            Follow along
          </p>
          <div className="flex justify-center gap-5">
            {social.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-[#888] hover:text-[#222] transition-colors"
              >
                {socialIcons[link.icon]}
              </a>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
