"use client";

import { useState } from "react";
import type { PilarCardData } from "@/types/sanity";

interface PilaresCarouselProps {
  pilares: PilarCardData[];
}

export default function PilaresCarousel({ pilares }: PilaresCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + pilares.length) % pilares.length);
  const next = () => setCurrent((c) => (c + 1) % pilares.length);

  const pilar = pilares[current];
  const bg = pilar.bgColor || "bg-[var(--purple)]";
  const textColor = pilar.textColor || "text-[var(--white)]";

  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      {/* Tarjeta — proporción 678×840 del diseño */}
      <div
        className={`w-full rounded-[46px] border-[6px] border-[#edeae7] shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)] p-8 flex flex-col justify-center ${bg}`}
        style={{ aspectRatio: "678 / 840" }}
      >
        <div className="flex-1 flex flex-col justify-center">
          <h3 className={`${textColor} text-[1.875rem] font-bold tracking-[-0.04em] leading-[1.1]`}>
            {pilar.title}
          </h3>
          <p className={`${textColor} text-[1.0625rem] font-bold tracking-[-0.04em] leading-[1.2] mt-16`}>
            {pilar.description}
          </p>
        </div>

        {/* Flecha como navegación al siguiente */}
        <div className="flex justify-end">
          <button
            onClick={next}
            aria-label="Siguiente"
            className={`${textColor} opacity-80 hover:opacity-100 transition-opacity`}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="26,10 36,20 26,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
