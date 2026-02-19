"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HERO_IMAGE } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative h-[75vh] overflow-hidden">
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={HERO_IMAGE}
          alt="Clo Chaperon"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </motion.div>

      <div className="absolute bottom-4 left-4 z-10">
        <span className="text-white/60 text-xs">&copy; Copyright</span>
      </div>
    </section>
  );
}
