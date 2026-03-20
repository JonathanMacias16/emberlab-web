"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  blur?: boolean;
  rotate?: number;
  delay?: number;
  initialDelay?: number;
  className?: string;
}

const directionOffset = {
  up: { y: 60 },
  down: { y: -60 },
  left: { x: 60 },
  right: { x: -60 },
};

export default function FadeIn({
  children,
  direction,
  blur = false,
  rotate = 0,
  delay = 0,
  initialDelay,
  className,
}: FadeInProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const currentDelay =
    initialDelay !== undefined && !hasAnimated ? initialDelay : delay;

  const onComplete = useCallback(() => {
    if (!hasAnimated) setHasAnimated(true);
  }, [hasAnimated]);

  const offset = direction ? directionOffset[direction] : {};
  const isHorizontal = direction === "left" || direction === "right";

  const inner = (
    <motion.div
      initial={{
        opacity: 0,
        ...offset,
        ...(blur ? { filter: "blur(16px)" } : {}),
        ...(rotate ? { rotate } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(blur ? { filter: "blur(0px)" } : {}),
        ...(rotate ? { rotate: 0 } : {}),
      }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.8, delay: currentDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onAnimationComplete={onComplete}
      className={className}
    >
      {children}
    </motion.div>
  );

  if (isHorizontal) {
    return <div style={{ overflow: "hidden" }}>{inner}</div>;
  }

  return inner;
}
