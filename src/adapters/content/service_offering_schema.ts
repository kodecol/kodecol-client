import { z } from "zod";
import type { ServiceOffering } from "@/core/domain/service_offering";

/*
  Schema zod espejo del dominio: la anotación z.ZodType<ServiceOffering> hace que
  el compilador falle si el schema y el dominio divergen.

  Los mínimos de longitud y de cardinalidad son el gate anti-thin-content: una
  página de servicio con dos entregables y una FAQ de una línea rompe el build y
  no llega a publicarse. Google trata seis páginas casi vacías como duplicadas y
  no posiciona ninguna, así que esto no es celo: es el requisito.
*/

const text = z.string().min(1);

/** Párrafo de venta: por debajo de 80 caracteres es relleno. */
const paragraph = z.string().min(80, "un párrafo de menos de 80 caracteres es relleno");

const cta_schema = z.object({
  label: text,
  whatsapp_message: z
    .string()
    .min(20, "el mensaje prellenado de WhatsApp debe decir algo útil"),
});

/** Campos comunes a todos los bloques de la página. */
const section_fields = {
  eyebrow: text,
  title: text,
  description: paragraph,
};

const teaser_schema = z.object({
  title: text,
  description: z.string().min(60),
  badge: text.nullable(),
  featured: z.boolean(),
});

const hero_schema = z.object({
  eyebrow: text,
  headline_lead: text,
  headline_accent: text,
  description: paragraph,
  chips: z.array(text).min(3),
  primary_cta: cta_schema,
  secondary_cta_label: text,
});

const pain_point_schema = z.object({ title: text, description: paragraph });

const problem_schema = z.object({
  ...section_fields,
  items: z.array(pain_point_schema).min(3),
  closing_note: text,
});

const deliverable_schema = z.object({
  title: text,
  description: paragraph,
  items: z.array(text).min(2),
});

const deliverables_schema = z.object({
  ...section_fields,
  items: z.array(deliverable_schema).min(4, "menos de 4 entregables es thin content"),
});

const process_step_schema = z.object({
  title: text,
  description: paragraph,
  duration: text,
});

const process_schema = z.object({
  ...section_fields,
  steps: z.array(process_step_schema).min(3),
});

const tech_group_schema = z.object({
  title: text,
  items: z.array(text).min(3),
});

const technologies_schema = z.object({
  ...section_fields,
  groups: z.array(tech_group_schema).min(3),
  note: text,
});

const metric_schema = z.object({
  value: text,
  label: text,
  description: text,
});

const use_case_schema = z.object({
  sector: text,
  title: text,
  description: paragraph,
  result: text,
});

const results_schema = z.object({
  ...section_fields,
  metrics: z.array(metric_schema).min(3),
  use_cases: z.array(use_case_schema).min(2),
});

const faq_item_schema = z.object({
  question: text,
  /* Una respuesta de una línea no sirve ni al lector ni al FAQPage. */
  answer: z.string().min(120, "una respuesta de FAQ útil pasa de 120 caracteres"),
});

const faq_schema = z.object({
  ...section_fields,
  items: z.array(faq_item_schema).min(3).max(6),
});

const closing_schema = z.object({
  title: text,
  description: paragraph,
  primary_cta: cta_schema,
  secondary_cta_label: text,
  note: text,
});

export const service_offering_schema: z.ZodType<ServiceOffering> = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "el slug va en kebab-case: automatizacion-de-procesos"),
  name: text,
  icon: z.enum(["automation", "mobile", "desktop", "web", "ai", "custom"]),
  order: z.number().int().min(1),
  teaser: teaser_schema,
  hero: hero_schema,
  problem: problem_schema,
  deliverables: deliverables_schema,
  process: process_schema,
  technologies: technologies_schema,
  results: results_schema,
  faq: faq_schema,
  closing: closing_schema,
  /* Mismas longitudes SEO que perfiles y marcas: ver developer_profile_schema.ts. */
  seo: z.object({
    title: z.string().min(1).max(55, "con el sufijo \" · Kodecol\" el title pasaría de 65 y la SERP lo truncaría"),
    description: z
      .string()
      .min(70, "una description de menos de 70 caracteres desaprovecha el snippet")
      .max(165, "la description se trunca en la SERP pasados ~165 caracteres"),
    keywords: z.array(text).min(1).optional(),
  }),
});
