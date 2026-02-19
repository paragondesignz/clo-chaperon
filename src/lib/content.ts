import { put, head, list } from "@vercel/blob";
import { defaultContent } from "./content-defaults";
import type { SiteContent, SectionKey } from "@/types/content";

const BLOB_PATH = "content.json";

async function blobExists(): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    return blobs.length > 0;
  } catch {
    return false;
  }
}

async function readBlob(): Promise<SiteContent | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (blobs.length === 0) return null;
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as SiteContent;
  } catch {
    return null;
  }
}

async function writeBlob(content: SiteContent): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function getContent(): Promise<SiteContent> {
  const content = await readBlob();
  return content ?? defaultContent;
}

export async function getSection<K extends SectionKey>(
  key: K
): Promise<SiteContent[K]> {
  const content = await getContent();
  return content[key];
}

export async function updateSection<K extends SectionKey>(
  key: K,
  data: SiteContent[K]
): Promise<SiteContent> {
  const content = await getContent();
  const updated = { ...content, [key]: data };
  await writeBlob(updated);
  return updated;
}

export async function seedContent(): Promise<SiteContent> {
  const exists = await blobExists();
  if (exists) {
    return await getContent();
  }
  await writeBlob(defaultContent);
  return defaultContent;
}
