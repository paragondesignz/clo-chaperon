import type { Metadata } from "next";
import { getSection } from "@/lib/content";
import MusicClient from "@/components/music/MusicClient";

export const metadata: Metadata = {
  title: "Music",
};

export const revalidate = 60;

export default async function MusicPage() {
  const music = await getSection("music");
  return <MusicClient music={music} />;
}
