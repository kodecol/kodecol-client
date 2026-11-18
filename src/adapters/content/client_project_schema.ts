import { z } from "zod";
import type { ClientProject } from "@/core/domain/client_project";

/*
  Schema zod espejo del dominio: z.ZodType<ClientProject> hace que el compilador
  falle si el schema y el dominio divergen. Además es el gate de calidad: una
  ficha sin capturas, sin callouts o con un callout fuera de la imagen rompe el
  build a propósito.
*/

const text = z.string().min(1);
const percent = z.number().min(0).max(100);

const image_schema = z.object({
  src_base: z
    .string()
    .startsWith("/images/", "los assets viven en public/images/")
    .refine((value) => !/\.(png|jpe?g|webp|avif)$/i.test(value), "src_base va SIN extensión"),
  fallback_extension: z.enum(["png", "jpg"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
});

const note_schema = z.object({ title: text, description: text });

export const client_project_schema: z.ZodType<ClientProject> = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "el slug va en kebab-case: neon-night"),
  order: z.number().int().nonnegative(),
  name: text,
  sector: text,
  city: text,
  year: z.string().regex(/^\d{4}$/),
  status: z.enum(["live", "building"]),
  site_url: z.string().url().nullable(),
  scene: z.object({
    background: image_schema,
    foreground: image_schema,
    entry: text,
    word: text,
    remate: text,
    word_top: percent,
  }),
  teaser: z.object({
    accent: text,
    summary: z.string().min(60, "la tarjeta necesita una frase que venda, no un rótulo"),
    bullets: z.array(text).min(2).max(4),
    chips: z.array(text).min(1),
  }),
  detail: z.object({
    headline_lead: text,
    headline_accent: text,
    summary: z.string().min(80),
    desktop_shots: z.array(image_schema).length(3, "la ficha usa 3 capturas de escritorio"),
    mobile_shot: image_schema,
    callouts: z
      .array(
        z.object({
          side: z.enum(["left", "right"]),
          x: percent,
          y: percent,
          kicker: text,
          title: text,
          description: text,
        }),
      )
      .min(2)
      .max(6),
    crop: z.object({ x: percent, y: percent, width: percent, height: percent, label: text }),
    mobile_notes: z.array(note_schema).min(2),
    flow: z.array(note_schema).length(3, "el recorrido son 3 pasos, uno por captura"),
    spec: z.array(z.object({ label: text, value: text })).min(4),
  }),
  /* Mismas longitudes SEO que el resto de fichas. */
  seo: z.object({
    title: z.string().min(1).max(55),
    description: z.string().min(70).max(165),
  }),
});
