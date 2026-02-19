"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/admin/SectionCard";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { SocialSection, SocialLink } from "@/types/content";

function newLink(): SocialLink {
  return { label: "", href: "", icon: "instagram" };
}

export default function AdminSocialPage() {
  const [data, setData] = useState<SocialSection | null>(null);

  useEffect(() => {
    fetch("/api/content/social")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/social", {
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

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    const next = [...data.links];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, links: next });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#222]">Social Links</h2>
        <p className="text-xs text-[#999] mt-1">
          Links to your social media profiles, shown in the footer.
        </p>
      </div>

      <SectionCard title="Links" description="Add, reorder, or remove your social profiles.">
        <SortableList
          items={data.links}
          onChange={(links) => setData({ ...data, links })}
          onAdd={() => setData({ ...data, links: [...data.links, newLink()] })}
          addLabel="Add link"
          renderItem={(item, i) => (
            <div className="space-y-2.5 rounded-lg border border-[#e8e8e8] bg-[#fafafa] p-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
                    Label
                  </label>
                  <input
                    value={item.label}
                    onChange={(e) => updateLink(i, { label: e.target.value })}
                    placeholder="e.g. Instagram"
                    className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 transition-all placeholder:text-[#ccc]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
                    Icon
                  </label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateLink(i, { icon: e.target.value })}
                    className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 transition-all"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="music">Apple Music</option>
                    <option value="headphones">Spotify</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#bbb] uppercase tracking-wider mb-1">
                  URL
                </label>
                <input
                  value={item.href}
                  onChange={(e) => updateLink(i, { href: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] focus:ring-[3px] focus:ring-[#222]/5 transition-all placeholder:text-[#ccc]"
                />
              </div>
            </div>
          )}
        />
      </SectionCard>

      <SaveButton onClick={save} />
    </div>
  );
}
