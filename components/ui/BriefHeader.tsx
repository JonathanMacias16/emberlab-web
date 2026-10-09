import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";

/**
 * Logo y barra de progreso del brief. Lo comparten el formulario
 * (`/brief-web`) y la página de gracias (`/brief-web/gracias`), para que el
 * salto entre las dos no se note.
 */
export default function BriefHeader({
  progress,
  done = false,
}: {
  progress: number;
  done?: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center px-5 sm:px-8 md:px-12 py-5 sm:py-6 flex-shrink-0">
        <Link
          href="/landing"
          aria-label="Volver a EmberLab"
          className="flex items-center gap-2"
        >
          <LogoIcon className="w-8 h-8" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 px-5 sm:px-8 md:px-12 flex-shrink-0">
        <div
          className="h-1.5 flex-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-400 ease-out"
            style={{
              backgroundColor: done ? "var(--green-light)" : "var(--red)",
              width: `${progress}%`,
            }}
          />
        </div>
        <span
          className={`text-sm font-semibold tabular-nums w-11 text-right flex-shrink-0 transition-colors ${
            done ? "text-(--green-light)" : "text-(--purple-light)"
          }`}
        >
          {progress}%
        </span>
      </div>
    </>
  );
}
