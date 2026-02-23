import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getSection } from "@/lib/content";

export const revalidate = 60;

export default async function HomePage() {
  const home = await getSection("home");

  return (
    <>
      <HeroSection heroImage={home.heroImage} />

      {/* Intro */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-[#555] text-lg sm:text-xl leading-relaxed font-light">
              {home.introText}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quote + Image */}
      <section className="bg-[#f9f9f9]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <AnimatedSection className="relative aspect-[4/5] md:aspect-auto md:h-full min-h-[400px]">
            <Image
              src={home.quoteImage}
              alt="Clo Chaperon"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </AnimatedSection>

          <div className="px-8 sm:px-12 md:px-16 py-16 md:py-24">
            <AnimatedSection delay={0.1}>
              <blockquote className="relative">
                <span className="absolute -top-8 -left-2 text-6xl text-[#ddd] font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-[#333] text-xl sm:text-2xl leading-relaxed font-light italic">
                  {home.quoteText}
                </p>
              </blockquote>
              <p className="mt-6 text-[#999] text-sm tracking-[0.15em] uppercase">
                Clo Chaperon
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Story teaser */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-[1.3rem] font-normal tracking-wide text-[#222] mb-6">
              {home.storyTitle}
            </h2>
            {home.storyParagraphs.map((p, i) => (
              <p key={i} className="text-[#555] leading-[1.8] mb-4">
                {p}
              </p>
            ))}
            <Link
              href="/about"
              className="inline-block mt-4 text-sm tracking-[0.1em] uppercase text-[#222] border-b border-[#222] pb-1 hover:text-[#555] hover:border-[#555] transition-colors"
            >
              Read more
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Image strip */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {home.imageStrip.map((src, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <Link href="/gallery" className="block relative aspect-square overflow-hidden group">
                <Image
                  src={src}
                  alt={`Gallery preview ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
