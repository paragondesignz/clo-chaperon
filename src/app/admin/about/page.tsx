"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
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
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">About Page</h2>

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

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">
          Bio Paragraphs
        </label>
        <p className="text-xs text-[#aaa] mb-2">
          HTML tags like &lt;strong&gt; and &lt;em&gt; are supported.
        </p>
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
              className="w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] resize-y transition-colors"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">
          Pull Quotes
        </label>
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
              className="w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] resize-y transition-colors"
            />
          )}
        />
      </div>

      <SaveButton onClick={save} />
    </div>
  );
}
