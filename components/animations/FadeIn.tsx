"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import useStaticMotion from "./useStaticMotion";

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
  const staticMotion = useStaticMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const currentDelay =
    initialDelay !== undefined && !hasAnimated ? initialDelay : delay;

  const onComplete = useCallback(() => {
    if (!hasAnimated) setHasAnimated(true);
  }, [hasAnimated]);

  const offset = direction ? directionOffset[direction] : {};
  const isHorizontal = direction === "left" || direction === "right";

  // Sin animación: se renderiza un div plano, sin `motion`, para que el nodo
  // nunca lleve `opacity: 0` ni dependa de que el motor de animación corra.
  if (staticMotion) {
    return <div className={className}>{children}</div>;
  }

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
      viewport={{ once: true, amount: 0 }}
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
