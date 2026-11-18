import type { ServicesContent } from "./types";

/* Copy de la sección #servicios (atmósfera Cielo). Los seis servicios los aporta
   el repositorio; aquí solo vive el marco. */
export const SERVICES_CONTENT = {
  eyebrow: "Servicios",
  title_lead: "Seis formas de ",
  title_accent: "crecer con software.",
  subtitle:
    "Empezamos por el problema, nunca por la herramienta. Y si tu caso no necesita lo que vendemos, te lo decimos.",
  cta_lead: "¿No sabes cuál necesitas?",
  cta_text: " Cuéntanos el problema con tus palabras. Te decimos qué haríamos, aunque la respuesta sea «todavía no».",
  cta_label: "Escríbenos",
} as const satisfies ServicesContent;
