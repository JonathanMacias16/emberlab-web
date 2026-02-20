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
  return (
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
          <ButtonPrimary variant={cta.variant} href={cta.href} className="!py-3 !px-6 !text-[0.98rem] !rounded-xl">
            {cta.text}
          </ButtonPrimary>
        )}
      </div>
    </nav>
  );
}
