/**
 * Modelo de dominio de un servicio que presta Kodecol (automatización, IA a la
 * medida, desarrollo web, ...). TypeScript puro: este módulo no importa nada.
 *
 * El schema zod del adaptador está anclado a estos tipos con
 * `z.ZodType<ServiceOffering>`: si divergen, el compilador falla.
 */

/** Iconografía lineal del servicio. Es contrato de contenido, no del design system. */
export type ServiceIconName =
  | "automation"
  | "mobile"
  | "desktop"
  | "web"
  | "ai"
  | "custom";

/** Encabezado común de cada bloque de la página: eyebrow + H2 + bajada. */
export interface ServiceSectionHeading {
  eyebrow: string;
  title: string;
  description: string;
}

/**
 * CTA de contacto. Guarda el mensaje, nunca la URL: el número de WhatsApp vive
 * en site_config y el href se arma en el componente (architecture.md §6).
 */
export interface ServiceCta {
  label: string;
  whatsapp_message: string;
}

/** Lo que se ve en la tarjeta de la landing (#servicios) y en el índice. */
export interface ServiceTeaser {
  title: string;
  description: string;
  /** Solo la celda estrella lleva badge; el resto va en null. */
  badge: string | null;
  featured: boolean;
}

export interface ServiceHero {
  eyebrow: string;
  headline_lead: string;
  headline_accent: string;
  description: string;
  chips: readonly string[];
  primary_cta: ServiceCta;
  secondary_cta_label: string;
}

export interface ServicePainPoint {
  title: string;
  description: string;
}

export interface ServiceProblem extends ServiceSectionHeading {
  items: readonly ServicePainPoint[];
  /** Cierre en voz de Kodecol, para que el bloque no termine en queja. */
  closing_note: string;
}

export interface ServiceDeliverable {
  title: string;
  description: string;
  items: readonly string[];
}

export interface ServiceDeliverables extends ServiceSectionHeading {
  items: readonly ServiceDeliverable[];
}

export interface ServiceProcessStep {
  title: string;
  description: string;
  /** Expectativa de tiempo del paso, ej. "3 a 5 días". */
  duration: string;
}

export interface ServiceProcess extends ServiceSectionHeading {
  steps: readonly ServiceProcessStep[];
}

export interface ServiceTechGroup {
  title: string;
  items: readonly string[];
}

export interface ServiceTechnologies extends ServiceSectionHeading {
  groups: readonly ServiceTechGroup[];
  /** Por qué estas herramientas: evita que el bloque sea una lista muerta. */
  note: string;
}

export interface ServiceMetric {
  value: string;
  label: string;
  description: string;
}

export interface ServiceUseCase {
  sector: string;
  title: string;
  description: string;
  result: string;
}

export interface ServiceResults extends ServiceSectionHeading {
  metrics: readonly ServiceMetric[];
  use_cases: readonly ServiceUseCase[];
}

/** Pregunta y respuesta en texto plano: alimenta el JSON-LD FAQPage. */
export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceFaq extends ServiceSectionHeading {
  items: readonly ServiceFaqItem[];
}

export interface ServiceClosing {
  title: string;
  description: string;
  primary_cta: ServiceCta;
  secondary_cta_label: string;
  note: string;
}

export interface ServiceSeo {
  title: string;
  description: string;
  keywords?: readonly string[];
}

export interface ServiceOffering {
  slug: string;
  name: string;
  icon: ServiceIconName;
  /** Orden en el bento de la landing, en el índice y en "otros servicios". */
  order: number;
  teaser: ServiceTeaser;
  hero: ServiceHero;
  problem: ServiceProblem;
  deliverables: ServiceDeliverables;
  process: ServiceProcess;
  technologies: ServiceTechnologies;
  results: ServiceResults;
  faq: ServiceFaq;
  closing: ServiceClosing;
  seo: ServiceSeo;
}
