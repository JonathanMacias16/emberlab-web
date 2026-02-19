import Image from "next/image";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function ProblemaDark() {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 bg-[var(--purple)] py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-[1728px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <h2 className="text-[var(--white)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[-0.05em] leading-[0.85]">
              Muchas empresas crecen, cambian y evolucionan... pero sus sitios
              web se quedan atrás.
            </h2>
            <p className="text-[var(--green-light)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
              No comunican lo que son hoy, no ayudan a decidir, y no acompañan
              la transformación digital que necesitan.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10">
              <ButtonPrimary variant="red">
                Hablemos de tu web
              </ButtonPrimary>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-[var(--white)] rounded-2xl md:rounded-3xl lg:rounded-[46px] w-full aspect-[856/760] flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
              <div className="relative w-full max-w-[480px]">
                {/* Logo crosshair */}
                <Image
                  src="/logo.svg"
                  alt=""
                  width={118}
                  height={118}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-[118px] xl:h-[118px]"
                  aria-hidden
                />
                {/* CREATIVE (purple) */}
                <Image
                  src="/Group-2.svg"
                  alt=""
                  width={590}
                  height={92}
                  className="w-full mt-2 sm:mt-3 md:mt-4"
                  aria-hidden
                />
                {/* WEBSITE (red) */}
                <Image
                  src="/Group.svg"
                  alt=""
                  width={477}
                  height={78}
                  className="w-[80%] ml-auto mt-1 sm:mt-2"
                  aria-hidden
                />
                {/* CREATIVE (purple) */}
                <Image
                  src="/Group-3.svg"
                  alt=""
                  width={590}
                  height={92}
                  className="w-full mt-1 sm:mt-2"
                  aria-hidden
                />
                {/* WORKS (red) */}
                <Image
                  src="/Group-1.svg"
                  alt=""
                  width={390}
                  height={78}
                  className="w-[66%] ml-auto mt-1 sm:mt-2"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-10 sm:mt-14 md:mt-16 lg:mt-20">
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--green-light)] p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col">
            <p className="text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15]">
              Olvidate de sitios lentos o poco claros, con estructuras
              confusas.
            </p>
            <div className="mt-4 sm:mt-6 w-full aspect-[487/389] relative rounded-xl md:rounded-2xl overflow-hidden">
              <Image src="/sitios 1.png" alt="Sitios lentos" fill className="object-cover" />
            </div>
          </div>
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--purple-soft)] p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col">
            <p className="text-[var(--white)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15]">
              Dile adios al diseño genérico, con poca identidad.
            </p>
            <div className="mt-4 sm:mt-6 w-full aspect-[487/389] relative rounded-xl md:rounded-2xl overflow-hidden">
              <Image src="/sitios 2.png" alt="Diseño genérico" fill className="object-cover" />
            </div>
          </div>
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--purple-light)] p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col sm:col-span-2 md:col-span-1">
            <p className="text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15]">
              Plataformas escalables, para crecer.
            </p>
            <div className="mt-4 sm:mt-6 w-full aspect-[487/389] relative rounded-xl md:rounded-2xl overflow-hidden">
              <Image src="/sitios 3.png" alt="Plataformas escalables" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
