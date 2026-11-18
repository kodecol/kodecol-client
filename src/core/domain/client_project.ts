/**
 * Modelo de dominio de un proyecto hecho para un cliente (The Brothers Inc,
 * Neon Night, Ducks Machine…). Es la prueba social de la fábrica de software:
 * trabajo real, en línea o en construcción.
 * TypeScript puro: este módulo no importa nada (regla del hexágono).
 * El schema zod del adaptador está anclado a estos tipos.
 */

export type ProjectStatus = "live" | "building";

/** Una imagen de contenido: ruta SIN extensión, con variantes AVIF/WebP generadas. */
export interface ProjectImage {
  src_base: string;
  fallback_extension: "png" | "jpg";
  width: number;
  height: number;
  alt: string;
}

/**
 * Escena de la pradera con el computador retro mostrando el sitio del cliente.
 * Lleva la frase motion de Kodecol (K-24): entrada en serif, palabra gigante
 * detrás del computador y remate.
 */
export interface ProjectScene {
  background: ProjectImage;
  /** El computador recortado con alfa, mismo encuadre que el fondo. */
  foreground: ProjectImage;
  entry: string;
  word: string;
  remate: string;
  /** Altura de la palabra gigante en la escena, en % (dónde no la tapa el CRT). */
  word_top: number;
}

/** Callout técnico sobre la captura de portada: marcador en (x, y) en %. */
export interface ProjectCallout {
  side: "left" | "right";
  x: number;
  y: number;
  kicker: string;
  title: string;
  description: string;
}

/** Recuadro punteado que señala una zona de la captura. */
export interface ProjectCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface ProjectNote {
  title: string;
  description: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ClientProject {
  slug: string;
  /** Posición en la landing y en /proyectos. */
  order: number;
  name: string;
  sector: string;
  city: string;
  year: string;
  status: ProjectStatus;
  /** Dominio público, o null si todavía no está publicado. */
  site_url: string | null;
  scene: ProjectScene;
  /** Lo que se ve en la tarjeta de la landing. */
  teaser: {
    accent: string;
    summary: string;
    bullets: readonly string[];
    chips: readonly string[];
  };
  /** La ficha del proyecto. */
  detail: {
    headline_lead: string;
    headline_accent: string;
    summary: string;
    desktop_shots: readonly ProjectImage[];
    mobile_shot: ProjectImage;
    callouts: readonly ProjectCallout[];
    crop: ProjectCrop;
    mobile_notes: readonly ProjectNote[];
    flow: readonly ProjectNote[];
    spec: readonly ProjectSpec[];
  };
  seo: {
    title: string;
    description: string;
  };
}
