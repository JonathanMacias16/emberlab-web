"use client";

import dynamic from "next/dynamic";

/**
 * `<VisualEditing />` arrastra `@sanity/ui`, que se compila con el JSX clásico y
 * espera un `React` global: al evaluarlo en el servidor truena con
 * "React is not defined". Cargándolo con `ssr: false` nunca se evalúa en el
 * servidor. Mismo patrón que usa `app/studio/[[...tool]]/page.tsx` con NextStudio.
 */
const VisualEditing = dynamic(
  () => import("next-sanity/visual-editing").then((mod) => mod.VisualEditing),
  { ssr: false }
);

export default function VisualEditingLoader() {
  return <VisualEditing />;
}
