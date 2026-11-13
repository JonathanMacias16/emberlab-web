import { sanityFetch } from "@/sanity/lib/live";
import { LANDING_WEB_QUERY } from "@/sanity/lib/queries";
import { defaultLandingWebData } from "@/sanity/lib/landing-web-defaults";
import type { LandingWebData } from "@/types/sanity";

/** Contenido de la landing en Sanity, o los textos por defecto si no responde. */
export async function getLandingData(): Promise<LandingWebData> {
  try {
    const result = await sanityFetch({ query: LANDING_WEB_QUERY });
    const data = result.data as LandingWebData | null;
    if (data) return data;
  } catch {
    // Sanity no configurado: se usan los textos por defecto.
  }
  return defaultLandingWebData;
}
