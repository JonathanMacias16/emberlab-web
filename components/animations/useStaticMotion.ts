"use client";

import { useEffect, useState } from "react";

const FLAG = "emberlab:noanim";

/**
 * Devuelve `true` cuando las animaciones de entrada deben desactivarse y todo
 * tiene que renderizarse ya visible.
 *
 * Existe por la Event Setup Tool de Meta: escanea el DOM una sola vez al cargar
 * y descarta los elementos con `opacity: 0`, así que con las animaciones activas
 * no detecta los CTAs de la landing (todos viven dentro de un `whileInView`).
 * Abriendo el sitio con `?noanim=1` la herramienta los ve todos.
 *
 * La bandera se guarda en `sessionStorage` para que sobreviva a la navegación
 * de cliente (p. ej. al pasar de la landing a `/brief-web` dentro de la
 * herramienta). También respeta `prefers-reduced-motion`.
 */
export default function useStaticMotion() {
  // Arranca en `false` para que el render de hidratación coincida con el HTML
  // del servidor, que no puede conocer la query string (la landing es estática).
  const [staticMotion, setStaticMotion] = useState(false);

  useEffect(() => {
    const fromUrl =
      new URLSearchParams(window.location.search).get("noanim") === "1";

    let fromSession = false;
    try {
      if (fromUrl) sessionStorage.setItem(FLAG, "1");
      fromSession = sessionStorage.getItem(FLAG) === "1";
    } catch {
      // sessionStorage bloqueado (modo privado / cookies de terceros)
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (fromUrl || fromSession || reducedMotion) {
      // Es un valor que sólo existe en el cliente, así que el segundo render es
      // inevitable: no hay forma de saberlo durante el render de hidratación.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStaticMotion(true);
    }
  }, []);

  return staticMotion;
}
