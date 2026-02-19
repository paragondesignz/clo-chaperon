"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoCard from "@/components/ui/VideoCard";
import VideoModal from "@/components/ui/VideoModal";
import type { VideoItem } from "@/types/content";

interface VideosClientProps {
  items: VideoItem[];
}

export default function VideosClient({ items }: VideosClientProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <SectionHeading
          title="Live Performances"
          subtitle="The Ellington Jazz Club, Perth"
        />

        <div className="max-w-5xl mx-auto grid gap-[30px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {items.map((video) => (
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
