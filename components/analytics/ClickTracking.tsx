"use client";

import { useEffect } from "react";
import { trackCustomEvent, trackEvent } from "@/lib/analytics";

/** Links de contacto directo: para Meta valen como `Contact`. */
const CONTACT_HOSTS = ["wa.me", "api.whatsapp.com", "web.whatsapp.com"];
const CONTACT_PROTOCOLS = ["mailto:", "tel:"];

/** Destino del formulario de brief; su click es el CTA principal del embudo. */
const FORM_PATH = "/brief-web";

/** Etiqueta legible del elemento, para identificarlo en Eventos de Meta/GA4. */
function labelFor(el: HTMLElement) {
  const text =
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.textContent ||
    "";
  return text.replace(/\s+/g, " ").trim().slice(0, 60) || "sin-etiqueta";
}

/**
 * Escucha los clicks de toda la página y los reporta al pixel de Meta y a GA4.
 * Va como listener global (en vez de un onClick por componente) para que
 * cualquier link o botón quede cubierto, incluidos los que se agreguen después.
 *
 * El pixel por sí solo únicamente manda `PageView`; sin esto, Meta no registra
 * ninguna interacción con botones ni links.
 */
export default function ClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Sanity Studio es uso interno: no tiene caso mandarlo a los anuncios.
      if (window.location.pathname.startsWith("/studio")) return;

      const target = event.target as HTMLElement | null;
      const el = target?.closest?.("a, button") as HTMLElement | null;
      if (!el) return;

      const label = labelFor(el);
      const href = el.getAttribute("href") || "";

      if (
        CONTACT_PROTOCOLS.some((p) => href.startsWith(p)) ||
        CONTACT_HOSTS.some((h) => href.includes(h))
      ) {
        trackEvent("Contact", { content_name: label, destination: href });
        return;
      }

      if (href.includes(FORM_PATH)) {
        trackCustomEvent("ClickCTAFormulario", {
          content_name: label,
          destination: href,
        });
        return;
      }

      trackCustomEvent("ClickBoton", {
        content_name: label,
        destination: href || "accion",
      });
    };

    // En captura, para registrarlo aunque el handler del componente detenga
    // la propagación del evento.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
