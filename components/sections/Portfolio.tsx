import Image from "next/image";

const projects = [
  { title: "Sitio web industria B2B", img: "/Rectangle 22.png" },
  { title: "Sitio web Real Estate", img: "/Rectangle 28.png" },
  { title: "Sitio web Outdoor", img: "/Rectangle 31.png" },
  { title: "Sitio web Medicina", img: "/Rectangle 32.png" },
];

export default function Portfolio() {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {projects.map(({ title, img }) => (
          <div key={title} className="relative group">
            <div className="w-full aspect-square rounded-2xl md:rounded-3xl lg:rounded-[46px] overflow-hidden relative">
              <Image src={img} alt={title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-end p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                  <span className="inline-flex items-center rounded-full border border-[var(--white)] px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 text-[var(--white)] text-xs sm:text-sm md:text-base font-light">
                    {title}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[var(--white)] px-3 sm:px-4 py-1 sm:py-1.5 md:py-2 text-[var(--white)] text-xs sm:text-sm md:text-base font-light group-hover:bg-[var(--white)] group-hover:text-[var(--purple)] transition-colors cursor-pointer">
                    Ver sitio
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
