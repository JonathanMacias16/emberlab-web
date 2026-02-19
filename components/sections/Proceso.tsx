export default function Proceso() {
  return (
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
  );
}
