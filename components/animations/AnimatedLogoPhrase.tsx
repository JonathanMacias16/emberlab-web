"use client";

import Image from "next/image";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useCallback } from "react";

const lines = [
  { src: "/Group-2.svg", width: 590, height: 92, className: "w-full mt-2 sm:mt-3 md:mt-4" },
  { src: "/Group.svg", width: 477, height: 78, className: "w-[80%] ml-auto mt-1 sm:mt-2" },
  { src: "/Group-3.svg", width: 590, height: 92, className: "w-full mt-1 sm:mt-2" },
  { src: "/Group-1.svg", width: 390, height: 78, className: "w-[66%] ml-auto mt-1 sm:mt-2" },
];

const LINE_WRITE = 1;
const GAP = 0.35;
const HOLD = 2;

export default function AnimatedLogoPhrase() {
  const [scope, animate] = useAnimate();

  const runCycle = useCallback(async () => {
    // Reset everything hidden
    animate(".logo-icon", { scale: 0, opacity: 0 }, { duration: 0 });
    for (let i = 0; i < lines.length; i++) {
      animate(`.line-${i}`, { clipPath: "inset(0 100% 0 0)" }, { duration: 0 });
    }

    // Logo pop in
    await animate(".logo-icon", { scale: [0, 1.15, 1], opacity: 1 }, { duration: 0.5, ease: "easeOut" });

    // Write each line
    for (let i = 0; i < lines.length; i++) {
      await animate(`.line-${i}`, { clipPath: "inset(0 0% 0 0)" }, {
        duration: LINE_WRITE,
        ease: [0.22, 1, 0.36, 1],
      });
      if (i < lines.length - 1) {
        await new Promise((r) => setTimeout(r, GAP * 1000));
      }
    }

    // Hold
    await new Promise((r) => setTimeout(r, HOLD * 1000));
  }, [animate]);

  useEffect(() => {
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        await runCycle();
      }
    }

    loop();
    return () => { cancelled = true; };
  }, [runCycle]);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl lg:rounded-[46px] w-full aspect-856/760 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
      <div ref={scope} className="relative w-full max-w-[480px]">
        <div className="logo-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-[118px] xl:h-[118px]">
          <Image src="/logo.svg" alt="" width={118} height={118} className="w-full h-full" aria-hidden />
        </div>

        {lines.map((line, i) => (
          <div
            key={line.src}
            className={`line-${i} ${line.className}`}
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            <Image
              src={line.src}
              alt=""
              width={line.width}
              height={line.height}
              className="w-full"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </div>
  );
}
