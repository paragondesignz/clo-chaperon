"use client";

import { useState, useEffect } from "react";
import ImagePreview from "@/components/admin/ImagePreview";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { GallerySection, GalleryImage } from "@/types/content";

function newImage(): GalleryImage {
  return {
    id: `img-${Date.now()}`,
    src: "",
    alt: "",
    width: 600,
    height: 400,
  };
}

export default function AdminGalleryPage() {
  const [data, setData] = useState<GallerySection | null>(null);

  useEffect(() => {
    fetch("/api/content/gallery").then((r) => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) return <p className="text-sm text-[#888]">Loading...</p>;

  const updateImage = (index: number, patch: Partial<GalleryImage>) => {
    const next = [...data.images];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, images: next });
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Gallery</h2>
      <p className="text-xs text-[#888]">{data.images.length} images</p>

      <SortableList
        items={data.images}
        onChange={(images) => setData({ ...data, images })}
        onAdd={() => setData({ ...data, images: [...data.images, newImage()] })}
        addLabel="Add image"
        renderItem={(item, i) => (
          <div className="space-y-2 border border-[#eee] rounded p-3">
            <input
              value={item.src}
              onChange={(e) => updateImage(i, { src: e.target.value })}
              placeholder="Image URL"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            <input
              value={item.alt}
              onChange={(e) => updateImage(i, { alt: e.target.value })}
              placeholder="Alt text"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
            <ImagePreview src={item.src} alt={item.alt} />
          </div>
        )}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
