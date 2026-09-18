import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/**
 * Le dice al Studio en qué URL del sitio vive cada documento, para poder saltar
 * de la edición a la vista previa (y al revés) con un clic.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    landingPage: defineLocations({
      locations: [{ title: "Página de inicio", href: "/web" }],
    }),
    landingWeb: defineLocations({
      locations: [{ title: "Landing Web", href: "/landing" }],
    }),
  },
};
