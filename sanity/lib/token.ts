/**
 * Token de lectura de Sanity (rol Viewer) usado solo en el servidor y en el
 * navegador cuando el modo borrador está activo. Permite leer documentos sin
 * publicar para la vista previa de la Presentation Tool.
 *
 * Se obtiene en sanity.io/manage → API → Tokens.
 */
export const token = process.env.SANITY_API_READ_TOKEN;
