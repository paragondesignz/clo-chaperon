"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { Plus, X, Library } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import SectionCard from "@/components/admin/SectionCard";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import MediaPicker from "@/components/admin/MediaPicker";
import type { HomeSection } from "@/types/content";
import type { MediaItem } from "@/types/media";

function ImageStripSection({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");
    formData.append("maxWidth", "1200");
    formData.append("maxHeight", "800");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange([...images, data.url]);
    } catch {
      // Upload failed
    }
    setUploading(false);
  };

  const handlePickerSelect = (item: MediaItem) => {
    onChange([...images, item.url]);
    setShowPicker(false);
  };

  return (
    <SectionCard title="Image Strip" description="A horizontal row of images shown near the bottom of the page.">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) upload(e.target.files[0]);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div
            key={i}
            className="group relative w-24 h-24 rounded-lg overflow-hidden border border-[#eee] bg-[#f5f5f5] flex-shrink-0"
          >
            {url ? (
              <img
                src={url}
                alt={`Strip image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#ccc]">
                Empty
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {/* Add buttons */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-1 text-[#bbb] hover:border-[#aaa] hover:text-[#888] transition-colors flex-shrink-0"
        >
          <Plus size={16} />
          <span className="text-[9px] font-medium">
            {uploading ? "Uploading..." : "Upload"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-1 text-[#bbb] hover:border-[#aaa] hover:text-[#888] transition-colors flex-shrink-0"
        >
          <Library size={16} />
          <span className="text-[9px] font-medium">Library</span>
        </button>
      </div>

      {showPicker && (
        <MediaPicker
          filter="image"
          onSelect={handlePickerSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </SectionCard>
  );
}

export default function AdminHomePage() {
  const [data, setData] = useState<HomeSection | null>(null);

  useEffect(() => {
    fetch("/api/content/home")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/home", {
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#222]">Home Page</h2>
        <p className="text-xs text-[#999] mt-1">
          The first thing visitors see when they arrive.
        </p>
      </div>

      <SectionCard title="Hero" description="The large banner at the top of the home page.">
        <ImageUploader
          label="Hero Image"
          value={data.heroImage}
          onChange={(url) => setData({ ...data, heroImage: url })}
          maxWidth={2400}
          maxHeight={1600}
        />
        <FormField
          label="Intro Text"
          value={data.introText}
          onChange={(v) => setData({ ...data, introText: v })}
          multiline
          rows={3}
          hint="A welcoming paragraph displayed below the hero image."
        />
      </SectionCard>

      <SectionCard title="Quote" description="A featured quote with an accompanying image.">
        <ImageUploader
          label="Quote Image"
          value={data.quoteImage}
          onChange={(url) => setData({ ...data, quoteImage: url })}
          maxWidth={1600}
          maxHeight={1200}
        />
        <FormField
          label="Quote Text"
          value={data.quoteText}
          onChange={(v) => setData({ ...data, quoteText: v })}
          multiline
          rows={3}
          placeholder="Enter the quote..."
        />
      </SectionCard>

      <SectionCard title="Story" description="A short narrative section with a title and paragraphs.">
        <FormField
          label="Story Title"
          value={data.storyTitle}
          onChange={(v) => setData({ ...data, storyTitle: v })}
          placeholder="e.g. My Journey"
        />

        <div>
          <label className="block text-[11px] font-semibold text-[#999] uppercase tracking-wider mb-2">
            Story Paragraphs
          </label>
          <SortableList
            items={data.storyParagraphs}
            onChange={(items) => setData({ ...data, storyParagraphs: items })}
            onAdd={() =>
              setData({
                ...data,
                storyParagraphs: [...data.storyParagraphs, ""],
              })
            }
            addLabel="Add paragraph"
            renderItem={(item, i) => (
              <textarea
                value={item}
                onChange={(e) => {
                  const next = [...data.storyParagraphs];
                  next[i] = e.target.value;
                  setData({ ...data, storyParagraphs: next });
                }}
                rows={3}
                className="w-full rounded-lg border border-[#e0e0e0] px-4 py-3 text-sm text-[#222] leading-relaxed focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 resize-y transition-all placeholder:text-[#ccc]"
                placeholder="Write a paragraph..."
              />
            )}
          />
        </div>
      </SectionCard>

      <ImageStripSection
        images={data.imageStrip}
        onChange={(images) => setData({ ...data, imageStrip: images })}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
