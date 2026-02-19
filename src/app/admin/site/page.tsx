"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import SaveButton from "@/components/admin/SaveButton";
import type { SiteSection } from "@/types/content";

export default function AdminSitePage() {
  const [data, setData] = useState<SiteSection | null>(null);

  useEffect(() => {
    fetch("/api/content/site").then((r) => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  if (!data) return <p className="text-sm text-[#888]">Loading...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-[#222]">Site Info</h2>
      <FormField label="Site Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
      <FormField label="Tagline" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} />
      <FormField label="Description" value={data.description} onChange={(v) => setData({ ...data, description: v })} multiline />
      <FormField label="Copyright" value={data.copyright} onChange={(v) => setData({ ...data, copyright: v })} />
      <SaveButton onClick={save} />
    </div>
  );
}
