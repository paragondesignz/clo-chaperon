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
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getContent(): Promise<SiteContent> {
  const content = await readBlob();
  if (!content) return defaultContent;
  // Merge defaults for any sections missing from stored content
  return { ...defaultContent, ...content };
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

export async function scrubUrl(url: string): Promise<number> {
  const content = await getContent();
  let count = 0;

  // Home: heroImage, quoteImage, imageStrip
  if (content.home.heroImage === url) { content.home.heroImage = ""; count++; }
  if (content.home.quoteImage === url) { content.home.quoteImage = ""; count++; }
  const stripBefore = content.home.imageStrip.length;
  content.home.imageStrip = content.home.imageStrip.filter((u) => u !== url);
  count += stripBefore - content.home.imageStrip.length;

  // About: heroImage, midImage
  if (content.about.heroImage === url) { content.about.heroImage = ""; count++; }
  if (content.about.midImage === url) { content.about.midImage = ""; count++; }

  // Gallery: images
  const galleryBefore = content.gallery.images.length;
  content.gallery.images = content.gallery.images.filter((img) => img.src !== url);
  count += galleryBefore - content.gallery.images.length;

  // Videos: thumbnail and src
  for (const vid of content.videos.items) {
    if (vid.thumbnail === url) { vid.thumbnail = ""; count++; }
    if (vid.src === url) { vid.src = ""; count++; }
  }

  // Contact: heroImage
  if (content.contact.heroImage === url) { content.contact.heroImage = ""; count++; }

  if (count > 0) {
    await writeBlob(content);
  }
  return count;
}

export async function seedContent(): Promise<SiteContent> {
  const exists = await blobExists();
  if (exists) {
    return await getContent();
  }
  await writeBlob(defaultContent);
  return defaultContent;
}
