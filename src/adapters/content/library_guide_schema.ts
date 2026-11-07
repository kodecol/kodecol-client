import { z } from "zod";

/*
  Esquema de content/biblioteca/guias/*.json. Un campo mal escrito rompe
  `pnpm build` con el error de zod señalando el campo: es el control de calidad
  del contenido.
*/

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug en minúsculas con guiones");

const line = z.object({
  lead: z.string().min(1).optional(),
  text: z.string().min(1),
  link: z.object({ label: z.string().min(1), href: z.url() }).optional(),
});

const step = z.object({ title: z.string().min(1), text: z.string().min(1) });

const token = z.string().regex(/^\[[^\]]+\]$/, "un corchete completo, como [tu negocio]");

export const library_guide_schema = z
  .object({
    slug,
    piece: z.string().min(1),
    title: z.string().min(1),
    title_keyword: z.string().min(1),
    summary: z.string().min(1),
    intro: z.string().min(1),
    topic: z.enum(["video-con-ia", "automatizacion", "agentes-de-ia", "software-y-apps"]),
    level: z.enum(["principiante", "intermedio", "avanzado"]),
    duration: z.string().min(1),
    made_with: z.array(z.string().min(1)).min(1),
    published_at: z.iso.date(),
    video_seconds: z.object({ result: z.int().positive(), published: z.int().positive() }),
    before_you_start: z.array(line).min(1),
    prompt: z.object({
      quick: z.string().min(1),
      full: z.string().min(1),
      fields: z
        .array(
          z.object({
            id: slug,
            label: z.string().min(1),
            placeholder: z.string().min(1),
            tokens: z.array(token).min(1),
          }),
        )
        .min(1),
    }),
    steps: z.array(step).min(3),
    sources: z.object({
      title: z.string().min(1),
      groups: z.array(z.object({ title: z.string().min(1), items: z.array(line).min(1) })).min(1),
      rule: z.string().min(1),
    }),
    lessons: z.array(step).min(3),
    download: z.object({
      title: z.string().min(1),
      text: z.string().min(1),
      usage: z.string().min(1),
    }),
    closing: z.object({
      title: z.string().min(1),
      title_keyword: z.string().min(1),
      text: z.string().min(1),
      whatsapp_message: z.string().min(1),
    }),
    related: z.array(slug),
    legal: z.string().min(1),
    seo: z.object({
      title: z.string().min(1).max(70),
      description: z.string().min(50).max(170),
    }),
  })
  .superRefine((guide, ctx) => {
    if (!guide.title.includes(guide.title_keyword)) {
      ctx.addIssue({ code: "custom", path: ["title_keyword"], message: "debe aparecer tal cual en title" });
    }
    if (!guide.closing.title.includes(guide.closing.title_keyword)) {
      ctx.addIssue({ code: "custom", path: ["closing", "title_keyword"], message: "debe aparecer tal cual en closing.title" });
    }
    /* Un campo del personalizador que no está en ningún prompt no haría nada. */
    for (const [index, field] of guide.prompt.fields.entries()) {
      const used = field.tokens.some((t) => guide.prompt.quick.includes(t) || guide.prompt.full.includes(t));
      if (!used) {
        ctx.addIssue({ code: "custom", path: ["prompt", "fields", index], message: "ninguno de sus corchetes aparece en los prompts" });
      }
    }
  });
