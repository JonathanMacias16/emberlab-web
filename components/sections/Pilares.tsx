import PilarCard from "@/components/ui/PilarCard";

const pilares = [
  {
    title: "Plataformas según el objetivo",
    description:
      "No creemos en una sola solución para todos. Trabajamos con diferentes plataformas según lo que tu negocio necesita hoy y mañana.",
    bg: "bg-[#caa4cc]",
    textColor: "text-[var(--purple)]",
    position: "left-[34.8%] top-[12.9%]",
    className: "z-40",
  },
  {
    title: "Estructuras Claras",
    description:
      "Organizamos la información para que el usuario entienda, confíe y actúe.",
    bg: "bg-[var(--purple)]",
    textColor: "text-[#edeae7]",
    position: "left-[59.8%] top-[20.1%]",
    className: "-rotate-[9deg] z-30",
  },
  {
    title: "Diseño Personalizado",
    description:
      "Cada sitio se diseña desde cero, alineado a tu marca y a tus objetivos, no desde plantillas genéricas.",
    bg: "bg-[var(--green-light)]",
    textColor: "text-[var(--purple)]",
    position: "left-[7.4%] top-[30%]",
    className: "rotate-[9deg] z-20",
  },
  {
    title: "Funcionalidad Real",
    description:
      "Diseñamos para que tu sitio funcione: rápido, claro y medible.",
    bg: "bg-[#f3a5a6]",
    textColor: "text-[var(--purple)]",
    position: "left-[36.3%] top-[28.5%]",
    className: "z-10",
  },
];

export default function Pilares() {
  return (
    <section
      id="pilares"
      className="px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-[1728px] mx-auto"
    >
      <p className="text-[var(--red)] text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-[-0.05em] leading-[0.85]">
        4 pilares claros
      </p>
      <h2 className="text-[var(--purple)] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-[-0.05em] leading-[0.85] mt-2 sm:mt-3 md:mt-4">
        Qué hacemos diferente.
      </h2>
      {/* canvas Pencil: 1344×957 → paddingBottom = 957/1344 = 71.2% */}
      <div className="relative w-full mt-12 sm:mt-16 md:mt-10 lg:mt-0 pb-[71.2%]">
        {pilares.map((pilar) => (
          <PilarCard
            key={pilar.title}
            title={pilar.title}
            description={pilar.description}
            bg={pilar.bg}
            textColor={pilar.textColor}
            position={pilar.position}
            className={pilar.className}
          />
        ))}
      </div>
    </section>
  );
}
