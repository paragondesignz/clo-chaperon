import { NextResponse } from "next/server";
import { seedContent } from "@/lib/content";

export async function POST() {
  try {
    const content = await seedContent();
    return NextResponse.json({ success: true, content });
  } catch {
    return NextResponse.json(
      { error: "Failed to seed content" },
      { status: 500 }
    );
  }
}
