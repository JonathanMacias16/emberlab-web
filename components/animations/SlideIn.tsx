"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  distance?: number;
  rotate?: number;
  className?: string;
}

export default function SlideIn({
  children,
  from = "left",
  distance = 80,
  rotate,
  className,
}: SlideInProps) {
  const isHorizontal = from === "left" || from === "right";
  const sign = from === "left" || from === "top" ? -1 : 1;
  const offset = isHorizontal ? { x: sign * distance } : { y: sign * distance };

  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        initial={{
          opacity: 0,
          ...offset,
          ...(rotate ? { rotate } : {}),
        }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
