"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import LightboxModal from "@/components/gallery/LightboxModal";
import { fadeInUp } from "@/lib/animations";
import type { GalleryImage } from "@/types/content";

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev <= 0 ? images.length - 1 : prev - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev >= images.length - 1 ? 0 : prev + 1
    );
  }, [images.length]);

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <SectionHeading title="Gallery" />

        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.03 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <LightboxModal
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </>
  );
}
