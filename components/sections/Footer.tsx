import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 bg-[var(--purple)] py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-[1728px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
          <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
            <Image src="/logo.svg" alt="EmberLab" width={118} height={118} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <p className="text-[var(--purple-light)] text-sm sm:text-base md:text-lg lg:text-xl font-light leading-[1.15]">
              Nos apasiona la tecnología
              <br />y el desarrollo de marcas con sentido.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[var(--purple-light)] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide">
              CREATIVE
            </p>
            <p className="text-[var(--red)] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide">
              WORKS
            </p>
          </div>
        </div>
        <p className="text-[var(--white)] text-xs sm:text-sm md:text-base font-light text-center mt-8 sm:mt-10 md:mt-12">
          Copyright © 2026 EmberLab
        </p>
      </div>
    </footer>
  );
}
