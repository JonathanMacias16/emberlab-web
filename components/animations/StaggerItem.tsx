"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import useStaticMotion from "./useStaticMotion";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  scale?: boolean;
}

export default function StaggerItem({ children, className, scale }: StaggerItemProps) {
  const staticMotion = useStaticMotion();

  // Ver la nota en FadeIn.
  if (staticMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 60,
          ...(scale ? { scale: 0.8 } : {}),
        },
        visible: {
          opacity: 1,
          y: 0,
          ...(scale ? { scale: 1 } : {}),
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
