import Image from "next/image";

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 349 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crosshair icon */}
      <g transform="translate(0, 0)">
        <rect
          x="37.9"
          y="0"
          width="5.34"
          height="81.14"
          fill="var(--red)"
        />
        <rect
          x="0"
          y="37.9"
          width="81.14"
          height="5.34"
          fill="var(--red)"
        />
        <g transform="translate(12.53, 13.19)">
          <path
            d="M3.22 0l46.21 44.74-3.22 3.3-46.21-44.74 3.22-3.3z"
            fill="var(--red)"
          />
          <path
            d="M37.47 3.22l-34.16 35.64-3.31-3.22 34.17-35.64 3.3 3.22z"
            fill="var(--red)"
          />
        </g>
      </g>
      {/* "ember" text */}
      <g transform="translate(99.08, 23.71)">
        <path
          d="M18.42 41.04c4.08 0 7.44-2.4 8.4-6.06l0.36 0.54-1.8 6.48-25.38 0 0-0.24c0.72 0 2.04-0.72 2.04-3.6l0-34.32c0-2.88-1.32-3.6-2.04-3.6l0-0.24 25.38 0 1.8 6.48-0.36 0.54c-0.96-3.66-4.32-6.06-8.4-6.06l-13.14 0 0 16.2 12.24 0c4.68 0 5.28-3.18 5.28-4.8l0.24 0 0 10.2-0.24 0c0-1.5-0.66-4.8-5.28-4.8l-12.24 0 0 23.28 13.14 0z"
          fill="var(--purple)"
        />
        <path
          d="M21.6 29.46l16.74-29.46 3.42 0 0 0.24c-0.72 0-2.04 0.72-2.04 3.6l0 34.32c0 2.88 1.32 3.6 2.04 3.6l0 0.24-7.32 0 0-0.24c0.72 0 2.04-0.72 2.04-3.6l0-32.76-14.4 24.9 1.08 1.92c3.48 6.12 1.8 10.32-2.1 10.32-4.62 0-5.04-5.94-1.8-10.14l-16.26-28.5 0 34.26c0 2.88 1.32 3.6 2.04 3.6l0 0.24-5.04 0 0-0.24c0.72 0 2.04-0.72 2.04-3.6l0-34.32c0-2.88-1.32-3.6-2.04-3.6l0-0.24 4.68 0 16.92 29.46z m-0.84 12.06c1.98 0 2.4-2.28 0.42-5.76l-1.38-2.46c-2.4 3.3-1.98 8.22 0.96 8.22z"
          fill="var(--purple)"
          transform="translate(29.28, 0)"
        />
        <path
          d="M15.24 0c6.24 0 10.32 3.54 10.32 8.52 0 3.84-2.4 6.54-6.72 7.26 5.34 0.84 10.08 4.38 10.08 12.78 0 8.4-4.38 13.44-14.28 13.44l-14.64 0 0-0.24c0.3 0 1.56-0.84 1.56-3.6l0-34.32c0-2.76-1.26-3.6-1.56-3.6l0-0.24 15.24 0z m-10.44 19.8c1.44-2.22 6.36-4.2 11.4-4.2 4.44-0.42 6.06-3.12 6.06-6.72 0-4.74-2.88-7.92-7.14-7.92l-10.32 0 0 18.84z m10.14 21.24c6.96 0 10.74-4.5 10.74-12.24 0-9.3-5.46-12.3-10.86-12.3-4.32 0-8.58 1.92-10.02 4.08l0 20.46 10.14 0z"
          fill="var(--purple)"
          transform="translate(74.64, 0)"
        />
        <path
          d="M5.28 41.04l13.14 0c4.08 0 7.44-2.4 8.4-6.06l0.36 0.54-1.8 6.48-25.38 0 0-0.24c0.72 0 2.04-0.72 2.04-3.6l0-34.32c0-2.88-1.32-3.6-2.04-3.6l0-0.24 25.38 0 1.8 6.48-0.36 0.54c-0.96-3.66-4.32-6.06-8.4-6.06l-13.14 0 0 13.98c1.98-1.74 3.6-2.46 5.04-2.46 4.92 0 7.26 7.8 10.26 7.8 0.96 0 1.98-0.84 3.18-2.88l0.12 0.06c-1.5 4.02-2.82 5.46-3.96 5.46-3.06 0-5.58-9.48-10.26-9.48-1.26 0-2.7 0.66-4.38 2.46l0 25.14z"
          fill="var(--purple)"
          transform="translate(106.56, 0)"
        />
        <path
          d="M0 42l0-0.24c0.3 0 1.56-0.84 1.56-3.6l0-34.32c0-2.76-1.26-3.6-1.56-3.6l0-0.24 14.76 0c15.36 0 16.92 23.22-0.12 23.22-3.72 0-5.58-1.2-5.7-1.2-0.12 0 1.14 0.96 3.66 4.68 5.4 7.86 9.6 15.3 16.44 15.3l-4.86 0c-5.52-0.66-11.4-8.94-15.48-15.36-2.7-4.26-2.52-5.34-1.2-5.34 1.32 0 3.78 1.08 5.7 1.08 14.58 0 12.6-21.78 0.24-21.78l-8.64 0 0 37.56c0 2.76 1.26 3.6 1.56 3.6l0 0.24-6.36 0z"
          fill="var(--purple)"
          transform="translate(135.84, 0)"
        />
      </g>
      {/* "LAB" text */}
      <g transform="translate(270.26, 23.59)">
        <path
          d="M8.16 0l2.52 0-7.74 39.66 15.3 0-0.42 2.34-17.82 0 8.16-42z"
          fill="var(--purple-light)"
        />
        <path
          d="M20.1 0l2.7 0 3.84 42-2.52 0-1.32-14.58-13.14 0-6.9 14.58-2.76 0 20.1-42z m2.46 25.07l-1.32-17.04c-0.18-1.8-0.18-5.04-0.18-5.04l-0.12 0c0 0-1.2 3.18-2.1 5.04l-8.16 17.04 11.88 0z"
          fill="var(--purple-light)"
          transform="translate(20.16, 0)"
        />
        <path
          d="M8.16 0l8.88 0c2.16 0 4.08 0.54 5.58 1.56 1.98 1.44 3.18 3.78 3.18 7.02 0 5.52-3.66 9.54-6.96 11.16l0 0.12c2.16 1.08 4.38 3.6 4.38 8.52 0 6-3.42 10.8-8.82 12.72-1.68 0.54-3.48 0.9-5.46 0.9l-8.94 0 8.16-42z m0.78 39.65c1.86 0 3.48-0.3 4.86-0.84 4.38-1.62 6.78-5.58 6.78-10.44 0-5.1-2.64-7.32-6-7.32l-8.04 0-3.6 18.6 6 0z m5.82-20.94c3.66 0 8.4-4.26 8.4-10.08 0-4.2-2.46-6.3-6.3-6.3l-6.66 0-3.18 16.38 7.74 0z"
          fill="var(--purple-light)"
          transform="translate(52.86, 0)"
        />
      </g>
    </svg>
  );
}

function ButtonPrimary({
  children,
  variant = "purple",
}: {
  children: React.ReactNode;
  variant?: "purple" | "red";
}) {
  const bg =
    variant === "purple"
      ? "bg-[var(--purple)] hover:bg-[var(--purple-soft)]"
      : "bg-[var(--red)] hover:brightness-110";
  return (
    <button
      className={`${bg} text-[var(--white)] rounded-[20px] px-10 py-4 text-lg font-medium tracking-[-0.05em] transition-all cursor-pointer`}
    >
      {children}
    </button>
  );
}

function SocialIcon({ icon }: { icon: "fb" | "ig" | "in" }) {
  const paths: Record<string, React.ReactNode> = {
    fb: (
      <path
        d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        fill="currentColor"
      />
    ),
    ig: (
      <>
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </>
    ),
    in: (
      <>
        <path
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"
          fill="currentColor"
        />
        <rect x="2" y="9" width="4" height="12" fill="currentColor" />
        <circle cx="4" cy="4" r="2" fill="currentColor" />
      </>
    ),
  };
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--white)]">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[var(--purple)]"
        fill="none"
      >
        {paths[icon]}
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[var(--white)] overflow-x-hidden">
      {/* ==================== NAV ==================== */}
      <nav className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6 md:px-12 lg:px-20 xl:px-28 lg:py-10 max-w-[1728px] mx-auto">
        <Logo className="h-8 w-auto sm:h-10 md:h-12 lg:h-14" />
        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-[var(--purple)] text-sm lg:text-base xl:text-lg font-light tracking-[-0.04em]">
          <a href="#bienvenido" className="hover:opacity-70 transition-opacity">
            Bienvenido
          </a>
          <a href="#problema" className="hover:opacity-70 transition-opacity">
            ¿Qué resolvemos?
          </a>
          <a href="#pilares" className="hover:opacity-70 transition-opacity">
            4 pilares
          </a>
          <a href="#resultados" className="hover:opacity-70 transition-opacity">
            Resultados
          </a>
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="hidden lg:flex items-center gap-2">
            <SocialIcon icon="fb" />
            <SocialIcon icon="ig" />
            <SocialIcon icon="in" />
          </div>
          <ButtonPrimary variant="purple">Evaluar mi sitio web</ButtonPrimary>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
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

      {/* ==================== SECTION 2 - EL PROBLEMA ==================== */}
      <section
        id="problema"
        className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-[var(--purple)] text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-[-0.05em] leading-[0.85] max-w-[800px]">
            El problema no es tu empresa.
            <br />
            Es tu sitio web.
          </h2>
          <div className="mt-6 sm:mt-8 md:mt-10">
            <ButtonPrimary variant="red">Contáctanos</ButtonPrimary>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 - DARK SECTION ==================== */}
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

      {/* ==================== SECTION 4 - 4 PILARES ==================== */}
      <section
        id="pilares"
        className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto"
      >
        <h2 className="text-[var(--purple)] text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
          Qué hacemos diferente.
        </h2>
        <p className="text-[var(--red-light)] text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal tracking-[-0.05em] leading-[0.85] mt-2 sm:mt-3 md:mt-4">
          4 pilares claros
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          {/* Pilar 1 */}
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--purple-light)] p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center border-4 md:border-[6px] border-[var(--white)] shadow-[12px_10px_16px_-10px_rgba(0,0,0,0.35)] md:shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)]">
            <h3 className="text-[var(--purple)] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-[-0.04em] leading-[1.1]">
              Plataformas según el objetivo
            </h3>
            <p className="text-[var(--purple)] text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[-0.04em] leading-[1.2] mt-2 sm:mt-3 md:mt-4">
              No creemos en una sola solución para todos. Trabajamos con
              diferentes plataformas según lo que tu negocio necesita hoy y
              mañana.
            </p>
          </div>
          {/* Pilar 2 */}
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--purple)] p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center border-4 md:border-[6px] border-[var(--white)] shadow-[12px_10px_16px_-10px_rgba(0,0,0,0.35)] md:shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)]">
            <h3 className="text-[var(--white)] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-[-0.04em] leading-[1.1]">
              Estructuras Claras
            </h3>
            <p className="text-[var(--white)] text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[-0.04em] leading-[1.2] mt-2 sm:mt-3 md:mt-4">
              Organizamos la información para que el usuario entienda, confíe y
              actúe.
            </p>
          </div>
          {/* Pilar 3 */}
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--green-light)] p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center border-4 md:border-[6px] border-[var(--white)] shadow-[12px_10px_16px_-10px_rgba(0,0,0,0.35)] md:shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)]">
            <h3 className="text-[var(--purple)] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-[-0.04em] leading-[1.1]">
              Diseño Personalizado
            </h3>
            <p className="text-[var(--purple)] text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[-0.04em] leading-[1.2] mt-2 sm:mt-3 md:mt-4">
              Cada sitio se diseña desde cero, alineado a tu marca y a tus
              objetivos, no desde plantillas genéricas.
            </p>
          </div>
          {/* Pilar 4 */}
          <div className="rounded-2xl md:rounded-3xl lg:rounded-[46px] bg-[var(--red-light)] p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center border-4 md:border-[6px] border-[var(--white)] shadow-[12px_10px_16px_-10px_rgba(0,0,0,0.35)] md:shadow-[23px_20px_24px_-20px_rgba(0,0,0,0.48)]">
            <h3 className="text-[var(--purple)] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-[-0.04em] leading-[1.1]">
              Funcionalidad Real
            </h3>
            <p className="text-[var(--purple)] text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[-0.04em] leading-[1.2] mt-2 sm:mt-3 md:mt-4">
              Diseñamos para que tu sitio funcione: rápido, claro y medible.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5 - PARA TI / NO PARA TI ==================== */}
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

      {/* ==================== SECTION 6 - PROCESO ==================== */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1200px] mx-auto">
        <h2 className="text-[var(--purple)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
          Nuestro proceso
          <br />
          es claro.
        </h2>
        <p className="text-[var(--red)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
          Sin promesas exageradas. Sin tecno-palabras innecesarias.
        </p>
        <div className="mt-3 sm:mt-4 h-[3px] md:h-1 w-full bg-[var(--purple-light)]" />
        <div className="mt-6 sm:mt-8 md:mt-10">
          <ol className="space-y-2 sm:space-y-3 text-[var(--purple)] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.8]">
            <li>Entendemos tu negocio y objetivos</li>
            <li>Definimos la estructura correcta</li>
            <li>Diseñamos con criterio</li>
            <li>Desarrollamos sobre la plataforma adecuada</li>
            <li>Entregamos un sitio listo para crecer contigo</li>
          </ol>
        </div>
      </section>

      {/* ==================== SECTION 7 - RESULTADOS ==================== */}
      <section
        id="resultados"
        className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1200px] mx-auto"
      >
        <h2 className="text-[var(--purple)] text-right text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
          El resultado no es solo un nuevo sitio.
        </h2>
        <p className="text-[var(--red)] text-right text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-[-0.04em] leading-[1.15] mt-4 sm:mt-6">
          Es claridad. Es una mejor toma de decisiones. Es una base digital
          alineada a la transformación de tu empresa.
        </p>
        <div className="mt-4 sm:mt-6 h-[3px] md:h-1 w-full bg-[var(--purple-light)]" />
      </section>

      {/* ==================== SECTION 8 - PORTFOLIO ==================== */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {[
            { title: "Sitio web industria B2B", img: "/Rectangle 22.png" },
            { title: "Sitio web Real Estate", img: "/Rectangle 28.png" },
            { title: "Sitio web Outdoor", img: "/Rectangle 31.png" },
            { title: "Sitio web Medicina", img: "/Rectangle 32.png" },
          ].map(({ title, img }) => (
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

      {/* ==================== SECTION 9 - CTA FINAL ==================== */}
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

      {/* ==================== FOOTER ==================== */}
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
    </div>
  );
}