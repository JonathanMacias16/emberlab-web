"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import useStaticMotion from "./useStaticMotion";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.15,
  className,
}: StaggerContainerProps) {
  const staticMotion = useStaticMotion();

  // Ver la nota en FadeIn. Los StaggerItem hijos hacen lo mismo, así que no
  // quedan variantes `hidden` sin resolver.
  if (staticMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
