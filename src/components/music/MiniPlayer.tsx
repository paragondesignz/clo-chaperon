"use client";

import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { AnimatePresence, motion } from "framer-motion";

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

export default function MiniPlayer() {
  const { activeTrack, close } = useMusicPlayer();

  return (
    <AnimatePresence>
      {activeTrack && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/80 border-t border-black/10 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#222] truncate">
                {activeTrack.title}
              </p>
            </div>
            <div className="w-[300px] sm:w-[400px] shrink-0">
              <iframe
                src={`${toEmbedUrl(activeTrack.spotifyUrl)}?utm_source=generator&theme=0`}
                width="100%"
                height={80}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title={activeTrack.title}
                className="rounded-lg"
              />
            </div>
            <button
              onClick={close}
              className="shrink-0 p-1.5 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close player"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#666]"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
