"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Clock } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import type { VideoItem } from "@/types/content";

interface VideoCardProps extends VideoItem {
  onClick?: () => void;
}

export default function VideoCard({ title, duration, src, thumbnail, venue, onClick }: VideoCardProps) {
  const isPlayable = !!src;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`group border border-border rounded overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isPlayable ? "cursor-pointer" : ""
      }`}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-background-alt" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
            <Play size={22} className="text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[1.1rem] font-semibold text-text-primary">
          {title}
        </h3>
        {venue && (
          <p className="text-text-secondary text-sm mt-1">{venue}</p>
        )}
        {!isPlayable && (
          <span className="text-xs text-text-tertiary tracking-wider uppercase mt-1 inline-block">
            Coming soon
          </span>
        )}
      </div>
    </motion.div>
  );
}
