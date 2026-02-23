import { NextResponse } from "next/server";
import { getSection, updateSection } from "@/lib/content";
import type { SectionKey } from "@/types/content";

const VALID_SECTIONS: SectionKey[] = [
  "site",
  "home",
  "about",
  "gallery",
  "videos",
  "music",
  "social",
  "contact",
];

function isValidSection(section: string): section is SectionKey {
  return VALID_SECTIONS.includes(section as SectionKey);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!isValidSection(section)) {
    return NextResponse.json(
      { error: `Invalid section: ${section}` },
      { status: 400 }
    );
  }

  try {
    const data = await getSection(section);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!isValidSection(section)) {
    return NextResponse.json(
      { error: `Invalid section: ${section}` },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updateSection(section, data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
