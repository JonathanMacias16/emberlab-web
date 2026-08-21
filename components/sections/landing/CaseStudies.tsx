"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn } from "@/components/animations";
import {
  CONTAINER,
  SECTION_Y,
  TEXT_BODY,
  TEXT_SMALL,
  GAP_TITLE,
} from "./styles";
import type { CaseStudyData } from "@/types/sanity";

/**
 * Videos de cada caso, en el mismo orden que `defaultLandingWebData.cases`.
 * Viven en `public/videos/` y se reproducen en bucle, silenciados.
 */
const CASE_VIDEOS = [
  "/videos/CPF.webm",
  "/videos/estate-taurus.webm",
  "/videos/grizlie.webm",
  "/videos/Pixeron.webm",
  "/videos/Batwitz.webm",
  "/videos/casa-morgandez.webm",
  "/videos/JCToriz.webm",
  "/videos/LilianCazares.mp4",
];

/** Tiempo que permanece visible cada caso antes de avanzar solo. */
const AUTOPLAY_MS = 7000;

/** Píldora "Ver sitio", anclada abajo a la derecha del video. */
const PILL_CLASSES = `absolute bottom-[5%] right-[5%] inline-flex items-center justify-center border border-(--white) rounded-full px-4 h-8 md:h-9 text-(--white) font-light tracking-[-0.01em] ${TEXT_SMALL}`;

interface CaseStudiesProps {
  title?: string;
  cases?: CaseStudyData[];
}

export default function CaseStudies({ title, cases }: CaseStudiesProps) {
  const items = cases ?? [];
  const total = items.length;

  // `direction` decide si la diapositiva entra desde abajo (+1) o desde arriba (-1).
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => setSlide(([current]) => [next, next > current ? 1 : -1]),
    [],
  );

  useEffect(() => {
    if (total < 2 || paused) return;
    timer.current = setInterval(
      () => setSlide(([i]) => [(i + 1) % total, 1]),
      AUTOPLAY_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [total, paused, index]);

  if (total === 0) return null;

  const item = items[index];
  const video = CASE_VIDEOS[index % CASE_VIDEOS.length];

  return (
    <section id="resultados" className={`bg-(--white) ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <FadeIn direction="up">
          <SectionTitle className="text-(--purple) max-w-[30rem]">
            {title}
          </SectionTitle>
        </FadeIn>

        <div
          className={`${GAP_TITLE} mx-auto max-w-[68rem]`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Fila: video y, a su derecha, la columna de bullets. Al ser el video el
              elemento más alto, `items-center` centra los bullets en su altura. */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative flex-1 min-w-0 aspect-video overflow-hidden bg-(--purple)">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={index}
                  initial={{ y: direction > 0 ? "8%" : "-8%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction > 0 ? "-8%" : "8%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <video
                    key={video}
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label={item.imageAlt || item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${PILL_CLASSES} hover:bg-(--white)/15 transition-colors`}
                    >
                      {item.linkLabel || "Ver sitio"}
                    </a>
                  ) : (
                    <span className={PILL_CLASSES}>
                      {item.linkLabel || "Ver sitio"}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bullets verticales, fuera del video y centrados en su altura. */}
            <div className="shrink-0 flex flex-col items-center gap-3 sm:gap-4">
              {items.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ver caso ${i + 1}: ${c.title}`}
                  aria-current={i === index}
                  className="group flex h-6 w-6 items-center justify-center cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ease-out group-hover:scale-150 ${
                      i === index
                        ? "h-3 w-3 bg-(--red)"
                        : "h-2 w-2 bg-(--purple)/30 group-hover:bg-(--purple)/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Texto del caso, debajo del video. El alto mínimo evita que la sección
              salte al cambiar entre textos de distinto largo. */}
          {/* El padding derecho (ancho de los bullets + gap) mantiene el texto
              alineado con el borde derecho del video. */}
          <div className="overflow-hidden pr-10 sm:pr-12 min-h-[13rem] sm:min-h-[11rem] md:min-h-[10rem]">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={index}
                initial={{ y: direction > 0 ? "8%" : "-8%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? "-8%" : "8%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3
                  className={`mt-4 sm:mt-6 text-(--purple) font-bold tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-(--purple) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                >
                  {item.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
