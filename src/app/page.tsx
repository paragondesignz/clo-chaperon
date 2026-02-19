import HeroSection from "@/components/home/HeroSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { PULL_QUOTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Intro Section */}
      <section className="py-24 px-6 bg-background-alt">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-text-primary mb-6">
              The Sound of Stories
            </h2>
            <div className="w-16 h-px bg-accent-gold mx-auto mb-8" />
            <p className="text-text-secondary leading-relaxed text-lg">
              Auckland-based jazz vocalist Clo Chaperon weaves together Mauritian
              heritage, classical training, and the spirit of jazz into
              performances that move and connect. From smoky standards to
              heartfelt originals, every note tells a story.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <blockquote className="relative text-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-accent-gold/30 font-heading">
                &ldquo;
              </div>
              <p className="text-2xl md:text-3xl font-heading font-light leading-relaxed text-text-primary italic px-8">
                {PULL_QUOTES[1].replace(/"/g, "")}
              </p>
              <footer className="mt-6 text-accent-gold text-sm tracking-[0.3em] uppercase">
                — Clo Chaperon
              </footer>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
