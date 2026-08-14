"use client";

import { useState } from "react";
import LogoIcon from "@/components/ui/LogoIcon";
import EmberText from "@/components/ui/EmberText";
import LabText from "@/components/ui/LabText";
import SocialIcon from "@/components/ui/SocialIcon";
import type { NavLinkData, SocialLinkData } from "@/types/sanity";

interface LandingNavProps {
  links?: NavLinkData[];
  socialLinks?: SocialLinkData[];
}

export default function LandingNav({ links, socialLinks }: LandingNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-(--white)">
      <div className="mx-auto max-w-[1728px] px-7 py-4 sm:px-8 sm:py-6 md:px-12 lg:px-20 xl:px-28 lg:py-10">
        <div className="flex items-center justify-between gap-6">
          {/* Mismo lockup y tamaños que el nav de `/web`. */}
          <a href="#top" aria-label="EmberLab — inicio" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12" aria-hidden />
            <div className="flex gap-1 items-center">
              <EmberText className="h-5 sm:h-6 md:h-7 lg:h-8 w-auto" aria-hidden />
              <LabText className="h-5 sm:h-6 md:h-7 lg:h-8 w-auto" />
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-4 lg:gap-8 text-(--purple) text-sm lg:text-base xl:text-lg font-light tracking-[-0.04em]">
            {links?.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-(--red) transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {socialLinks?.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="hover:opacity-70 transition-opacity"
              >
                <SocialIcon icon={social.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Abrir menú"
            className="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
          >
            <span className="block h-[2px] w-6 bg-(--purple)" />
            <span className="block h-[2px] w-6 bg-(--purple)" />
            <span className="block h-[2px] w-6 bg-(--purple)" />
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-6 flex flex-col gap-4">
            {links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-(--purple) text-sm font-light tracking-[-0.04em]"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks?.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                >
                  <SocialIcon icon={social.platform} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
