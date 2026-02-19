"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";
import { X, Search, Image as ImageIcon, Film, Check } from "lucide-react";
import type { MediaItem } from "@/types/media";

interface MediaPickerProps {
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
  filter?: "image" | "video" | "all";
}

function isVideoUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ["mp4", "webm", "mov", "avi", "mkv"].includes(ext);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPicker({
  onSelect,
  onClose,
  filter = "all",
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">(filter);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.filename.toLowerCase().includes(q);
    }
    return true;
  });

  const handleConfirm = () => {
    const item = items.find((i) => i.id === selected);
    if (item) onSelect(item);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[90vw] max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
          <h2 className="text-sm font-semibold text-[#222]">Media Library</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] text-[#888] hover:text-[#222] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#eee] bg-[#fafafa]">
          <div className="relative flex-1">
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
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-5 h-5 border-2 border-[#ddd] border-t-[#222] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-sm text-[#aaa]">
              {items.length === 0
                ? "No media uploaded yet"
                : "No results found"}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {filtered.map((item) => {
                const isVid = isVideoUrl(item.url);
                const isSelected = selected === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(isSelected ? null : item.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                      isSelected
                        ? "border-[#222] ring-2 ring-[#222]/20"
                        : "border-transparent hover:border-[#ccc]"
                    }`}
                  >
                    {isVid ? (
                      <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center">
                        <Film size={24} className="text-[#bbb]" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 bg-[#222] rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-1.5 pb-1 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white truncate">
                        {item.filename}
                      </p>
                      {item.size != null && item.size > 0 && (
                        <p className="text-[8px] text-white/60">
                          {formatBytes(item.size)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#eee] bg-[#fafafa]">
          <p className="text-xs text-[#888]">
            {filtered.length} file{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-[#888] hover:text-[#222] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected}
              className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-80 disabled:opacity-30 transition-all"
            >
              Insert Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
