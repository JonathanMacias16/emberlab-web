interface ResultadosProps {
  title?: string;
  subtitle?: string;
}

export default function Resultados({ title, subtitle }: ResultadosProps) {
  return (
    <section
      id="resultados"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1200px] mx-auto"
    >
      <h2 className="text-[var(--purple)] text-right text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
        {title}
      </h2>
      <p className="text-[var(--red)] text-right text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
        {subtitle}
      </p>
      <div className="mt-4 sm:mt-6 h-[3px] md:h-1 w-full bg-[var(--purple-light)]" />
    </section>
  );
}
