"use client";

import { useState, useEffect } from "react";
import SaveButton from "@/components/admin/SaveButton";
import SortableList from "@/components/admin/SortableList";
import type { SocialSection, SocialLink } from "@/types/content";

function newLink(): SocialLink {
  return { label: "", href: "", icon: "instagram" };
}

export default function AdminSocialPage() {
  const [data, setData] = useState<SocialSection | null>(null);

  useEffect(() => {
    fetch("/api/content/social").then((r) => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/social", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) return <p className="text-sm text-[#888]">Loading...</p>;

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    const next = [...data.links];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, links: next });
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Social Links</h2>

      <SortableList
        items={data.links}
        onChange={(links) => setData({ ...data, links })}
        onAdd={() => setData({ ...data, links: [...data.links, newLink()] })}
        addLabel="Add link"
        renderItem={(item, i) => (
          <div className="space-y-2 border border-[#eee] rounded p-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={item.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
                placeholder="Label (e.g. Instagram)"
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
              />
              <select
                value={item.icon}
                onChange={(e) => updateLink(i, { icon: e.target.value })}
                className="border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
              >
                <option value="instagram">Instagram</option>
                <option value="music">Apple Music</option>
                <option value="headphones">Spotify</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <input
              value={item.href}
              onChange={(e) => updateLink(i, { href: e.target.value })}
              placeholder="URL"
              className="w-full border border-[#ddd] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#222]"
            />
          </div>
        )}
      />

      <SaveButton onClick={save} />
    </div>
  );
}
