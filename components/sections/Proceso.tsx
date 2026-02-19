import type { ProcessStepData } from "@/types/sanity";

interface ProcesoProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStepData[];
}

export default function Proceso({ title, subtitle, steps }: ProcesoProps) {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1200px] mx-auto">
      <h2 className="text-[var(--purple)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85] whitespace-pre-line">
        {title}
      </h2>
      <p className="text-[var(--red)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
        {subtitle}
      </p>
      <div className="mt-3 sm:mt-4 h-[3px] md:h-1 w-full bg-[var(--purple-light)]" />
      <div className="mt-6 sm:mt-8 md:mt-10">
        <ol className="space-y-2 sm:space-y-3 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.8]">
          {steps?.map((step, i) => (
            <li key={i}>{step.text}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
