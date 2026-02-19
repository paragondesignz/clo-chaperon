import type { Metadata } from "next";
import { getSection } from "@/lib/content";
import GalleryClient from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const gallery = await getSection("gallery");
  return <GalleryClient images={gallery.images} />;
}
