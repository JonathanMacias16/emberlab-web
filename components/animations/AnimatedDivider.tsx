"use client";

import { motion } from "framer-motion";

interface AnimatedDividerProps {
  origin?: "left" | "right";
  className?: string;
}

export default function AnimatedDivider({
  origin = "left",
  className = "mt-3 sm:mt-4 h-[3px] md:h-1 bg-[var(--purple-light)]",
}: AnimatedDividerProps) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: origin }}
      className={className}
    />
  );
}
