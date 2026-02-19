import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { BIO_PARAGRAPHS, ABOUT_HERO_IMAGE, PULL_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
};

function PullQuote({ quote, delay = 0 }: { quote: string; delay?: number }) {
  const text = quote.replace(/^"|"$/g, "");
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

      {/* Bio — first group (paragraphs 0–1): childhood & classical */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {BIO_PARAGRAPHS.slice(0, 2).map((paragraph, i) => (
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
        <PullQuote quote={PULL_QUOTES[0]} />
      </section>

      {/* Bio — second group (paragraphs 2–3): jazz discovery */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {BIO_PARAGRAPHS.slice(2, 4).map((paragraph, i) => (
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
        <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
          <Image
            src="https://static.wixstatic.com/media/24c59a_62074006a705402dae2cfa6ff0822844~mv2_d_5040_3360_s_4_2.jpg"
            alt="Clo Chaperon performing"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </AnimatedSection>

      {/* Pull quote 2 — freedom of jazz */}
      <section className="bg-[#f9f9f9] py-8">
        <PullQuote quote={PULL_QUOTES[1]} />
      </section>

      {/* Bio — third group (paragraphs 4–6): jazz philosophy & originals */}
      <section className="py-20 px-6">
        <div className="max-w-[820px] mx-auto">
          {BIO_PARAGRAPHS.slice(4).map((paragraph, i) => (
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
        <PullQuote quote={PULL_QUOTES[2]} />
      </section>
    </>
  );
}
