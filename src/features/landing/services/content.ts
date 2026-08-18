import type { ServicesContent } from "./types";

/* Copy fiel al mockup (sección #servicios, bento A: estrella + apoyos).
   Los seis servicios los aporta el repositorio; aquí solo vive el marco. */
export const SERVICES_CONTENT = {
  eyebrow: "Lo que construimos",
  title: "Soluciones que se sienten, que se usan y que generan resultados.",
  subtitle:
    "Desde una automatización puntual hasta un producto digital completo. Diseñamos cada solución para resolver un problema real y generar valor tangible.",
  card_link_label: "Ver servicio",
  cta_lead: "¿No ves lo que buscas? ",
  cta_emphasis: "Cuéntanos tu idea",
  cta_tail: " y la construimos contigo.",
  cta_link_label: "Hablemos →",
} as const satisfies ServicesContent;
