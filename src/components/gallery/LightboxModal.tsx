"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/types";

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const current = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>

          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-[80vh] w-full mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="w-full h-auto max-h-[80vh] object-contain"
              unoptimized
            />
            <p className="text-center text-white/50 text-sm mt-4">
              {currentIndex + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
