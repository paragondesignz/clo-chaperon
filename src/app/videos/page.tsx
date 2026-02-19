import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoCard from "@/components/ui/VideoCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { VIDEOS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Videos",
};

export default function VideosPage() {
  return (
    <section className="pt-32 pb-20 px-6">
      <SectionHeading
        title="Live Performances"
        subtitle="The Ellington Jazz Club, Perth"
      />

      <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-text-secondary">
          <span className="text-text-primary">Clo Chaperon</span> (vocals) &middot;{" "}
          <span className="text-text-primary">Brodie Stewart</span> (piano) &middot;{" "}
          <span className="text-text-primary">Nick Abbey</span> (bass) &middot;{" "}
          <span className="text-text-primary">Michael Perkins</span> (drums)
        </p>
      </AnimatedSection>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEOS.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </section>
  );
}
