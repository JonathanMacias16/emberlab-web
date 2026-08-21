import Image from "next/image";

/**
 * Lettering "CREATIVE WEBSITE CREATIVE WORKS" exportado de Figma como trazos
 * vectoriales (no es una fuente del sistema). Las cuatro piezas se apoyan en el
 * mismo borde superior y comparten factor de escala, por eso el ancho de cada
 * una se reparte en proporción a su ancho intrínseco (total 1475.125px).
 */
const WORDS = [
  { src: "/landing/word-creative-1.svg", alt: "CREATIVE", width: 398.953, height: 67.9571 },
  { src: "/landing/word-website.svg", alt: "WEBSITE", width: 358.027, height: 67.9596 },
  { src: "/landing/word-creative-2.svg", alt: "CREATIVE", width: 398.953, height: 67.9569 },
  { src: "/landing/word-works.svg", alt: "WORKS", width: 319.192, height: 69.7579 },
];

const TOTAL_WIDTH = WORDS.reduce((sum, w) => sum + w.width, 0);

/** Separación entre palabras, en % del ancho del contenedor. */
const GAP = 0.5;
/** Ancho disponible una vez descontados los 3 espacios entre las 4 palabras. */
const AVAILABLE = 100 - GAP * (WORDS.length - 1);

export default function CreativeWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start w-full ${className}`} style={{ gap: `${GAP}%` }}>
      {WORDS.map((word, i) => (
        <Image
          key={i}
          src={word.src}
          alt={word.alt}
          width={word.width}
          height={word.height}
          style={{ width: `${(word.width / TOTAL_WIDTH) * AVAILABLE}%`, height: "auto" }}
          className="block"
        />
      ))}
    </div>
  );
}
