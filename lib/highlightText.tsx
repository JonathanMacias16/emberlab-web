import { ReactNode } from "react";

/**
 * Parses a string with *highlighted* markers and returns JSX.
 * Text wrapped in *...* is rendered in var(--red).
 * Example: "Nuestro proceso es *claro.*" → "Nuestro proceso es " + <span style red>claro.</span>
 */
export function highlightText(text: string | undefined): ReactNode {
  if (!text) return null;

  const parts = text.split(/(\*[^*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={i} style={{ color: "var(--red)" }}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}
