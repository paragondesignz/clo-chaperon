"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Video } from "@/types";

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && video?.src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg flex items-center justify-center p-6"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-text-tertiary hover:text-text-primary transition-colors z-10"
            aria-label="Close video"
          >
            <X size={28} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={video.src}
              controls
              autoPlay
              className="w-full rounded shadow-xl"
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-text-primary text-lg mt-4 font-semibold">
              {video.title}
            </p>
            <p className="text-center text-text-secondary text-sm mt-1">
              {video.duration}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
