import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { BIO_PARAGRAPHS, PULL_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background-alt via-background-alt to-background" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 60%, rgba(201,168,76,0.2) 0%, transparent 60%)",
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-light tracking-wide text-text-primary">
              About
            </h1>
            <div className="mt-4 w-16 h-px bg-accent-gold" />
          </AnimatedSection>
        </div>
      </section>

      {/* Bio */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {BIO_PARAGRAPHS.map((paragraph, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              {/* Insert pull-quote before paragraphs 2 and 5 */}
              {(i === 2 || i === 5) && (
                <blockquote className="my-12 pl-6 border-l-2 border-accent-gold">
                  <p className="text-xl font-heading italic text-text-primary leading-relaxed">
                    {PULL_QUOTES[i === 2 ? 0 : 2]}
                  </p>
                </blockquote>
              )}
              <p
                className="text-text-secondary leading-relaxed text-lg mb-6"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
