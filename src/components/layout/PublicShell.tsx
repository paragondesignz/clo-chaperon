"use client";

import { MusicPlayerProvider, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import MiniPlayer from "@/components/music/MiniPlayer";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { activeTrack } = useMusicPlayer();
  return (
    <>
      <main className={activeTrack ? "pb-24" : ""}>{children}</main>
      <MiniPlayer />
    </>
  );
}

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <MusicPlayerProvider>
      <ShellInner>{children}</ShellInner>
    </MusicPlayerProvider>
  );
}
