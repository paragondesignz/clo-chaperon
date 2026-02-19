"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-light tracking-wide text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-text-secondary tracking-widest text-sm uppercase">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-16 h-px bg-accent-gold" />
    </motion.div>
  );
}
