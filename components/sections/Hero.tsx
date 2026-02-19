import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="bienvenido"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 max-w-[1728px] mx-auto"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-[var(--purple)] text-center text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85]">
          Un sitio web
        </h1>
        <h1 className="text-[var(--purple)] text-center text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85] mt-1 sm:mt-2">
          Es una decisión estratégica.
        </h1>
        <p className="text-[var(--purple-soft)] text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6 md:mt-8 max-w-[640px] lg:max-w-[800px]">
          Diseñamos y desarrollamos sitios web claros, funcionales y
          personalizados, alineados a los objetivos reales de tu negocio.
        </p>
        <div className="mt-6 sm:mt-8 md:mt-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] aspect-[3/4] relative overflow-hidden rounded-2xl md:rounded-3xl">
          <Image
            src="/Rectangle.png"
            alt="EmberLab - Diseño web estratégico"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
