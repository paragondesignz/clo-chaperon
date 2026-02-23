import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getMediaLibrary, deleteMediaItem } from "@/lib/media";
import { scrubUrl } from "@/lib/content";

export async function GET() {
  try {
    const library = await getMediaLibrary();
    return NextResponse.json(library);
  } catch {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, url } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (url) {
      try {
        await del(url);
      } catch {
        // File may already be gone -- continue with registry removal
      }
      // Remove the URL from all content sections so it doesn't re-sync
      try {
        await scrubUrl(url);
      } catch {
        // Non-critical -- dismissedUrls will also block re-sync
      }
    }

    const library = await deleteMediaItem(id);
    return NextResponse.json({ success: true, remaining: library.items.length });
  } catch {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
