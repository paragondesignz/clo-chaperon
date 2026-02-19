import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { BIO_PARAGRAPHS, ABOUT_HERO_IMAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[65vh] min-h-[400px] overflow-hidden">
        <Image
          src={ABOUT_HERO_IMAGE}
          alt="Clo Chaperon"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </section>

      {/* Bio */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {BIO_PARAGRAPHS.map((paragraph, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <p
                className="text-[#333] text-base leading-[1.8] mb-6"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
