import { z } from "zod";
import type { ProductBrand } from "@/core/domain/product_brand";

/*
  Schema zod espejo del dominio: la anotación z.ZodType<ProductBrand> hace que
  el compilador falle si el schema y el dominio divergen. El dominio manda;
  zod es el guardián de la frontera JSON (validación fail-fast en build).
*/

const text = z.string().min(1);

/** Los colores de marca son contenido, pero contenido validado. */
const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "usa un hex de 6 dígitos, ej. #fb7185");

const asset_src = z
  .string()
  .startsWith("/images/", "los assets viven en public/images/");

const theme_schema = z.object({
  ground: hex,
  surface: hex,
  surface_raised: hex,
  accent: hex,
  accent_soft: hex,
  ink: hex,
  ink_muted: hex,
  ink_dim: hex,
  line: hex,
});

const cta_schema = z.object({
  label: text,
  href: text,
  external: z.boolean(),
});

const principle_schema = z.object({
  title: text,
  description: text,
});

const metric_schema = z.object({
  value: text,
  label: text,
  featured: z.boolean(),
});

const stack_group_schema = z.object({
  title: text,
  items: z.array(text).min(1),
});

const pilot_schema = z.object({
  name: text,
  sector: text,
  description: text,
  figure: text,
});

const section = { eyebrow: text, title: text };

const teaser_schema = z.object({
  kind: text,
  status: text,
  claim_lead: text,
  claim_accent: text,
  summary: text,
  chips: z.array(text).min(1),
  cta_label: text,
});

const detail_schema = z.object({
  eyebrow: text,
  headline_lead: text,
  headline_accent: text,
  description: text,
  chips: z.array(text).min(1),
  primary_cta: cta_schema,
  origin: z.object({
    ...section,
    paragraphs: z.array(text).min(1),
  }),
  principles: z.object({
    ...section,
    quote_lead: text,
    quote_accent: text,
    items: z.array(principle_schema).min(1),
  }),
  metrics: z.object({
    ...section,
    description: text,
    items: z.array(metric_schema).min(1),
  }),
  stack: z.object({
    ...section,
    groups: z.array(stack_group_schema).min(1),
  }),
  pilots: z.object({
    ...section,
    description: text,
    items: z.array(pilot_schema).min(1),
  }),
  closing: z.object({
    title: text,
    description: text,
    product_cta: cta_schema,
    kodecol_cta: cta_schema,
    note: text,
  }),
});

export const product_brand_schema: z.ZodType<ProductBrand> = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "el slug va en kebab-case: axi-connect"),
  name: text,
  isotype_src: asset_src,
  wordmark_src: asset_src,
  gallery: z.array(asset_src).min(4, "el campo 3D necesita al menos 4 piezas"),
  theme: theme_schema,
  teaser: teaser_schema,
  detail: detail_schema,
  /* Mismas longitudes SEO que los perfiles: ver developer_profile_schema.ts. */
  seo: z.object({
    title: z.string().min(1).max(55, "con el sufijo \" · Kodecol\" el title pasaría de 65 y la SERP lo truncaría"),
    description: z
      .string()
      .min(70, "una description de menos de 70 caracteres desaprovecha el snippet")
      .max(165, "la description se trunca en la SERP pasados ~165 caracteres"),
    keywords: z.array(text).min(1).optional(),
    application_category: text.optional(),
  }),
});
