"use client";

import { useSyncExternalStore } from "react";

/**
 * Botón para salir del modo borrador.
 *
 * Dentro de la Presentation Tool el sitio va en un iframe y es el Studio quien
 * controla el modo, así que ahí el botón sobra: solo se muestra cuando la
 * página es la ventana principal.
 *
 * Nota: no usamos `useDraftModeEnvironment` de `next-sanity/hooks` porque
 * arrastra `@sanity/ui` al render del servidor y revienta con
 * "React is not defined". La detección de iframe hace el mismo trabajo.
 */
export default function DisableDraftMode() {
  // El servidor no sabe si va dentro de un iframe, así que su snapshot es
  // `false` y el botón solo aparece tras hidratar. Nunca cambia en runtime, por
  // eso la suscripción es un no-op.
  const isTopWindow = useSyncExternalStore(
    () => () => {},
    () => window.self === window.top,
    () => false
  );

  if (!isTopWindow) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-50 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg"
    >
      Salir de vista previa
    </a>
  );
}
