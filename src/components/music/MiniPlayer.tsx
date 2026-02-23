"use client";

import { useState } from "react";
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
  const [expanded, setExpanded] = useState(true);

  return (
    <AnimatePresence>
      {activeTrack && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed bottom-5 right-5 z-40"
        >
          {expanded ? (
            <div className="w-[300px] rounded-2xl shadow-xl backdrop-blur-xl bg-white/90 border border-black/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="flex items-center gap-0.5 shrink-0">
                  <span className="w-0.5 h-2.5 bg-[#1DB954] rounded-full animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-pulse [animation-delay:300ms]" />
                </span>
                <p className="text-xs font-medium text-[#222] truncate flex-1">
                  {activeTrack.title}
                </p>
                <button
                  onClick={() => setExpanded(false)}
                  className="shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Minimize player"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#999]">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button
                  onClick={close}
                  className="shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close player"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#999]">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {/* Embed */}
              <iframe
                src={`${toEmbedUrl(activeTrack.spotifyUrl)}?utm_source=generator&theme=0`}
                width="100%"
                height={80}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title={activeTrack.title}
              />
            </div>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="w-12 h-12 rounded-full shadow-lg backdrop-blur-xl bg-white/90 border border-black/5 flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Expand player"
            >
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2.5 bg-[#1DB954] rounded-full animate-pulse" />
                <span className="w-0.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-pulse [animation-delay:300ms]" />
              </span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
