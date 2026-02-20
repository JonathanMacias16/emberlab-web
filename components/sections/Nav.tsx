"use client";

import { useState } from "react";
import LogoIcon from "@/components/ui/LogoIcon";
import EmberText from "@/components/ui/EmberText";
import LabText from "@/components/ui/LabText";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import SocialIcon from "@/components/ui/SocialIcon";
import type { NavLinkData, SocialLinkData, CtaButtonData } from "@/types/sanity";

interface NavProps {
  links?: NavLinkData[];
  socialLinks?: SocialLinkData[];
  cta?: CtaButtonData;
}

export default function Nav({ links, socialLinks, cta }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6 md:px-12 lg:px-20 xl:px-28 lg:py-10 max-w-[1728px] mx-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12" aria-hidden />
          <EmberText className="h-5 sm:h-6 md:h-7 lg:h-8 w-auto" aria-hidden />
          <LabText className="h-5 sm:h-6 md:h-7 lg:h-8 w-auto" />
        </div>
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-[var(--purple)] text-sm lg:text-base xl:text-lg font-light tracking-[-0.04em]">
          {links?.map((link) => (
            <a key={link.href} href={link.href} className="hover:opacity-70 transition-opacity">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            {socialLinks?.map((social) => (
              <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer">
                <SocialIcon icon={social.platform} />
              </a>
            ))}
          </div>
          {cta && (
            <div className="hidden md:block">
              <ButtonPrimary variant={cta.variant} href={cta.href} className="py-3! px-6! text-[0.98rem]! rounded-xl!">
                {cta.text}
              </ButtonPrimary>
            </div>
          )}
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center gap-[8px] w-7 py-1"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <span className="block h-[3px] w-full bg-[var(--purple)] rounded-full" />
            <span className="block h-[3px] w-full bg-[var(--purple)] rounded-full" />
            <span className="block h-[3px] w-full bg-[var(--purple)] rounded-full" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end items-start md:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Panel */}
          <div
            className="relative bg-[var(--white)] w-full h-[70%] shadow-[0_4px_24px_rgba(0,0,0,0.18)] flex flex-col px-8 pt-8 pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (X) */}
            <button
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <line x1="4" y1="4" x2="32" y2="32" stroke="var(--purple)" strokeWidth="5" strokeLinecap="round" />
                <line x1="32" y1="4" x2="4" y2="32" stroke="var(--purple)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Links */}
            <nav className="mt-10 flex flex-col">
              {links?.map((link, i) => (
                <div key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-[var(--purple)] text-[2rem] font-bold tracking-[-0.04em] leading-[1.05] py-5"
                  >
                    {link.label}
                  </a>
                  {i < (links?.length ?? 0) - 1 && (
                    <div className="h-px w-full bg-black/10" />
                  )}
                </div>
              ))}
            </nav>

            {/* CTA button */}
            {cta && (
              <div className="mt-auto" onClick={() => setOpen(false)}>
                <ButtonPrimary
                  variant={cta.variant}
                  href={cta.href}
                  className="!py-[1.08rem] !px-[1.51rem] !text-[1.05rem] !rounded-[14px]"
                >
                  {cta.text}
                </ButtonPrimary>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
