"use client";

import { useState } from "react";
import Image from "next/image";

interface ProblemaCardResolved {
  text: string;
  imageAlt: string;
  bgColor: string;
  textClass: string;
  imgSrc: string;
}

interface ProblemaCarouselProps {
  cards: ProblemaCardResolved[];
}

export default function ProblemaCarousel({ cards }: ProblemaCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + cards.length) % cards.length);
  const next = () => setCurrent((c) => (c + 1) % cards.length);

  const card = cards[current];

  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <div
        className="w-full rounded-t-4xl flex flex-col overflow-hidden"
        style={{ backgroundColor: card.bgColor }}
      >
        <div className="h-40 flex items-center">
          <p
            className={`${card.textClass} text-2xl md:text-[1.10rem] font-medium tracking-[-0.04em] leading-[1.15] p-[1.68rem]`}
          >
            {card.text}
          </p>
        </div>
        <div className="w-full aspect-487/389 relative overflow-hidden rounded-t-4xl">
          <Image
            src={card.imgSrc}
            alt={card.imageAlt}
            fill
            className="object-cover scale-101"
          />
        </div>
      </div>

      {/* Flechas + dots */}
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="text-[var(--white)] opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line
              x1="36"
              y1="20"
              x2="4"
              y2="20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polyline
              points="14,10 4,20 14,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={next}
          aria-label="Siguiente"
          className="text-(--white) opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <line
              x1="4"
              y1="20"
              x2="36"
              y2="20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polyline
              points="26,10 36,20 26,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
