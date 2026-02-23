"use client";

import type { MusicSection } from "@/types/content";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

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
  const { activeTrack, play } = useMusicPlayer();

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
        {music.items.map((item) => {
          const isActive = activeTrack?.spotifyUrl === item.spotifyUrl;
          return (
            <div key={item.id} className="relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => play(item.spotifyUrl, item.title)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#555] hover:text-[#1DB954] transition-colors"
                    aria-label={`Play ${item.title} in mini player`}
                  >
                    {isActive ? (
                      <>
                        <span className="flex items-center gap-0.5">
                          <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-pulse" />
                          <span className="w-0.5 h-2 bg-[#1DB954] rounded-full animate-pulse [animation-delay:150ms]" />
                          <span className="w-0.5 h-3.5 bg-[#1DB954] rounded-full animate-pulse [animation-delay:300ms]" />
                        </span>
                        <span className="text-[#1DB954]">Now playing</span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="shrink-0"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
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
          );
        })}
      </div>
    </section>
  );
}
