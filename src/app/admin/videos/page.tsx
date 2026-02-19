"use client";

import { useState, useEffect } from "react";
import ImagePreview from "@/components/admin/ImagePreview";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { VideosSection, VideoItem } from "@/types/content";

function newVideo(): VideoItem {
  return {
    id: String(Date.now()),
    title: "",
    duration: "0:00",
    venue: "",
    musicians: "",
  };
}

export default function AdminVideosPage() {
  const [data, setData] = useState<VideosSection | null>(null);

  useEffect(() => {
    fetch("/api/content/videos").then((r) => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) return <p className="text-sm text-[#888]">Loading...</p>;

  const updateItem = (index: number, patch: Partial<VideoItem>) => {
    const next = [...data.items];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, items: next });
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Videos</h2>

      <SortableList
        items={data.items}
        onChange={(items) => setData({ ...data, items })}
        onAdd={() => setData({ ...data, items: [...data.items, newVideo()] })}
        addLabel="Add video"
        renderItem={(item, i) => (
          <div className="space-y-2 border border-[#eee] rounded p-3">
            <input
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              placeholder="Title"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={item.duration}
                onChange={(e) => updateItem(i, { duration: e.target.value })}
                placeholder="Duration (e.g. 1:23)"
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
              />
              <input
                value={item.venue || ""}
                onChange={(e) => updateItem(i, { venue: e.target.value })}
                placeholder="Venue"
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
              />
            </div>
            <input
              value={item.src || ""}
              onChange={(e) => updateItem(i, { src: e.target.value || undefined })}
              placeholder="Video file path (leave empty for 'Coming soon')"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            <input
              value={item.thumbnail || ""}
              onChange={(e) => updateItem(i, { thumbnail: e.target.value || undefined })}
              placeholder="Thumbnail URL"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            <input
              value={item.musicians || ""}
              onChange={(e) => updateItem(i, { musicians: e.target.value })}
              placeholder="Musicians"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            {item.thumbnail && <ImagePreview src={item.thumbnail} />}
          </div>
        )}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
