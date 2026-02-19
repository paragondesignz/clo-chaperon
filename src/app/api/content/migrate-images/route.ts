import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getContent } from "@/lib/content";
import type { SiteContent } from "@/types/content";

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

    return NextResponse.json({
      message: "Image migration complete",
      migrated: urlMap.size,
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
