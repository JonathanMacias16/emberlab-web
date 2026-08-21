"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { SECTION_Y, TEXT_BODY } from "./styles";
import type { FaqItemData } from "@/types/sanity";

interface FaqProps {
  title?: string;
  items?: FaqItemData[];
}

export default function Faq({ title, items }: FaqProps) {
  const total = items?.length ?? 0;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="preguntas" className="bg-(--purple)">
      <div className={`mx-auto max-w-[1728px] grid grid-cols-1 lg:grid-cols-2 ${SECTION_Y}`}>
        <div className="px-7 sm:px-8 md:px-12 lg:px-20 xl:pl-28 xl:pr-12">
          <FadeIn direction="up">
            <SectionTitle className="text-(--white) max-w-[36rem]">{title}</SectionTitle>
          </FadeIn>
        </div>

        <div className="px-7 sm:px-8 md:px-12 lg:pl-8 lg:pr-20 xl:pl-16 xl:pr-28 mt-10 lg:mt-0">
          <StaggerContainer className="flex flex-col max-w-[30rem]">
            {items?.map((item, i) => {
              const isOpen = openIndex === i;

              return (
                <StaggerItem key={i}>
                  <div
                    className={
                      i < total - 1
                        ? "pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-(--white)/60"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                      className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
                    >
                      <span
                        className={`font-bold text-(--red) tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                      >
                        {item.question}
                      </span>
                      <motion.span
                        aria-hidden
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="shrink-0 mt-1 text-(--white)"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 3v14M3 10h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p
                            className={`pt-3 font-light text-(--white) tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
                          >
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}