import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/**
 * La Presentation Tool llama a esta ruta para activar el modo borrador de
 * Next.js y poder previsualizar contenido sin publicar.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
