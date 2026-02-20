import { NextResponse } from "next/server";
import { put, head } from "@vercel/blob";
import { getContent } from "@/lib/content";
import { getMediaLibrary, addMediaItems } from "@/lib/media";
import type { SiteContent } from "@/types/content";
import type { MediaItem } from "@/types/media";

const BLOB_PATH = "content.json";
const WIX_PATTERN = /https:\/\/static\.wixstatic\.com\/[^\s"')]+/g;

async function migrateImage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = await response.arrayBuffer();

  // Extract a stable filename from the wix URL
  const urlPath = new URL(url).pathname;
  const filename = urlPath.split("/").pop() ?? "image.jpg";
  const blobPath = `images/${filename}`;

  const blob = await put(blobPath, Buffer.from(buffer), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  });

  return blob.url;
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
    const urlMap = new Map<string, string>();
    const errors: string[] = [];

    // Collect all wix image URLs from content
    const wixUrls = new Set<string>();

    function collectUrls(value: unknown) {
      if (typeof value === "string") {
        const matches = value.match(WIX_PATTERN);
        if (matches) matches.forEach((m) => wixUrls.add(m));
      } else if (Array.isArray(value)) {
        value.forEach(collectUrls);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(collectUrls);
      }
    }

    // Scan all image fields
    const { home, about, gallery, videos, contact } = content;

    collectUrls(home.heroImage);
    collectUrls(home.quoteImage);
    collectUrls(home.imageStrip);
    collectUrls(about.heroImage);
    collectUrls(about.midImage);
    collectUrls(gallery.images.map((img) => img.src));
    collectUrls(videos.items.map((v) => v.thumbnail));
    collectUrls(contact.heroImage);

    if (wixUrls.size === 0) {
      return NextResponse.json({
        message: "No wixstatic.com URLs found — nothing to migrate",
        migrated: 0,
      });
    }

    // Download and re-upload each unique image
    for (const url of wixUrls) {
      try {
        const newUrl = await migrateImage(url);
        urlMap.set(url, newUrl);
      } catch (err) {
        errors.push(
          `${url}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // Replace URLs in content (deep string replacement)
    function replaceUrls(value: unknown): unknown {
      if (typeof value === "string") {
        let result = value;
        for (const [oldUrl, newUrl] of urlMap) {
          result = result.replaceAll(oldUrl, newUrl);
        }
        return result;
      }
      if (Array.isArray(value)) {
        return value.map(replaceUrls);
      }
      if (value && typeof value === "object") {
        const obj: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) {
          obj[k] = replaceUrls(v);
        }
        return obj;
      }
      return value;
    }

    const updated = replaceUrls(content) as SiteContent;

    // Save updated content back to blob
    await put(BLOB_PATH, JSON.stringify(updated, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    // Sync migrated images into the media library
    const library = await getMediaLibrary();
    const existingUrls = new Set(library.items.map((i) => i.url));
    const dismissed = new Set(library.dismissedUrls ?? []);

    // Replace old wix URLs in existing media items
    for (const item of library.items) {
      const replacement = urlMap.get(item.url);
      if (replacement) {
        item.url = replacement;
        item.filename = filenameFromUrl(replacement);
      }
    }

    // Also update dismissedUrls to use new blob URLs
    if (library.dismissedUrls) {
      library.dismissedUrls = library.dismissedUrls.map(
        (url) => urlMap.get(url) ?? url
      );
    }

    // Rebuild sets after updates
    const updatedExisting = new Set(library.items.map((i) => i.url));
    const updatedDismissed = new Set(library.dismissedUrls ?? []);

    // Add any migrated images not yet in media library
    const newItems: MediaItem[] = [];
    for (const [, newUrl] of urlMap) {
      if (updatedExisting.has(newUrl) || updatedDismissed.has(newUrl)) continue;
      const probe = await probeBlob(newUrl);
      newItems.push({
        id: `media-migrate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url: newUrl,
        filename: filenameFromUrl(newUrl),
        type: "image",
        size: probe?.size,
        uploadedAt: new Date().toISOString(),
      });
    }

    if (newItems.length > 0) {
      library.items.unshift(...newItems);
    }

    // Write updated media library
    await put("media.json", JSON.stringify(library, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return NextResponse.json({
      message: "Image migration complete",
      migrated: urlMap.size,
      mediasynced: newItems.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Migration failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
