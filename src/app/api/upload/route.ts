import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { addMediaItem } from "@/lib/media";
import type { MediaItem } from "@/types/media";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const type = (formData.get("type") as string) || "image";
    const buffer = Buffer.from(await file.arrayBuffer());
    const slug = slugify(file.name);
    const timestamp = Date.now();

    if (type === "video") {
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const blobPath = `videos/${timestamp}-${slug}.${ext}`;
      const blob = await put(blobPath, buffer, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: file.type || "video/mp4",
      });

      const mediaItem: MediaItem = {
        id: `media-${timestamp}-${Math.random().toString(36).slice(2, 6)}`,
        url: blob.url,
        filename: file.name,
        type: "video",
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
      };
      await addMediaItem(mediaItem);

      return NextResponse.json({ url: blob.url, mediaId: mediaItem.id });
    }

    const maxWidth = parseInt((formData.get("maxWidth") as string) || "2000", 10);
    const maxHeight = parseInt((formData.get("maxHeight") as string) || "2000", 10);
    const quality = parseInt((formData.get("quality") as string) || "82", 10);

    const processed = sharp(buffer).resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });

    const webpBuffer = await processed.webp({ quality }).toBuffer();
    const metadata = await sharp(webpBuffer).metadata();

    const blobPath = `images/${timestamp}-${slug}.webp`;
    const blob = await put(blobPath, webpBuffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/webp",
    });

    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    const mediaItem: MediaItem = {
      id: `media-${timestamp}-${Math.random().toString(36).slice(2, 6)}`,
      url: blob.url,
      filename: file.name.replace(/\.[^.]+$/, ".webp"),
      type: "image",
      width,
      height,
      size: webpBuffer.length,
      uploadedAt: new Date().toISOString(),
    };
    await addMediaItem(mediaItem);

    return NextResponse.json({
      url: blob.url,
      width,
      height,
      mediaId: mediaItem.id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
