import LogoIcon from "@/components/ui/LogoIcon";
import { TEXT_BODY, TEXT_SMALL } from "./styles";

interface LandingFooterProps {
  tagline?: string;
  brandLine1?: string;
  brandLine2?: string;
  copyright?: string;
}

export default function LandingFooter({
  tagline,
  brandLine1,
  brandLine2,
  copyright,
}: LandingFooterProps) {
  return (
    <footer className="bg-(--purple) py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="mx-auto max-w-[1728px] px-7 sm:px-8 md:px-12 lg:px-20 xl:px-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          <div>
            <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <p
              className={`mt-4 sm:mt-6 whitespace-pre-line text-(--purple-light) font-light tracking-[-0.04em] leading-[1.15] ${TEXT_BODY}`}
            >
              {tagline}
            </p>
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide leading-[1.1]">
            <p className="text-(--purple-light)">{brandLine1}</p>
            <p className="text-(--red) sm:text-right">{brandLine2}</p>
          </div>
        </div>

        <p
          className={`mt-8 sm:mt-10 md:mt-12 text-center text-(--white) font-light ${TEXT_SMALL}`}
        >
          {copyright}
        </p>
      </div>
    </footer>
  );
}
