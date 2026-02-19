import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function ParaTi() {
  return (
    <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Para ti */}
        <div>
          <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[-0.05em] leading-[0.85]">
            Este servicio es
            <br />
            para ti si…
          </h2>
          <div className="mt-4 sm:mt-6 md:mt-8 rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--green-light)]/50 p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-[-0.03em] leading-[1.1]">
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">🔥</span>
                <span>Tu empresa ha crecido y tu web ya no la representa</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">🔥</span>
                <span>Necesitas digitalizar procesos o comunicación</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">🔥</span>
                <span>Tomas decisiones de marketing o negocio</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">🔥</span>
                <span>Buscas claridad antes de ejecutar</span>
              </li>
            </ul>
          </div>
        </div>
        {/* No para ti */}
        <div>
          <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-[-0.05em] leading-[0.85]">
            Y no es para
            <br />
            ti si…
          </h2>
          <div className="mt-4 sm:mt-6 md:mt-8 rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--red-light)]/50 p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-[-0.03em] leading-[1.1]">
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">❌</span>
                <span>Solo buscas &ldquo;un rediseño rápido&rdquo;</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">❌</span>
                <span>No tienes objetivos claros</span>
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="shrink-0">❌</span>
                <span>Quieres una plantilla sin estrategia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
        <ButtonPrimary variant="purple">Evaluar mi sitio web</ButtonPrimary>
      </div>
    </section>
  );
}
