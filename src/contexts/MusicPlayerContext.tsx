"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ActiveTrack {
  spotifyUrl: string;
  title: string;
}

interface MusicPlayerContextValue {
  activeTrack: ActiveTrack | null;
  play: (spotifyUrl: string, title: string) => void;
  close: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);

  const play = useCallback((spotifyUrl: string, title: string) => {
    setActiveTrack({ spotifyUrl, title });
  }, []);

  const close = useCallback(() => {
    setActiveTrack(null);
  }, []);

  return (
    <MusicPlayerContext.Provider value={{ activeTrack, play, close }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}
