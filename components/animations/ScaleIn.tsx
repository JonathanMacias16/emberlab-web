"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  initialScale?: number;
  rotate?: number;
  delay?: number;
  initialDelay?: number;
  className?: string;
}

export default function ScaleIn({
  children,
  initialScale = 0.7,
  rotate = 0,
  delay = 0,
  initialDelay,
  className,
}: ScaleInProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const currentDelay =
    initialDelay !== undefined && !hasAnimated ? initialDelay : delay;

  const onComplete = useCallback(() => {
    if (!hasAnimated) setHasAnimated(true);
  }, [hasAnimated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale, ...(rotate ? { rotate } : {}) }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.9, delay: currentDelay, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={onComplete}
      className={className}
    >
      {children}
    </motion.div>
  );
}
