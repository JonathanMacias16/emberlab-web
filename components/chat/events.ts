/**
 * Cualquier enlace a este ancla abre el chat de diagnóstico en vez de navegar.
 * Así un CTA editado en Sanity puede abrirlo sin tocar código.
 */
export const CHAT_ANCHOR = "#diagnostico";

/**
 * `ChatBubble` lo emite en `window` al abrirse o cerrarse (`detail.open`), para
 * que la burbuja de WhatsApp no quede debajo del panel.
 */
export const CHAT_TOGGLE_EVENT = "emberlab:chat-toggle";

export type ChatToggleDetail = { open: boolean };
