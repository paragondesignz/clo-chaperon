"use client";

import { useState, useEffect, useCallback } from "react";
import SectionCard from "@/components/admin/SectionCard";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { MusicSection, MusicItem } from "@/types/content";

function newMusicItem(): MusicItem {
  return {
    id: String(Date.now()),
    title: "",
    spotifyUrl: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 transition-all placeholder:text-[#ccc]";

export default function AdminMusicPage() {
  const [data, setData] = useState<MusicSection | null>(null);

  useEffect(() => {
    fetch("/api/content/music")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/music", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const updateItem = useCallback(
    (index: number, patch: Partial<MusicItem>) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = [...prev.items];
        next[index] = { ...next[index], ...patch };
        return { ...prev, items: next };
      });
    },
    []
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#222]">Music</h2>
        <p className="text-xs text-[#999] mt-1">
          Spotify tracks and albums. Paste any Spotify URL and it will be embedded automatically.
        </p>
      </div>

      <SectionCard title="Page Settings" description="Heading and subheading shown on the music page.">
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
              Heading
            </label>
            <input
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              placeholder="Music"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
              Subheading
            </label>
            <input
              value={data.subheading}
              onChange={(e) => setData({ ...data, subheading: e.target.value })}
              placeholder="Listen on Spotify"
              className={inputClass}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tracks & Albums" description="Add Spotify tracks or albums to embed.">
        <SortableList
          items={data.items}
          onChange={(items) => setData({ ...data, items })}
          onAdd={() => setData({ ...data, items: [...data.items, newMusicItem()] })}
          addLabel="Add track"
          renderItem={(item, i) => (
            <div className="space-y-3 rounded-lg border border-[#e8e8e8] bg-[#fafafa] p-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="e.g. One More Day"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
                  Spotify URL
                </label>
                <input
                  value={item.spotifyUrl}
                  onChange={(e) => updateItem(i, { spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
                  className={inputClass}
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SaveButton onClick={save} />
    </div>
  );
}
