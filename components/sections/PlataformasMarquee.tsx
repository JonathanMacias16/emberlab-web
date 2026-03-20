"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const platforms = [
  { src: "/platforms/figma.png", alt: "Figma" },
  { src: "/platforms/brevo.png", alt: "Brevo" },
  { src: "/platforms/wix.png", alt: "Wix" },
  { src: "/platforms/squarespace.png", alt: "Squarespace" },
  { src: "/platforms/wordpress.png", alt: "WordPress" },
  { src: "/platforms/shopify.png", alt: "Shopify" },
  { src: "/platforms/webflow.png", alt: "Webflow" },
];

const repeated = [...platforms, ...platforms];

export default function PlataformasMarquee() {
  return (
    <motion.section
      className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={"flex justify-end"}>
        <div className={"max-w-8/12 relative overflow-hidden"}>
          <motion.div
            className="flex items-center gap-10 sm:gap-14 md:gap-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 27,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {repeated.map((p, i) => (
              <div key={i} className="shrink-0 h-10 sm:h-12 md:h-14 lg:h-16">
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
        </div>
      </div>
    </motion.section>
  );
}
