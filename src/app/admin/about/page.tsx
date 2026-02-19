"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import SectionCard from "@/components/admin/SectionCard";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { AboutSection } from "@/types/content";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutSection | null>(null);

  useEffect(() => {
    fetch("/api/content/about")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/about", {
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
        <h2 className="text-lg font-semibold text-[#222]">About Page</h2>
        <p className="text-xs text-[#999] mt-1">
          Tell visitors your story.
        </p>
      </div>

      <SectionCard title="Images" description="The hero banner and a mid-page feature image.">
        <ImageUploader
          label="Hero Image"
          value={data.heroImage}
          onChange={(url) => setData({ ...data, heroImage: url })}
          maxWidth={2400}
          maxHeight={1600}
        />
        <ImageUploader
          label="Mid-page Image"
          value={data.midImage}
          onChange={(url) => setData({ ...data, midImage: url })}
          maxWidth={1600}
          maxHeight={1200}
        />
      </SectionCard>

      <SectionCard
        title="Biography"
        description="Your bio paragraphs. HTML tags like <strong> and <em> are supported."
      >
        <SortableList
          items={data.bioParagraphs}
          onChange={(items) => setData({ ...data, bioParagraphs: items })}
          onAdd={() =>
            setData({
              ...data,
              bioParagraphs: [...data.bioParagraphs, ""],
            })
          }
          addLabel="Add paragraph"
          renderItem={(item, i) => (
            <textarea
              value={item}
              onChange={(e) => {
                const next = [...data.bioParagraphs];
                next[i] = e.target.value;
                setData({ ...data, bioParagraphs: next });
              }}
              rows={4}
              className="w-full rounded-lg border border-[#e0e0e0] px-4 py-3 text-sm text-[#222] leading-relaxed focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 resize-y transition-all placeholder:text-[#ccc]"
              placeholder="Write a paragraph..."
            />
          )}
        />
      </SectionCard>

      <SectionCard title="Pull Quotes" description="Highlighted quotes that break up the biography text.">
        <SortableList
          items={data.pullQuotes}
          onChange={(items) => setData({ ...data, pullQuotes: items })}
          onAdd={() =>
            setData({ ...data, pullQuotes: [...data.pullQuotes, ""] })
          }
          addLabel="Add quote"
          renderItem={(item, i) => (
            <textarea
              value={item}
              onChange={(e) => {
                const next = [...data.pullQuotes];
                next[i] = e.target.value;
                setData({ ...data, pullQuotes: next });
              }}
              rows={2}
              className="w-full rounded-lg border border-[#e0e0e0] px-4 py-3 text-sm text-[#222] italic leading-relaxed focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 resize-y transition-all placeholder:text-[#ccc] placeholder:not-italic"
              placeholder="Enter a quote..."
            />
          )}
        />
      </SectionCard>

      <SaveButton onClick={save} />
    </div>
  );
}
