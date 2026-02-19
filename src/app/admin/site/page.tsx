"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import SectionCard from "@/components/admin/SectionCard";
import SaveButton from "@/components/admin/SaveButton";
import type { SiteSection } from "@/types/content";

export default function AdminSitePage() {
  const [data, setData] = useState<SiteSection | null>(null);

  useEffect(() => {
    fetch("/api/content/site")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/site", {
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
        <h2 className="text-lg font-semibold text-[#222]">Site Info</h2>
        <p className="text-xs text-[#999] mt-1">
          Global settings that appear across the website.
        </p>
      </div>

      <SectionCard title="Branding" description="Your site name and tagline shown in the header and browser tab.">
        <FormField
          label="Site Name"
          value={data.name}
          onChange={(v) => setData({ ...data, name: v })}
          placeholder="e.g. Clo Chaperon"
        />
        <FormField
          label="Tagline"
          value={data.tagline}
          onChange={(v) => setData({ ...data, tagline: v })}
          hint="A short phrase that appears below the site name."
          placeholder="e.g. Classical Soprano"
        />
      </SectionCard>

      <SectionCard title="SEO & Footer" description="Used for search engines and the website footer.">
        <FormField
          label="Description"
          value={data.description}
          onChange={(v) => setData({ ...data, description: v })}
          multiline
          rows={3}
          hint="This description appears in search engine results."
          maxLength={160}
        />
        <FormField
          label="Copyright"
          value={data.copyright}
          onChange={(v) => setData({ ...data, copyright: v })}
          placeholder="e.g. 2024 Clo Chaperon. All rights reserved."
        />
      </SectionCard>

      <SaveButton onClick={save} />
    </div>
  );
}
