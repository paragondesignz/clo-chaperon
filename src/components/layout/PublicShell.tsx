"use client";

import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import MiniPlayer from "@/components/music/MiniPlayer";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <MusicPlayerProvider>
      <main>{children}</main>
      <MiniPlayer />
    </MusicPlayerProvider>
  );
}
