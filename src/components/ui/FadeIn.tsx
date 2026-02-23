"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: FadeInProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
