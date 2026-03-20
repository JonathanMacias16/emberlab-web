"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { PilarCardData } from "@/types/sanity";

function parsePosition(pos: string) {
  const leftMatch = pos.match(/left-\[([^\]]+)\]/);
  const topMatch = pos.match(/top-\[([^\]]+)\]/);
  return {
    left: leftMatch ? leftMatch[1] : "33%",
    top: topMatch ? topMatch[1] : "20%",
  };
}

function parseRotation(rot: string) {
  const rotMatch = rot.match(/(-?)rotate-\[(\d+)deg\]/);
  const zMatch = rot.match(/z-(\d+)/);
  return {
    rotate: rotMatch
      ? (rotMatch[1] === "-" ? -1 : 1) * parseInt(rotMatch[2])
      : 0,
    zIndex: zMatch ? parseInt(zMatch[1]) : 1,
  };
}

const STACK_CENTER = { left: "33%", top: "20%" };

export default function PilarsFan({ pilares }: { pilares: PilarCardData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="hidden md:block relative w-full mt-10 lg:mt-0 pb-[71.2%]"
    >
      {pilares.map((pilar, i) => {
        const pos = parsePosition(pilar.position || "");
        const rot = parseRotation(pilar.rotation || "");
        const textColor = pilar.textColor || "text-[var(--white)]";

        return (
          <motion.div
            key={pilar.title}
            className={`absolute rounded-2xl md:rounded-3xl lg:rounded-[46px] flex flex-col justify-center border-4 lg:border-[6px] border-[#edeae7] shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)] w-[41.4%] sm:w-[35.7%] md:w-[33.4%] lg:w-[32.9%] h-[48.3%] sm:h-[52.9%] md:h-[55.2%] lg:h-[57.2%] p-[3.5%] sm:p-[3.1%] lg:p-[2.9%] ${pilar.bgColor || "bg-[var(--purple)]"}`}
            style={{ zIndex: rot.zIndex }}
            initial={{
              left: STACK_CENTER.left,
              top: STACK_CENTER.top,
              rotate: 0,
            }}
            animate={
              isInView
                ? {
                    left: pos.left,
                    top: pos.top,
                    rotate: rot.rotate,
                    opacity: 1,
                  }
                : undefined
            }
            transition={{
              duration: 3.5,
              delay: 0.2 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h3
              className={`${textColor} text-xl sm:text-2xl md:text-3xl lg:text-[1.9rem] xl:text-[2.55rem] font-bold tracking-[-0.04em] leading-[1.1]`}
            >
              {pilar.title}
            </h3>
            <p
              className={`${textColor} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-[-0.04em] leading-[1.2] mt-4 lg:mt-[3.9rem]`}
            >
              {pilar.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
