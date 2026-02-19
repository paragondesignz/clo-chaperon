"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import SectionCard from "@/components/admin/SectionCard";
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

      <SectionCard title="Image Strip" description="A horizontal row of images shown near the bottom of the page.">
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
      </SectionCard>

      <SaveButton onClick={save} />
    </div>
  );
}
