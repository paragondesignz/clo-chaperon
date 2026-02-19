import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Intro */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-[#555] text-lg sm:text-xl leading-relaxed font-light">
              Auckland-based jazz vocalist Clo Chaperon weaves together
              Mauritian heritage, classical training, and the boundless spirit
              of jazz into performances that move and connect.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quote + Image */}
      <section className="bg-[#f9f9f9]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          <AnimatedSection className="relative aspect-[4/5] md:aspect-auto md:h-full min-h-[400px]">
            <Image
              src="https://static.wixstatic.com/media/24c59a_f49a3bfbc224459d90c71c60fcfc3409~mv2.jpg"
              alt="Clo Chaperon"
              fill
              className="object-cover"
              unoptimized
            />
          </AnimatedSection>

          <div className="px-8 sm:px-12 md:px-16 py-16 md:py-24">
            <AnimatedSection delay={0.1}>
              <blockquote className="relative">
                <span className="absolute -top-8 -left-2 text-6xl text-[#ddd] font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-[#333] text-xl sm:text-2xl leading-relaxed font-light italic">
                  I love the freedom that comes with jazz. I love that
                  it&rsquo;ll never be exactly the same on the band stand night
                  after night. Every jazz singer brings their own personality to
                  a song.
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
              The Sound of Stories
            </h2>
            <p className="text-[#555] leading-[1.8] mb-4">
              There&rsquo;s an old Creole proverb: it&rsquo;s the old pot that
              makes the good soup &ndash; our history defines us. From childhood
              memories of Mauritian sega on guitar and ravanne drum, to the
              evocative movements of Debussy, to the freedom of Ella Fitzgerald
              and Miles Davis &ndash; Chaperon&rsquo;s music draws from a rich
              well of influence.
            </p>
            <p className="text-[#555] leading-[1.8] mb-8">
              Her original compositions combine family, history, and a lifetime
              of listening into songs that tell stories people can relate to.
            </p>
            <Link
              href="/about"
              className="inline-block text-sm tracking-[0.1em] uppercase text-[#222] border-b border-[#222] pb-1 hover:text-[#555] hover:border-[#555] transition-colors"
            >
              Read more
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Image strip */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            "https://static.wixstatic.com/media/24c59a_62074006a705402dae2cfa6ff0822844~mv2_d_5040_3360_s_4_2.jpg",
            "https://static.wixstatic.com/media/24c59a_d72de0c6c4f746cda83ac64a885cf6e7~mv2.jpg",
            "https://static.wixstatic.com/media/24c59a_5c83a80a995f4f5e95edbe118bad56ee~mv2.jpg",
            "https://static.wixstatic.com/media/24c59a_17052cfad31440fe985491eba23a2e8e~mv2_d_5760_3840_s_4_2.jpg",
          ].map((src, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <Link href="/gallery" className="block relative aspect-square overflow-hidden group">
                <Image
                  src={src}
                  alt={`Gallery preview ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  );
}
