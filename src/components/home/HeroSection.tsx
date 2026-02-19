"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { heroTextVariants, staggerContainer } from "@/lib/animations";
import { SITE } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-alt to-background" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6"
      >
        <motion.div
          variants={heroTextVariants}
          className="mb-4"
        >
          <span className="text-accent-gold text-sm tracking-[0.4em] uppercase">
            Introducing
          </span>
        </motion.div>

        <motion.h1
          variants={heroTextVariants}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.15em] text-text-primary"
        >
          {SITE.name.toUpperCase()}
        </motion.h1>

        <motion.div
          variants={heroTextVariants}
          className="mt-6"
        >
          <span className="text-text-secondary text-lg sm:text-xl tracking-[0.5em] uppercase">
            {SITE.tagline}
          </span>
        </motion.div>

        <motion.div
          variants={heroTextVariants}
          className="mt-4 mx-auto w-24 h-px bg-accent-gold"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={28} className="text-text-secondary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
