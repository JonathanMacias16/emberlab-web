import Logo from "@/components/ui/Logo";
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
      <Logo className="h-8 w-auto sm:h-10 md:h-12 lg:h-14" />
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
          <ButtonPrimary variant={cta.variant} href={cta.href}>
            {cta.text}
          </ButtonPrimary>
        )}
      </div>
    </nav>
  );
}
