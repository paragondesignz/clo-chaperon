"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback } from "react";
import { Upload, X, RefreshCw } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const isVideo = file.type.startsWith("video/");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", isVideo ? "video" : "image");
      if (!isVideo) {
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

  const hasImage = value && !uploading;

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

      {hasImage ? (
        <div
          className={`group relative rounded border border-[#eee] overflow-hidden bg-[#f9f9f9] ${
            compact ? "h-28" : "h-48"
          }`}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.3";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-white text-[#222] text-xs font-medium px-3 py-1.5 rounded shadow-sm hover:bg-[#f5f5f5] transition-colors"
            >
              <RefreshCw size={13} />
              Replace
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 bg-white text-red-500 text-xs font-medium px-3 py-1.5 rounded shadow-sm hover:bg-red-50 transition-colors"
            >
              <X size={13} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer ${
            compact ? "h-28 px-4" : "h-48 px-6"
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
                size={compact ? 18 : 24}
                className="text-[#bbb]"
                strokeWidth={1.5}
              />
              <span className={`text-[#888] text-center ${compact ? "text-[10px]" : "text-xs"}`}>
                {compact
                  ? "Drop or click"
                  : "Drop image here or click to browse"}
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
