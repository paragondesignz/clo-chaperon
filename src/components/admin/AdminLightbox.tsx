"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useCallback } from "react";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface AdminLightboxProps {
  src: string;
  alt?: string;
  filename?: string;
  width?: number;
  height?: number;
  size?: number;
  uploadedAt?: string;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isVideoUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
}

export default function AdminLightbox({
  src,
  alt,
  filename,
  width,
  height,
  size,
  uploadedAt,
  onClose,
}: AdminLightboxProps) {
  const [copied, setCopied] = useState(false);
  const isVideo = isVideoUrl(src);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName =
    filename || src.split("/").pop()?.split("?")[0] || "Unknown";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div
        className="flex flex-col lg:flex-row max-w-[90vw] max-h-[90vh] gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media preview */}
        <div className="flex-1 min-w-0 flex items-center justify-center">
          {isVideo ? (
            <video
              src={src}
              controls
              className="max-w-full max-h-[75vh] rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={src}
              alt={alt || displayName}
              className="max-w-full max-h-[75vh] rounded-lg shadow-2xl object-contain"
            />
          )}
        </div>

        {/* Details panel */}
        <div className="lg:w-72 bg-white/10 backdrop-blur rounded-lg p-5 text-white space-y-4 shrink-0 self-start">
          <h3 className="text-sm font-semibold truncate" title={displayName}>
            {displayName}
          </h3>

          <div className="space-y-2.5 text-xs">
            {(width || height) && (
              <div className="flex justify-between">
                <span className="text-white/50">Dimensions</span>
                <span>
                  {width} &times; {height}
                </span>
              </div>
            )}
            {size != null && size > 0 && (
              <div className="flex justify-between">
                <span className="text-white/50">File size</span>
                <span>{formatBytes(size)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/50">Type</span>
              <span className="uppercase">
                {isVideo ? "Video" : src.split("?")[0].split(".").pop()}
              </span>
            </div>
            {uploadedAt && (
              <div className="flex justify-between">
                <span className="text-white/50">Uploaded</span>
                <span>
                  {new Date(uploadedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={copyUrl}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy URL
              </>
            )}
          </button>

          <div className="pt-1">
            <p className="text-[10px] text-white/30 break-all leading-relaxed">
              {src}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
