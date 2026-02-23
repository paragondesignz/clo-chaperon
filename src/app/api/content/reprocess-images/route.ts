import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { getContent } from "@/lib/content";
import { getMediaLibrary } from "@/lib/media";
import type { SiteContent } from "@/types/content";

const CONTENT_BLOB = "content.json";
const MEDIA_BLOB = "media.json";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function reprocessImage(
  url: string
): Promise<{ newUrl: string; width: number; height: number; size: number }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());

  const processed = sharp(buffer).resize(2000, 2000, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const webpBuffer = await processed.webp({ quality: 82 }).toBuffer();
  const metadata = await sharp(webpBuffer).metadata();

  const filename = url.split("/").pop()?.split("?")[0] ?? "image";
  const slug = slugify(filename);
  const blobPath = `images/${Date.now()}-${slug}.webp`;

  const blob = await put(blobPath, webpBuffer, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/webp",
  });

  return {
    newUrl: blob.url,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    size: webpBuffer.length,
  };
}

function isAlreadyWebp(url: string): boolean {
  const path = url.split("?")[0];
  return path.endsWith(".webp");
}

export async function POST() {
  try {
    const content = await getContent();
    const urlMap = new Map<string, { newUrl: string; width: number; height: number; size: number }>();
    const errors: string[] = [];

    // Collect all non-webp blob image URLs
    const imageUrls = new Set<string>();

    function collectUrls(value: unknown) {
      if (typeof value === "string" && value.includes("blob.vercel-storage.com") && !isAlreadyWebp(value)) {
        // Only process image-like URLs (skip videos, json, etc.)
        const ext = value.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
        if (["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif"].includes(ext)) {
          imageUrls.add(value);
        }
      } else if (Array.isArray(value)) {
        value.forEach(collectUrls);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(collectUrls);
      }
    }

    collectUrls(content);

    if (imageUrls.size === 0) {
      return NextResponse.json({
        message: "All images are already in WebP format — nothing to reprocess",
        reprocessed: 0,
      });
    }

    // Reprocess each image
    for (const url of imageUrls) {
      try {
        const result = await reprocessImage(url);
        urlMap.set(url, result);
      } catch (err) {
        errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Replace URLs in content
    function replaceUrls(value: unknown): unknown {
      if (typeof value === "string") {
        const replacement = urlMap.get(value);
        if (replacement) return replacement.newUrl;
        return value;
      }
      if (Array.isArray(value)) return value.map(replaceUrls);
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

    // Update gallery image dimensions
    for (const img of updated.gallery.images) {
      const replacement = urlMap.get(img.src) ?? [...urlMap.entries()].find(([, v]) => v.newUrl === img.src)?.[1];
      if (replacement) {
        img.width = replacement.width;
        img.height = replacement.height;
      }
    }

    // Save updated content
    await put(CONTENT_BLOB, JSON.stringify(updated, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    // Update media library entries
    const library = await getMediaLibrary();
    for (const item of library.items) {
      const replacement = urlMap.get(item.url);
      if (replacement) {
        item.url = replacement.newUrl;
        item.filename = item.filename.replace(/\.[^.]+$/, ".webp");
        item.width = replacement.width;
        item.height = replacement.height;
        item.size = replacement.size;
      }
    }

    await put(MEDIA_BLOB, JSON.stringify(library, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return NextResponse.json({
      message: "Image reprocessing complete",
      reprocessed: urlMap.size,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Reprocessing failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
