"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import ImagePreview from "@/components/admin/ImagePreview";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { AboutSection } from "@/types/content";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutSection | null>(null);

  useEffect(() => {
    fetch("/api/content/about").then((r) => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) return <p className="text-sm text-[#888]">Loading...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">About Page</h2>

      <div>
        <FormField label="Hero Image URL" value={data.heroImage} onChange={(v) => setData({ ...data, heroImage: v })} type="url" />
        <ImagePreview src={data.heroImage} />
      </div>

      <div>
        <FormField label="Mid-page Image URL" value={data.midImage} onChange={(v) => setData({ ...data, midImage: v })} type="url" />
        <ImagePreview src={data.midImage} />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">Bio Paragraphs</label>
        <p className="text-xs text-[#aaa] mb-2">HTML tags like &lt;strong&gt; and &lt;em&gt; are supported.</p>
        <SortableList
          items={data.bioParagraphs}
          onChange={(items) => setData({ ...data, bioParagraphs: items })}
          onAdd={() => setData({ ...data, bioParagraphs: [...data.bioParagraphs, ""] })}
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
              className="w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] resize-y"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-2">Pull Quotes</label>
        <SortableList
          items={data.pullQuotes}
          onChange={(items) => setData({ ...data, pullQuotes: items })}
          onAdd={() => setData({ ...data, pullQuotes: [...data.pullQuotes, ""] })}
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
              className="w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] resize-y"
            />
          )}
        />
      </div>

      <SaveButton onClick={save} />
    </div>
  );
}
