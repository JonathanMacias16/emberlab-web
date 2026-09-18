import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token } from "./token";

/**
 * Live Content API: `sanityFetch` reemplaza a `client.fetch` y `<SanityLive />`
 * (montado en el layout raíz) refresca el contenido en cuanto cambia en Sanity,
 * sin recargar la página. En modo borrador además sirve los drafts.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
