import { put, list } from "@vercel/blob";
import type { MediaLibrary, MediaItem } from "@/types/media";

const BLOB_PATH = "media.json";

async function readMedia(): Promise<MediaLibrary> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (blobs.length === 0) return { items: [] };
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    if (!response.ok) return { items: [] };
    return (await response.json()) as MediaLibrary;
  } catch {
    return { items: [] };
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
  library.items = library.items.filter((item) => item.id !== id);
  await writeMedia(library);
  return library;
}
