"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
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
    fetch("/api/content/videos")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
      </div>
    );
  }

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
          <div className="space-y-3 border border-[#eee] rounded-lg p-4">
            <input
              value={item.title}
              onChange={(e) => updateItem(i, { title: e.target.value })}
              placeholder="Title"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222] transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={item.duration}
                onChange={(e) => updateItem(i, { duration: e.target.value })}
                placeholder="Duration (e.g. 1:23)"
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222] transition-colors"
              />
              <input
                value={item.venue || ""}
                onChange={(e) => updateItem(i, { venue: e.target.value })}
                placeholder="Venue"
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222] transition-colors"
              />
            </div>
            <input
              value={item.musicians || ""}
              onChange={(e) => updateItem(i, { musicians: e.target.value })}
              placeholder="Musicians"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222] transition-colors"
            />

            <div className="grid grid-cols-2 gap-3">
              <ImageUploader
                label="Thumbnail"
                value={item.thumbnail || ""}
                onChange={(url) => updateItem(i, { thumbnail: url || undefined })}
                maxWidth={800}
                maxHeight={600}
                compact
              />
              <ImageUploader
                label="Video File"
                value={item.src || ""}
                onChange={(url) => updateItem(i, { src: url || undefined })}
                accept="video/*"
                compact
              />
            </div>
          </div>
        )}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
