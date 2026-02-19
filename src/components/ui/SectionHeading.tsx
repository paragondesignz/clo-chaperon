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
      <h2 className="text-[1.5rem] font-normal tracking-wide text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-text-secondary text-sm">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
