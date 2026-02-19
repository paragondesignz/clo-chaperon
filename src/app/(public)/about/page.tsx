import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getSection } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export const revalidate = 60;

function PullQuote({ quote, delay = 0 }: { quote: string; delay?: number }) {
  const text = quote.replace(/^[\u201c"]/g, "").replace(/[\u201d"]$/g, "");
  return (
    <AnimatedSection delay={delay}>
      <blockquote className="relative my-16 md:my-20 max-w-2xl mx-auto text-center px-4">
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-7xl text-[#ddd] font-serif leading-none select-none">
          &ldquo;
        </span>
        <p className="text-[#333] text-xl sm:text-2xl leading-relaxed font-light italic">
          {text}
        </p>
        <p className="mt-5 text-[#999] text-sm tracking-[0.15em] uppercase">
          Clo Chaperon
        </p>
      </blockquote>
    </AnimatedSection>
  );
}

export default async function AboutPage() {
  const about = await getSection("about");

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[65vh] min-h-[400px] overflow-hidden">
        <Image
          src={about.heroImage}
          alt="Clo Chaperon"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </section>

      {/* Bio — first group (paragraphs 0–1): childhood & classical */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {about.bioParagraphs.slice(0, 2).map((paragraph, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <p
                className="text-[#333] text-base leading-[1.8] mb-6"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Pull quote 1 — Debussy / colours */}
      <section className="bg-[#f9f9f9] py-8">
        <PullQuote quote={about.pullQuotes[0]} />
      </section>

      {/* Bio — second group (paragraphs 2–3): jazz discovery */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {about.bioParagraphs.slice(2, 4).map((paragraph, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <p
                className="text-[#333] text-base leading-[1.8] mb-6"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Full-width image break */}
      <AnimatedSection>
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={about.midImage}
            alt="Clo Chaperon performing"
            fill
            className="object-cover object-center"
            unoptimized
          />
        </div>
      </AnimatedSection>

      {/* Pull quote 2 — genuineness */}
      <section className="bg-[#f9f9f9] py-8">
        <PullQuote quote={about.pullQuotes[2]} />
      </section>

      {/* Bio — third group (paragraphs 4–6): jazz philosophy & originals */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {about.bioParagraphs.slice(4).map((paragraph, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <p
                className="text-[#333] text-base leading-[1.8] mb-6"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Closing quote */}
      <section className="border-t border-[#eee] py-8">
        <PullQuote quote={about.pullQuotes[3]} />
      </section>
    </>
  );
}
