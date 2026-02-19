import type { Metadata } from "next";
import { getSection } from "@/lib/content";
import VideosClient from "@/components/videos/VideosClient";

export const metadata: Metadata = {
  title: "Videos",
};

export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getSection("videos");
  return <VideosClient items={videos.items} />;
}
