"use client";

import { useRef, useState, useCallback } from "react";
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
  const [skipDelay, setSkipDelay] = useState(false);

  const slots = pilares.map((pilar) => ({
    pos: parsePosition(pilar.position || ""),
    rot: parseRotation(pilar.rotation || ""),
  }));

  // Center slot = highest z-index
  const centerSlot = slots.reduce(
    (maxIdx, slot, idx) =>
      slot.rot.zIndex > slots[maxIdx].rot.zIndex ? idx : maxIdx,
    0,
  );

  // positionMap[cardIndex] = slotIndex
  const [positionMap, setPositionMap] = useState(() =>
    pilares.map((_, i) => i),
  );

  const handleClick = useCallback(
    (cardIndex: number) => {
      const clickedSlot = positionMap[cardIndex];
      if (clickedSlot === centerSlot) return;

      const centerCardIndex = positionMap.indexOf(centerSlot);

      setSkipDelay(true);
      setPositionMap((prev) => {
        const next = [...prev];
        next[cardIndex] = centerSlot;
        next[centerCardIndex] = clickedSlot;
        return next;
      });
    },
    [positionMap, centerSlot],
  );

  return (
    <div
      ref={ref}
      className="hidden md:block relative w-full mt-10 lg:mt-0 pb-[71.2%]"
    >
      {pilares.map((pilar, i) => {
        const slotIndex = positionMap[i];
        const { pos, rot } = slots[slotIndex];
        const textColor = pilar.textColor || "text-[var(--white)]";

        return (
          <motion.div
            key={pilar.title}
            className={`group absolute rounded-2xl md:rounded-3xl lg:rounded-[46px] flex flex-col justify-center border-4 lg:border-[6px] border-[#edeae7] shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)] w-[41.4%] sm:w-[35.7%] md:w-[33.4%] lg:w-[32.9%] h-[48.3%] sm:h-[52.9%] md:h-[55.2%] lg:h-[57.2%] p-[3.5%] sm:p-[3.1%] lg:p-[2.9%] cursor-pointer ${pilar.bgColor || "bg-[var(--purple)]"}`}
            whileHover={{ scale: 1.05 }}
            initial={{
              left: STACK_CENTER.left,
              top: STACK_CENTER.top,
              rotate: 0,
              zIndex: rot.zIndex,
            }}
            animate={
              isInView
                ? {
                    left: pos.left,
                    top: pos.top,
                    rotate: rot.rotate,
                    zIndex: rot.zIndex,
                  }
                : undefined
            }
            transition={{
              duration: 0.8,
              delay: skipDelay ? 0 : 0.18 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => {
              if (skipDelay) setSkipDelay(false);
            }}
            onClick={() => handleClick(i)}
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
            {slotIndex !== centerSlot && (
              <span
                className={`${textColor} absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 7L5.5 5.5M15 7L16.5 5.5M5.5 16.5L7 15M11 5L11 3M5 11L3 11M17.1603 16.9887L21.0519 15.4659C21.4758 15.3001 21.4756 14.7003 21.0517 14.5346L11.6992 10.8799C11.2933 10.7213 10.8929 11.1217 11.0515 11.5276L14.7062 20.8801C14.8719 21.304 15.4717 21.3042 15.6375 20.8803L17.1603 16.9887Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Click me
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
