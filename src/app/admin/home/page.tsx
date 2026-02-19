"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { HomeSection } from "@/types/content";

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
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Home Page</h2>

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
      />

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
      />

      <FormField
        label="Story Title"
        value={data.storyTitle}
        onChange={(v) => setData({ ...data, storyTitle: v })}
      />

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">
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
              className="w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] resize-y transition-colors"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">
          Image Strip
        </label>
        <SortableList
          items={data.imageStrip}
          onChange={(items) => setData({ ...data, imageStrip: items })}
          onAdd={() =>
            setData({ ...data, imageStrip: [...data.imageStrip, ""] })
          }
          addLabel="Add image"
          renderItem={(item, i) => (
            <ImageUploader
              value={item}
              onChange={(url) => {
                const next = [...data.imageStrip];
                next[i] = url;
                setData({ ...data, imageStrip: next });
              }}
              maxWidth={1200}
              maxHeight={800}
              compact
            />
          )}
        />
      </div>

      <SaveButton onClick={save} />
    </div>
  );
}
