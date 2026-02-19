"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, X, ChevronUp, ChevronDown, ImagePlus, Maximize2 } from "lucide-react";
import SaveButton from "@/components/admin/SaveButton";
import AdminLightbox from "@/components/admin/AdminLightbox";
import type { GallerySection, GalleryImage } from "@/types/content";

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export default function AdminGalleryPage() {
  const [data, setData] = useState<GallerySection | null>(null);
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<GalleryImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content/gallery")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const uploadFile = useCallback(
    async (file: File) => {
      const taskId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setUploads((prev) => [
        ...prev,
        { id: taskId, file, progress: 0, status: "uploading" },
      ]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");
      formData.append("maxWidth", "2000");
      formData.append("maxHeight", "2000");

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
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        const result = await res.json();

        setUploads((prev) =>
          prev.map((u) =>
            u.id === taskId ? { ...u, progress: 100, status: "done" } : u
          )
        );

        const newImage: GalleryImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          src: result.url,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          width: result.width || 600,
          height: result.height || 400,
        };

        setData((prev) =>
          prev ? { ...prev, images: [...prev.images, newImage] } : prev
        );

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
    []
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) uploadFile(file);
      });
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const updateImage = (index: number, patch: Partial<GalleryImage>) => {
    if (!data) return;
    const next = [...data.images];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, images: next });
  };

  const removeImage = (index: number) => {
    if (!data) return;
    setData({ ...data, images: data.images.filter((_, i) => i !== index) });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.images.length) return;
    const next = [...data.images];
    [next[index], next[target]] = [next[target], next[index]];
    setData({ ...data, images: next });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
      </div>
    );
  }

  const activeUploads = uploads.filter((u) => u.status === "uploading");

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#222]">Gallery</h2>
          <p className="text-xs text-[#888] mt-0.5">
            {data.images.length} image{data.images.length !== 1 ? "s" : ""}
            {activeUploads.length > 0 && (
              <span className="text-[#222]">
                {" "}&middot; uploading {activeUploads.length}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-4 py-2 rounded hover:opacity-80 transition-opacity"
        >
          <ImagePlus size={14} />
          Add Images
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 py-10 cursor-pointer ${
          dragOver
            ? "border-[#222] bg-[#f0f0f0] scale-[1.005]"
            : "border-[#ddd] bg-[#fafafa] hover:border-[#bbb] hover:bg-[#f5f5f5]"
        }`}
      >
        <Upload size={28} className="text-[#bbb]" strokeWidth={1.5} />
        <span className="text-sm text-[#888]">
          Drop images here or click to browse
        </span>
        <span className="text-[10px] text-[#bbb]">
          Images are auto-resized and converted to WebP
        </span>
      </div>

      {/* Upload progress indicators */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 text-xs bg-[#fafafa] border border-[#eee] rounded px-3 py-2"
            >
              <span className="text-[#555] truncate flex-1">
                {task.file.name}
              </span>
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

      {/* Image grid */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((image, i) => (
            <div
              key={image.id}
              className="group border border-[#eee] rounded-lg overflow-hidden bg-white"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
                {image.src ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0.2";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                    <ImagePlus size={32} strokeWidth={1} />
                  </div>
                )}

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setLightboxSrc(image)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-[#222]"
                      title="View full size"
                    >
                      <Maximize2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-red-500 hover:bg-red-50"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-[#222] disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === data.images.length - 1}
                      className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#555] hover:text-[#222] disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.width}&times;{image.height}
                  </div>
                </div>
              </div>

              {/* Alt text */}
              <div className="p-2.5">
                <input
                  value={image.alt}
                  onChange={(e) => updateImage(i, { alt: e.target.value })}
                  placeholder="Alt text"
                  className="w-full border border-[#eee] rounded px-2.5 py-1.5 text-xs text-[#222] focus:outline-none focus:border-[#222] transition-colors placeholder:text-[#ccc]"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.images.length === 0 && uploads.length === 0 && (
        <div className="text-center py-12 text-sm text-[#aaa]">
          No images yet. Drop some above to get started.
        </div>
      )}

      <SaveButton onClick={save} />

      {lightboxSrc && (
        <AdminLightbox
          src={lightboxSrc.src}
          alt={lightboxSrc.alt}
          width={lightboxSrc.width}
          height={lightboxSrc.height}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}
