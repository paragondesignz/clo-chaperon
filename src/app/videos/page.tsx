"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoCard from "@/components/ui/VideoCard";
import VideoModal from "@/components/ui/VideoModal";
import { VIDEOS } from "@/lib/constants";
import type { Video } from "@/types";

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <SectionHeading
          title="Live Performances"
          subtitle="The Ellington Jazz Club, Perth"
        />

        <div className="max-w-5xl mx-auto grid gap-[30px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              {...video}
              onClick={() => setActiveVideo(video)}
            />
          ))}
        </div>
      </section>

      <VideoModal
        video={activeVideo}
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
