"use client";

import type { MusicSection } from "@/types/content";

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === "open.spotify.com") {
      return url.replace("open.spotify.com", "open.spotify.com/embed");
    }
    return url;
  } catch {
    return url;
  }
}

function isAlbum(url: string): boolean {
  return url.includes("/album/");
}

export default function MusicClient({ music }: { music: MusicSection }) {
  if (music.items.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <h1 className="text-3xl font-light tracking-tight text-[#222] mb-3">
          {music.heading}
        </h1>
        <p className="text-[#888] text-sm">{music.subheading}</p>
        <p className="text-[#bbb] text-sm mt-8">No tracks yet — check back soon.</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto pt-32 pb-20 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light tracking-tight text-[#222] mb-3">
          {music.heading}
        </h1>
        <p className="text-[#888] text-sm">{music.subheading}</p>
      </div>

      <div className="space-y-6">
        {music.items.map((item) => (
          <div key={item.id}>
            <iframe
              src={toEmbedUrl(item.spotifyUrl)}
              width="100%"
              height={isAlbum(item.spotifyUrl) ? 352 : 152}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={item.title}
              className="rounded-xl"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
