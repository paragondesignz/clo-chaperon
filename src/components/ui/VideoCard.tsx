"use client";

import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import type { Video } from "@/types";

interface VideoCardProps extends Video {
  onClick?: () => void;
}

export default function VideoCard({ title, duration, src, onClick }: VideoCardProps) {
  const isPlayable = !!src;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`group relative bg-surface rounded-lg overflow-hidden border border-border hover:border-accent-gold/30 transition-all duration-300 ${
        isPlayable ? "cursor-pointer" : ""
      }`}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="aspect-video bg-background-alt flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background-alt" />
        <div className="relative z-10 w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold/20 group-hover:scale-110 transition-all duration-300">
          <Play
            size={24}
            className="text-accent-gold ml-1"
            fill="currentColor"
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg text-text-primary group-hover:text-accent-gold transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 text-text-secondary text-sm">
          <Clock size={14} />
          <span>{duration}</span>
          {!isPlayable && (
            <span className="ml-auto text-xs text-text-secondary/50 tracking-wider uppercase">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
