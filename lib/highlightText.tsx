import { ReactNode } from "react";

/**
 * Parses a string with highlight markers and returns JSX.
 * *word*   → var(--red)
 * **word** → var(--green-light)
 * Example: "Empecemos con **claridad.**" → "Empecemos con " + <span green>claridad.</span>
 */
export function highlightText(text: string | undefined): ReactNode {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} style={{ color: "var(--green-light)" }}>
          {part.slice(2, -2)}
        </span>
      );
    }
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
