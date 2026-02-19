"use client";

import { useState, useEffect, useCallback } from "react";
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

function extractThumbnail(videoUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("error", () => {
      cleanup();
      reject(new Error("Failed to load video for thumbnail"));
    });

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            cleanup();
            if (blob) resolve(blob);
            else reject(new Error("Failed to create thumbnail blob"));
          },
          "image/jpeg",
          0.85
        );
      } catch (err) {
        cleanup();
        reject(err);
      }
    });

    video.src = videoUrl;
  });
}

async function uploadThumbnailBlob(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, "video-thumbnail.jpg");
  formData.append("type", "image");
  formData.append("maxWidth", "800");
  formData.append("maxHeight", "600");

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Thumbnail upload failed");
  const data = await res.json();
  return data.url;
}

export default function AdminVideosPage() {
  const [data, setData] = useState<VideosSection | null>(null);
  const [thumbStatus, setThumbStatus] = useState<Record<string, "generating" | "done" | "error">>({});

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

  const updateItem = useCallback(
    (index: number, patch: Partial<VideoItem>) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = [...prev.items];
        next[index] = { ...next[index], ...patch };
        return { ...prev, items: next };
      });
    },
    []
  );

  const handleVideoUploaded = useCallback(
    async (index: number, videoUrl: string) => {
      if (!videoUrl) return;

      const itemId = data?.items[index]?.id;
      if (!itemId) return;

      setThumbStatus((prev) => ({ ...prev, [itemId]: "generating" }));

      try {
        const blob = await extractThumbnail(videoUrl);
        const thumbUrl = await uploadThumbnailBlob(blob);
        updateItem(index, { thumbnail: thumbUrl });
        setThumbStatus((prev) => ({ ...prev, [itemId]: "done" }));
        setTimeout(() => {
          setThumbStatus((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
          });
        }, 2000);
      } catch {
        setThumbStatus((prev) => ({ ...prev, [itemId]: "error" }));
        setTimeout(() => {
          setThumbStatus((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
          });
        }, 3000);
      }
    },
    [data?.items, updateItem]
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Videos</h2>

      <SortableList
        items={data.items}
        onChange={(items) => setData({ ...data, items })}
        onAdd={() => setData({ ...data, items: [...data.items, newVideo()] })}
        addLabel="Add video"
        renderItem={(item, i) => {
          const status = thumbStatus[item.id];
          return (
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
                <div>
                  <ImageUploader
                    label="Thumbnail"
                    value={item.thumbnail || ""}
                    onChange={(url) => updateItem(i, { thumbnail: url || undefined })}
                    maxWidth={800}
                    maxHeight={600}
                    compact
                  />
                  {status === "generating" && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-3 h-3 border border-[#ddd] border-t-[#222] rounded-full animate-spin" />
                      <span className="text-[10px] text-[#888]">Auto-generating...</span>
                    </div>
                  )}
                  {status === "done" && (
                    <p className="text-[10px] text-green-600 mt-1.5">Thumbnail generated</p>
                  )}
                  {status === "error" && (
                    <p className="text-[10px] text-[#aaa] mt-1.5">Auto-thumbnail failed — upload manually</p>
                  )}
                </div>
                <ImageUploader
                  label="Video File"
                  value={item.src || ""}
                  onChange={(url) => {
                    updateItem(i, { src: url || undefined });
                    if (url) handleVideoUploaded(i, url);
                  }}
                  accept="video/*"
                  compact
                />
              </div>
            </div>
          );
        }}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
