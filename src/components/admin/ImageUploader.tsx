"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback } from "react";
import { Upload, X, RefreshCw, FolderOpen, Maximize2 } from "lucide-react";
import AdminLightbox from "./AdminLightbox";
import MediaPicker from "./MediaPicker";
import type { MediaItem } from "@/types/media";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onMetadata?: (width: number, height: number) => void;
  maxWidth?: number;
  maxHeight?: number;
  label?: string;
  accept?: string;
  compact?: boolean;
}

function isVideoUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
}

export default function ImageUploader({
  value,
  onChange,
  onMetadata,
  maxWidth = 2000,
  maxHeight = 2000,
  label,
  accept = "image/*",
  compact = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [picker, setPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = accept.startsWith("video") || (value && isVideoUrl(value));
  const hasValue = value && !uploading;

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const fileIsVideo = file.type.startsWith("video/");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileIsVideo ? "video" : "image");
      if (!fileIsVideo) {
        formData.append("maxWidth", String(maxWidth));
        formData.append("maxHeight", String(maxHeight));
      }

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + (90 - prev) * 0.15;
        });
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

        setProgress(100);
        const data = await res.json();
        onChange(data.url);
        if (onMetadata && data.width && data.height) {
          onMetadata(data.width, data.height);
        }

        setTimeout(() => {
          setUploading(false);
          setProgress(0);
        }, 400);
      } catch (err) {
        clearInterval(progressInterval);
        setUploading(false);
        setProgress(0);
        setError(err instanceof Error ? err.message : "Upload failed");
        setTimeout(() => setError(null), 4000);
      }
    },
    [maxWidth, maxHeight, onChange, onMetadata]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      upload(files[0]);
    },
    [upload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const remove = useCallback(() => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  const handlePickerSelect = useCallback(
    (item: MediaItem) => {
      onChange(item.url);
      if (onMetadata && item.width && item.height) {
        onMetadata(item.width, item.height);
      }
      setPicker(false);
    },
    [onChange, onMetadata]
  );

  const pickerFilter = accept.startsWith("video")
    ? "video" as const
    : accept === "image/*"
    ? "image" as const
    : "all" as const;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {hasValue ? (
        <div
          className={`group relative rounded border border-[#eee] overflow-hidden bg-[#f9f9f9] ${
            compact ? "h-28" : "h-48"
          }`}
        >
          {/* Preview: video or image */}
          {isVideoUrl(value) ? (
            <video
              src={value}
              muted
              playsInline
              className="w-full h-full object-cover"
              onLoadedData={(e) => {
                const vid = e.target as HTMLVideoElement;
                vid.currentTime = 1;
              }}
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.3";
              }}
            />
          )}

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="flex items-center gap-1.5 bg-white text-[#222] text-xs font-medium px-2.5 py-1.5 rounded shadow-sm hover:bg-[#f5f5f5] transition-colors"
              title="View full size"
            >
              <Maximize2 size={12} />
              {!compact && "View"}
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-white text-[#222] text-xs font-medium px-2.5 py-1.5 rounded shadow-sm hover:bg-[#f5f5f5] transition-colors"
            >
              <RefreshCw size={12} />
              {!compact && "Replace"}
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 bg-white text-red-500 text-xs font-medium px-2.5 py-1.5 rounded shadow-sm hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              {!compact && "Remove"}
            </button>
          </div>

          {/* Video badge */}
          {isVideoUrl(value) && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
              VIDEO
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Drop zone */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
              compact ? "h-20 px-4" : "h-36 px-6"
            } ${
              dragOver
                ? "border-[#222] bg-[#f5f5f5] scale-[1.01]"
                : "border-[#ddd] bg-[#fafafa] hover:border-[#bbb] hover:bg-[#f5f5f5]"
            } ${uploading ? "pointer-events-none" : ""}`}
          >
            {uploading ? (
              <>
                <div className="w-full max-w-[200px]">
                  <div className="h-1.5 bg-[#eee] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#222] rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#888]">
                  Uploading... {Math.round(progress)}%
                </span>
              </>
            ) : (
              <>
                <Upload
                  size={compact ? 16 : 22}
                  className="text-[#bbb]"
                  strokeWidth={1.5}
                />
                <span
                  className={`text-[#888] text-center leading-tight ${
                    compact ? "text-[10px]" : "text-xs"
                  }`}
                >
                  {compact
                    ? "Drop or click"
                    : isVideo
                    ? "Drop video here or click to browse"
                    : "Drop image here or click to browse"}
                </span>
              </>
            )}
          </div>

          {/* Library button */}
          {!uploading && (
            <button
              type="button"
              onClick={() => setPicker(true)}
              className={`w-full flex items-center justify-center gap-1.5 border border-[#ddd] rounded hover:border-[#bbb] hover:bg-[#f5f5f5] text-[#888] hover:text-[#555] transition-colors ${
                compact ? "py-1 text-[10px]" : "py-1.5 text-xs"
              }`}
            >
              <FolderOpen size={compact ? 11 : 13} />
              Choose from Library
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {lightbox && value && (
        <AdminLightbox src={value} onClose={() => setLightbox(false)} />
      )}

      {picker && (
        <MediaPicker
          filter={pickerFilter}
          onSelect={handlePickerSelect}
          onClose={() => setPicker(false)}
        />
      )}
    </div>
  );
}
