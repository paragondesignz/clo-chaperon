"use client";

import { useState, useEffect } from "react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import SaveButton from "@/components/admin/SaveButton";
import type { ContactSection } from "@/types/content";

export default function AdminContactPage() {
  const [data, setData] = useState<ContactSection | null>(null);

  useEffect(() => {
    fetch("/api/content/contact")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    await fetch("/api/content/contact", {
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
      <h2 className="text-lg font-semibold text-[#222]">Contact Page</h2>

      <ImageUploader
        label="Hero Image"
        value={data.heroImage}
        onChange={(url) => setData({ ...data, heroImage: url })}
        maxWidth={2400}
        maxHeight={1600}
      />

      <FormField
        label="Heading"
        value={data.heading}
        onChange={(v) => setData({ ...data, heading: v })}
      />
      <FormField
        label="Intro Text"
        value={data.introText}
        onChange={(v) => setData({ ...data, introText: v })}
        multiline
        rows={3}
      />
      <FormField
        label="Contact Email"
        value={data.email}
        onChange={(v) => setData({ ...data, email: v })}
        type="email"
      />

      <SaveButton onClick={save} />
    </div>
  );
}
