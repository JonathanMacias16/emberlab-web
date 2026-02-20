import LogoIcon from "@/components/ui/LogoIcon";

interface FooterProps {
  tagline?: string;
  brandLine1?: string;
  brandLine2?: string;
  copyright?: string;
}

export default function Footer({ tagline, brandLine1, brandLine2, copyright }: FooterProps) {
  return (
    <footer className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 bg-[var(--purple)] py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-[1728px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
            <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <p className="text-[var(--purple-light)] text-sm sm:text-base md:text-lg lg:text-xl font-light leading-[1.15] whitespace-pre-line">
              {tagline}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[var(--purple-light)] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide">
              {brandLine1}
            </p>
            <p className="text-[var(--red)] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide">
              {brandLine2}
            </p>
          </div>
        </div>
        <p className="text-[var(--white)] text-xs sm:text-sm md:text-base font-light text-center mt-8 sm:mt-10 md:mt-12">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
