import Image from "next/image";
import type { PortfolioProjectData } from "@/types/sanity";
import { urlFor } from "@/sanity/lib/image";

const fallbackImages = [
  "/Rectangle 22.png",
  "/Rectangle 28.png",
  "/Rectangle 31.png",
  "/Rectangle 32.png",
];

interface PortfolioProps {
  projects?: PortfolioProjectData[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {projects?.map((project, i) => {
          const imgSrc = project.image
            ? urlFor(project.image).width(700).height(700).url()
            : fallbackImages[i] || fallbackImages[0];

          const content = (
            <div className="w-full aspect-square rounded-2xl md:rounded-3xl lg:rounded-[46px] overflow-hidden relative">
              <Image src={imgSrc} alt={project.title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-end p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                  <span className="inline-flex items-center rounded-full border border-[var(--white)] px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 text-[var(--white)] text-xs sm:text-sm md:text-base font-light">
                    {project.title}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[var(--white)] px-3 sm:px-4 py-1 sm:py-1.5 md:py-2 text-[var(--white)] text-xs sm:text-sm md:text-base font-light group-hover:bg-[var(--white)] group-hover:text-[var(--purple)] transition-colors cursor-pointer">
                    Ver sitio
                  </span>
                </div>
              </div>
            </div>
          );

          return (
            <div key={i} className="relative group">
              {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
