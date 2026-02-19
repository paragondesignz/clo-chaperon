import { NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { getContent } from "@/lib/content";
import { getMediaLibrary, addMediaItem } from "@/lib/media";
import type { MediaItem } from "@/types/media";

const VIDEO_EXTS = ["mp4", "webm", "mov", "avi", "mkv"];

function isVideoUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return VIDEO_EXTS.includes(ext);
}

function filenameFromUrl(url: string): string {
  return url.split("/").pop()?.split("?")[0] ?? "unknown";
}

async function probeBlob(url: string): Promise<{ size: number } | null> {
  try {
    const info = await head(url);
    return { size: info.size };
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const content = await getContent();
    const library = await getMediaLibrary();
    const existingUrls = new Set(library.items.map((i) => i.url));

    const urlEntries: {
      url: string;
      type: "image" | "video";
      width?: number;
      height?: number;
    }[] = [];

    function addUrl(url: string | undefined, type: "image" | "video", width?: number, height?: number) {
      if (!url || url.trim() === "") return;
      if (existingUrls.has(url)) return;
      if (urlEntries.some((e) => e.url === url)) return;
      urlEntries.push({ url, type, width, height });
    }

    const { home, about, gallery, videos, contact } = content;

    addUrl(home.heroImage, "image");
    addUrl(home.quoteImage, "image");
    for (const url of home.imageStrip) addUrl(url, "image");

    addUrl(about.heroImage, "image");
    addUrl(about.midImage, "image");

    for (const img of gallery.images) {
      addUrl(img.src, "image", img.width, img.height);
    }

    for (const vid of videos.items) {
      addUrl(vid.thumbnail, "image");
      if (vid.src) addUrl(vid.src, isVideoUrl(vid.src) ? "video" : "image");
    }

    addUrl(contact.heroImage, "image");

    let added = 0;
    for (const entry of urlEntries) {
      const probe = await probeBlob(entry.url);

      const item: MediaItem = {
        id: `media-sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url: entry.url,
        filename: filenameFromUrl(entry.url),
        type: entry.type,
        width: entry.width,
        height: entry.height,
        size: probe?.size,
        uploadedAt: new Date().toISOString(),
      };

      await addMediaItem(item);
      existingUrls.add(entry.url);
      added++;
    }

    return NextResponse.json({
      message: added > 0
        ? `Synced ${added} file${added !== 1 ? "s" : ""} to media library`
        : "Media library is already up to date",
      added,
      total: library.items.length + added,
    });
  } catch (err) {
    console.error("Media sync error:", err);
    return NextResponse.json(
      { error: "Sync failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
