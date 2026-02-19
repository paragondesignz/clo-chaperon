import { put, list } from "@vercel/blob";
import type { MediaLibrary, MediaItem } from "@/types/media";

const BLOB_PATH = "media.json";

async function readMedia(): Promise<MediaLibrary> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (blobs.length === 0) return { items: [], dismissedUrls: [] };
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    if (!response.ok) return { items: [], dismissedUrls: [] };
    const data = (await response.json()) as MediaLibrary;
    if (!data.dismissedUrls) data.dismissedUrls = [];
    return data;
  } catch {
    return { items: [], dismissedUrls: [] };
  }
}

async function writeMedia(library: MediaLibrary): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(library, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function getMediaLibrary(): Promise<MediaLibrary> {
  return readMedia();
}

export async function addMediaItem(item: MediaItem): Promise<MediaLibrary> {
  const library = await readMedia();
  library.items.unshift(item);
  await writeMedia(library);
  return library;
}

export async function deleteMediaItem(id: string): Promise<MediaLibrary> {
  const library = await readMedia();
  const item = library.items.find((i) => i.id === id);
  if (item) {
    library.dismissedUrls = library.dismissedUrls ?? [];
    if (!library.dismissedUrls.includes(item.url)) {
      library.dismissedUrls.push(item.url);
    }
  }
  library.items = library.items.filter((i) => i.id !== id);
  await writeMedia(library);
  return library;
}
