/** Íconos de línea de los banners de agenda y formulario (24×24, trazo de 2). */
const BASE = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-5 w-5 sm:h-6 sm:w-6 shrink-0",
};

export function TagIcon() {
  return (
    <svg {...BASE}>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg {...BASE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function VideoIcon() {
  return (
    <svg {...BASE}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m16 10 6-3v10l-6-3" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg {...BASE}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
