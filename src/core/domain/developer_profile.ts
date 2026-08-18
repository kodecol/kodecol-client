/**
 * Modelo de dominio del perfil de desarrollador.
 * TypeScript puro: este módulo no importa nada (regla del hexágono).
 * El schema zod del adaptador está anclado a estos tipos: si divergen, el compilador falla.
 */

export interface ProfileMetric {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  skills: readonly string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  /** Las entradas no destacadas se colapsan tras el botón "Ver más". */
  initially_visible: boolean;
}

export interface EducationEntry {
  title: string;
  institution: string;
  period: string;
}

export interface CertificateEntry {
  title: string;
  issuer: string;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export interface ProjectHighlight {
  title: string;
  badge: string;
  description: string;
  chips: readonly string[];
  /** El proyecto destacado ocupa la tarjeta grande. */
  featured: boolean;
}

export interface ProfileContact {
  whatsapp_number: string;
  email: string;
  linkedin_url: string | null;
  github_url: string | null;
}

export interface ProfileSeo {
  title: string;
  description: string;
  /** Palabras clave de la página. Google las ignora; Bing y Yandex no. */
  keywords?: readonly string[];
}

export interface DeveloperProfile {
  slug: string;
  full_name: string;
  /** Nombre corto para migas/labels. */
  short_name: string;
  role_badge: string;
  tagline: string;
  location: string;
  photo_src: string | null;
  cv_src: string;
  metrics: readonly ProfileMetric[];
  about: string;
  skill_groups: readonly SkillGroup[];
  experience: readonly ExperienceEntry[];
  education: readonly EducationEntry[];
  certificates: readonly CertificateEntry[];
  languages: readonly LanguageEntry[];
  soft_skills: readonly string[];
  projects: readonly ProjectHighlight[];
  contact: ProfileContact;
  seo: ProfileSeo;
}
