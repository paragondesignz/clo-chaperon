"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import LightboxModal from "@/components/gallery/LightboxModal";
import { GALLERY_IMAGES } from "@/lib/constants";
import { fadeInUp } from "@/lib/animations";

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev <= 0 ? GALLERY_IMAGES.length - 1 : prev - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev >= GALLERY_IMAGES.length - 1 ? 0 : prev + 1
    );
  }, []);

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <SectionHeading title="Gallery" />

        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {GALLERY_IMAGES.map((image, i) => (
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
                unoptimized
              />
            </motion.div>
          ))}
        </div>
      </section>

      <LightboxModal
        images={GALLERY_IMAGES}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </>
  );
}
