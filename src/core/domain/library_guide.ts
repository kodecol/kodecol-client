/**
 * Guía de la Biblioteca de Kodecol (kodecol.co/biblioteca/guias/<slug>).
 *
 * Cada guía cuenta cómo hicimos una pieza con IA: el prompt, el paso a paso,
 * de dónde salió cada recurso y un archivo .md para dárselo a Claude. Añadir
 * una guía = un JSON en content/biblioteca/guias + sus medios en
 * public/biblioteca/guias/<slug>; cero código.
 *
 * El slug es el enlace que se manda por mensaje directo cuando alguien comenta
 * en un reel: NO se cambia nunca después de publicar.
 */

/** Tema de la guía. Las guías se filtran por tema dentro de la sección. */
export type GuideTopic =
  | "video-con-ia"
  | "automatizacion"
  | "agentes-de-ia"
  | "software-y-apps";

export type GuideLevel = "principiante" | "intermedio" | "avanzado";

/** Un renglón con un arranque en negrita opcional: «**Claude.** Lo hicimos…». */
export interface GuideLine {
  lead?: string;
  text: string;
  /** Enlace opcional a la página oficial de la herramienta. */
  link?: { label: string; href: string };
}

export interface GuideStep {
  title: string;
  text: string;
}

/**
 * Campo del personalizador. Un mismo dato aparece con corchetes distintos en
 * la versión rápida y en la completa («[tu frase]», «[tu mensaje en una
 * línea]»): `tokens` los agrupa para que un solo campo los reemplace todos.
 */
export interface PromptField {
  id: string;
  label: string;
  placeholder: string;
  /** Corchetes completos, tal como aparecen en el prompt: «[tu negocio]». */
  tokens: readonly string[];
}

export interface GuidePrompt {
  quick: string;
  full: string;
  fields: readonly PromptField[];
}

export interface GuideSourceGroup {
  title: string;
  items: readonly GuideLine[];
}

export interface LibraryGuide {
  slug: string;
  /** Pieza de Instagram que trae a la gente (K-05). Solo para medición. */
  piece: string;
  title: string;
  /** Palabra del título que va en menta. Debe aparecer tal cual en `title`. */
  title_keyword: string;
  /** La línea de qué vas a crear. */
  summary: string;
  intro: string;
  topic: GuideTopic;
  level: GuideLevel;
  duration: string;
  made_with: readonly string[];
  /** ISO 8601 (AAAA-MM-DD). La más reciente va destacada. */
  published_at: string;
  /** Duración de los dos videos, en segundos: el final y el publicado en Instagram. */
  video_seconds: { result: number; published: number };
  before_you_start: readonly GuideLine[];
  prompt: GuidePrompt;
  steps: readonly GuideStep[];
  sources: {
    title: string;
    groups: readonly GuideSourceGroup[];
    rule: string;
  };
  lessons: readonly GuideStep[];
  download: {
    title: string;
    text: string;
    usage: string;
  };
  closing: {
    title: string;
    title_keyword: string;
    text: string;
    whatsapp_message: string;
  };
  related: readonly string[];
  legal: string;
  seo: {
    title: string;
    description: string;
  };
}

export const GUIDE_TOPIC_LABELS: Readonly<Record<GuideTopic, string>> = {
  "video-con-ia": "Video con IA",
  automatizacion: "Automatización",
  "agentes-de-ia": "Agentes de IA",
  "software-y-apps": "Software y apps",
};

export const GUIDE_LEVEL_LABELS: Readonly<Record<GuideLevel, string>> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};
