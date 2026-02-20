"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const platforms = [
  { src: "/platforms/figma.jpg", alt: "Figma" },
  { src: "/platforms/brevo.jpg", alt: "Brevo" },
  { src: "/platforms/wix.jpg", alt: "Wix" },
  { src: "/platforms/squarespace.jpg", alt: "Squarespace" },
  { src: "/platforms/wordpress.jpg", alt: "WordPress" },
  { src: "/platforms/shopify.jpg", alt: "Shopify" },
  { src: "/platforms/webflow.jpg", alt: "Webflow" },
];

const repeated = [...platforms, ...platforms];

export default function PlataformasMarquee() {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 overflow-hidden">
      <motion.div
        className="flex items-center gap-10 sm:gap-14 md:gap-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ width: "max-content" }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {repeated.map((p, i) => (
          <div key={i} className="flex-shrink-0 h-10 sm:h-12 md:h-14 lg:h-16">
            <Image
              src={p.src}
              alt={p.alt}
              width={160}
              height={64}
              className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
