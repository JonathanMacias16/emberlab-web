import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function CTAFinal() {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1400px] mx-auto">
      <h2 className="text-[var(--purple)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
        Empecemos
        <br />
        con claridad.
      </h2>
      <p className="text-[var(--purple-soft)] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6 md:mt-8">
        Si tu sitio web ya no acompaña el momento de tu empresa, es momento de
        repensarlo.
      </p>
      <div className="mt-6 sm:mt-8 md:mt-10 flex justify-end">
        <ButtonPrimary variant="red">Evaluar mi sitio actual</ButtonPrimary>
      </div>
    </section>
  );
}
