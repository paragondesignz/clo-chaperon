"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  Search,
  Image as ImageIcon,
  Film,
  Trash2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import AdminLightbox from "@/components/admin/AdminLightbox";
import type { MediaItem } from "@/types/media";

function isVideoUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const syncAttempted = useRef(false);

  const fetchMedia = useCallback(() => {
    return fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
        return data.items || [];
      })
      .catch(() => {
        setLoading(false);
        return [];
      });
  }, []);

  const runSync = useCallback(async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/media/sync", { method: "POST" });
      const data = await res.json();
      if (data.added > 0) {
        setSyncMsg(`Synced ${data.added} file${data.added !== 1 ? "s" : ""} from site content`);
        fetchMedia();
      } else {
        setSyncMsg("Everything is up to date");
      }
    } catch {
      setSyncMsg("Sync failed");
    }
    setSyncing(false);
    setTimeout(() => setSyncMsg(null), 4000);
  }, [fetchMedia]);

  useEffect(() => {
    fetchMedia().then((mediaItems: MediaItem[]) => {
      if (!syncAttempted.current && mediaItems.length === 0) {
        syncAttempted.current = true;
        runSync();
      }
    });
  }, [fetchMedia, runSync]);

  const uploadFile = useCallback(
    async (file: File) => {
      const taskId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const fileIsVideo = file.type.startsWith("video/");

      setUploads((prev) => [
        ...prev,
        { id: taskId, file, progress: 0, status: "uploading" },
      ]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileIsVideo ? "video" : "image");
      if (!fileIsVideo) {
        formData.append("maxWidth", "2000");
        formData.append("maxHeight", "2000");
      }

      const progressInterval = setInterval(() => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === taskId && u.status === "uploading"
              ? { ...u, progress: Math.min(u.progress + (90 - u.progress) * 0.15, 90) }
              : u
          )
        );
      }, 200);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        clearInterval(progressInterval);

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        setUploads((prev) =>
          prev.map((u) =>
            u.id === taskId ? { ...u, progress: 100, status: "done" } : u
          )
        );

        fetchMedia();

        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.id !== taskId));
        }, 1500);
      } catch (err) {
        clearInterval(progressInterval);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === taskId
              ? {
                  ...u,
                  progress: 0,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : u
          )
        );
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.id !== taskId));
        }, 4000);
      }
    },
    [fetchMedia]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((f) => uploadFile(f));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) return;
    setDeleting(item.id);
    try {
      await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, url: item.url }),
      });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      // Silently handle -- could show error toast
    }
    setDeleting(null);
  };

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (search) {
      return item.filename.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const imageCount = items.filter((i) => i.type === "image").length;
  const videoCount = items.filter((i) => i.type === "video").length;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#222]">Media Library</h2>
          <p className="text-xs text-[#888] mt-0.5">
            {imageCount} image{imageCount !== 1 ? "s" : ""}, {videoCount} video
            {videoCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runSync}
            disabled={syncing}
            className="flex items-center gap-1.5 border border-[#ddd] text-[#555] text-xs font-medium px-3 py-2 rounded hover:border-[#bbb] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
            Sync from Content
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-4 py-2 rounded hover:opacity-80 transition-opacity"
          >
            <Upload size={14} />
            Upload Files
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="flex items-center gap-2 text-xs bg-[#fafafa] border border-[#eee] rounded px-3 py-2">
          {syncing ? (
            <div className="w-3 h-3 border border-[#ddd] border-t-[#222] rounded-full animate-spin" />
          ) : null}
          <span className="text-[#555]">{syncMsg}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border-2 border-dashed border-[#ddd] bg-[#fafafa] hover:border-[#bbb] hover:bg-[#f5f5f5] transition-all duration-200 flex flex-col items-center justify-center gap-2 py-8 cursor-pointer"
      >
        <Upload size={24} className="text-[#bbb]" strokeWidth={1.5} />
        <span className="text-sm text-[#888]">
          Drop images or videos here, or click to browse
        </span>
        <span className="text-[10px] text-[#bbb]">
          Images are auto-resized and converted to WebP
        </span>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 text-xs bg-[#fafafa] border border-[#eee] rounded px-3 py-2"
            >
              <span className="text-[#555] truncate flex-1">{task.file.name}</span>
              {task.status === "uploading" && (
                <div className="w-24 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#222] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              )}
              {task.status === "done" && (
                <span className="text-green-600 font-medium">Done</span>
              )}
              {task.status === "error" && (
                <span className="text-red-500">{task.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#bbb]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#ddd] rounded text-xs text-[#222] focus:outline-none focus:border-[#222] transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "image", "video"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-[#222] text-white"
                  : "text-[#888] hover:bg-[#eee]"
              }`}
            >
              {t === "image" && <ImageIcon size={12} />}
              {t === "video" && <Film size={12} />}
              {t === "all" ? "All" : t === "image" ? "Images" : "Videos"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-[#aaa]">
          {items.length === 0
            ? "No media uploaded yet. Drop some files above to get started."
            : "No files match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((item) => {
            const isVid = isVideoUrl(item.url);
            const isDeleting = deleting === item.id;
            return (
              <div
                key={item.id}
                className={`group relative rounded-lg overflow-hidden border border-[#eee] bg-white transition-opacity ${
                  isDeleting ? "opacity-40" : ""
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-[#f5f5f5] overflow-hidden">
                  {isVid ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film size={32} className="text-[#ccc]" strokeWidth={1} />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-[#222] transition-colors"
                      title="View"
                    >
                      <Maximize2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {isVid && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      VIDEO
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-2.5 py-2 border-t border-[#eee]">
                  <p
                    className="text-[10px] text-[#555] truncate"
                    title={item.filename}
                  >
                    {item.filename}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.width && item.height && (
                      <span className="text-[9px] text-[#aaa]">
                        {item.width}&times;{item.height}
                      </span>
                    )}
                    {item.size != null && item.size > 0 && (
                      <span className="text-[9px] text-[#aaa]">
                        {formatBytes(item.size)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <AdminLightbox
          src={lightboxItem.url}
          filename={lightboxItem.filename}
          width={lightboxItem.width}
          height={lightboxItem.height}
          size={lightboxItem.size}
          uploadedAt={lightboxItem.uploadedAt}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </div>
  );
}
