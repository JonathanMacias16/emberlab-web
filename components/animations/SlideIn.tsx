"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  distance?: number;
  rotate?: number;
  delay?: number;
  initialDelay?: number;
  className?: string;
}

export default function SlideIn({
  children,
  from = "left",
  distance = 80,
  rotate,
  delay = 0,
  initialDelay,
  className,
}: SlideInProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const currentDelay =
    initialDelay !== undefined && !hasAnimated ? initialDelay : delay;

  const onComplete = useCallback(() => {
    if (!hasAnimated) setHasAnimated(true);
  }, [hasAnimated]);

  const isHorizontal = from === "left" || from === "right";
  const sign = from === "left" || from === "top" ? -1 : 1;
  const offset = isHorizontal
    ? { x: sign * distance }
    : { y: sign * distance };

  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        initial={{
          opacity: 0,
          ...offset,
          ...(rotate ? { rotate } : {}),
        }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        viewport={{ once: false, amount: 0 }}
        transition={{ duration: 0.9, delay: currentDelay, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onComplete}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
