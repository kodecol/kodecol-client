import { SITE_CONFIG } from "@/shared/config/site_config";
import type { HeroContent } from "./types";

/* Copy del héroe (#inicio). La frase es la promesa oficial (KNOWLEDGE_BASE §1). */
export const HERO_CONTENT = {
  title: "El software que tu empresa necesita para crecer de verdad.",
  entry: "el software que tu empresa necesita para",
  word: "crecer",
  remate: "de verdad.",
  primary_cta: {
    label: "Cuéntanos tu caso",
    href: SITE_CONFIG.whatsapp_url,
    external: true,
  },
  secondary_cta: {
    label: "Ver proyectos",
    href: "/proyectos",
    external: false,
  },
  microcopy: "Hablas directo con quien construye. Sin formularios.",
  intro_lead: "Páginas que venden, procesos que corren solos e ",
  intro_emphasis: "inteligencia artificial que no inventa datos",
  intro_tail: ". Lo diseñamos, lo construimos y lo dejamos funcionando.",
  band_label: "Trabajo real · en línea hoy",
} as const satisfies HeroContent;
