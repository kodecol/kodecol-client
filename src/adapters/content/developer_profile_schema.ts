import { z } from "zod";
import type { DeveloperProfile } from "@/core/domain/developer_profile";

/*
  Schema zod espejo del dominio: la anotación z.ZodType<DeveloperProfile> hace que
  el compilador falle si el schema y el dominio divergen. El dominio manda;
  zod es el guardián de la frontera JSON (validación fail-fast en build).
*/

const metric_schema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const skill_group_schema = z.object({
  title: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
});

const experience_schema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  location: z.string(),
  description: z.string().min(1),
  initially_visible: z.boolean(),
});

const education_schema = z.object({
  title: z.string().min(1),
  institution: z.string().min(1),
  period: z.string(),
});

const certificate_schema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
});

const language_schema = z.object({
  language: z.string().min(1),
  level: z.string().min(1),
});

const project_schema = z.object({
  title: z.string().min(1),
  badge: z.string(),
  description: z.string().min(1),
  chips: z.array(z.string().min(1)),
  featured: z.boolean(),
});

const contact_schema = z.object({
  whatsapp_number: z.string().regex(/^\d{10,15}$/, "solo dígitos, con indicativo"),
  email: z.string().email(),
  linkedin_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
});

/*
  Longitudes SEO: el <title> se renderiza como "%s · Kodecol" (layout.tsx), así
  que el máximo deja sitio al sufijo antes de que la SERP lo trunque (~65). La
  description se corta pasados ~165 caracteres.
*/
const seo_schema = z.object({
  title: z.string().min(1).max(55, "con el sufijo \" · Kodecol\" el title pasaría de 65 y la SERP lo truncaría"),
  description: z
    .string()
    .min(70, "una description de menos de 70 caracteres desaprovecha el snippet")
    .max(165, "la description se trunca en la SERP pasados ~165 caracteres"),
  keywords: z.array(z.string().min(1)).min(1).optional(),
});

export const developer_profile_schema: z.ZodType<DeveloperProfile> = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug en kebab-case"),
  full_name: z.string().min(1),
  short_name: z.string().min(1),
  role_badge: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  photo_src: z
    .string()
    .startsWith("/images/", "las fotos viven en public/images/")
    .nullable(),
  cv_src: z.string().startsWith("/cv/", "los CV viven en public/cv/"),
  metrics: z.array(metric_schema).length(3, "el hero muestra exactamente 3 métricas"),
  about: z.string().min(1),
  skill_groups: z
    .array(skill_group_schema)
    .length(4, "el mockup define 4 grupos de skills"),
  experience: z
    .array(experience_schema)
    .min(1)
    .refine(
      (entries) => entries.some((entry) => entry.initially_visible),
      "al menos una experiencia debe ser visible",
    ),
  education: z.array(education_schema),
  certificates: z.array(certificate_schema),
  languages: z.array(language_schema),
  soft_skills: z.array(z.string().min(1)),
  projects: z
    .array(project_schema)
    .min(1)
    .refine(
      (projects) => projects.filter((project) => project.featured).length === 1,
      "debe haber exactamente 1 proyecto destacado",
    ),
  contact: contact_schema,
  seo: seo_schema,
});
