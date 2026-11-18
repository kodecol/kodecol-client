/**
 * Modelo de dominio de una marca propia de Kodecol (producto construido y operado
 * por la casa, con identidad propia: Axi Connect, y los que vengan).
 * TypeScript puro: este módulo no importa nada (regla del hexágono).
 * El schema zod del adaptador está anclado a estos tipos: si divergen, el compilador falla.
 */

/**
 * Paleta de la marca invitada. Es **contenido, no design system**: cada producto
 * trae la suya y se aplica como variables CSS acotadas a su página de detalle.
 * Fuera de esa página manda la marca corporativa de Kodecol.
 */
export interface BrandTheme {
  ground: string;
  surface: string;
  surface_raised: string;
  accent: string;
  accent_soft: string;
  ink: string;
  ink_muted: string;
  ink_dim: string;
  line: string;
  /** Acentos secundarios de la marca (en Axi: violeta y ámbar de la α). */
  accent_2?: string;
  accent_3?: string;
}

/** Imagen de contenido: ruta SIN extensión, con variantes AVIF/WebP generadas. */
export interface BrandImage {
  src_base: string;
  fallback_extension: "png" | "jpg";
  width: number;
  height: number;
  alt: string;
}

/** Clip corto de la interfaz real (mp4 en bucle, sin audio). */
export interface BrandClip {
  src: string;
  poster: string;
  caption: string;
}

/**
 * Cómo se presenta la marca en la landing de Kodecol: una escena de la pradera
 * con el producto (la palabra gigante pasa detrás), una prueba real y las cifras
 * que van en el carrusel.
 */
export interface BrandShowcase {
  scene: {
    background: BrandImage;
    foreground: BrandImage;
    entry: string;
    word: string;
  };
  headline_lead: string;
  headline_accent: string;
  summary: string;
  proof: {
    label: string;
    steps: readonly { time: string; label: string }[];
    footnote: string;
  };
  /** Valores de `detail.metrics.items` que van en el carrusel, en orden. */
  metric_values: readonly string[];
  metrics_caption: string;
}

export interface BrandCta {
  label: string;
  href: string;
  external: boolean;
}

export interface BrandPrinciple {
  title: string;
  description: string;
}

export interface BrandMetric {
  value: string;
  label: string;
  /** Las destacadas se pintan con el acento de la marca. */
  featured: boolean;
}

export interface BrandStackGroup {
  title: string;
  items: readonly string[];
}

export interface BrandPilot {
  name: string;
  sector: string;
  description: string;
  figure: string;
}

export interface BrandSection {
  eyebrow: string;
  title: string;
}

/** Lo que se ve en la tarjeta de la landing, con la marca corporativa. */
export interface BrandTeaser {
  kind: string;
  status: string;
  claim_lead: string;
  claim_accent: string;
  summary: string;
  chips: readonly string[];
  cta_label: string;
  showcase?: BrandShowcase;
}

/** El contenido de la página de detalle, ya en la marca del producto. */
export interface BrandDetail {
  eyebrow: string;
  headline_lead: string;
  headline_accent: string;
  description: string;
  chips: readonly string[];
  primary_cta: BrandCta;
  /** Captura real del producto en el héroe. */
  hero_capture?: BrandImage & { caption: string };
  /** Notas flotantes sobre la captura (lo que pasa en una venta). */
  hero_notes?: readonly { title: string; description: string }[];
  /** Una venta real, paso a paso. */
  journey?: BrandSection & {
    description: string;
    steps: readonly { time: string; text: string }[];
  };
  /** Los pilares del producto, cada uno con su clip de la interfaz. */
  pillars?: readonly {
    label: string;
    tone: "accent" | "accent_2" | "accent_3";
    title: string;
    description: string;
    clip: BrandClip;
  }[];
  /** Canales y su estado real (sin prometer lo que no hay). */
  channels?: readonly { name: string; status: string; live: boolean }[];
  origin: BrandSection & { paragraphs: readonly string[] };
  principles: BrandSection & {
    quote_lead: string;
    quote_accent: string;
    items: readonly BrandPrinciple[];
    clip?: BrandClip;
  };
  metrics: BrandSection & {
    description: string;
    items: readonly BrandMetric[];
  };
  stack: BrandSection & { groups: readonly BrandStackGroup[] };
  pilots: BrandSection & {
    description: string;
    items: readonly BrandPilot[];
  };
  closing: {
    title: string;
    description: string;
    product_cta: BrandCta;
    kodecol_cta: BrandCta;
    note: string;
  };
}

export interface BrandSeo {
  title: string;
  description: string;
  /** Palabras clave de la página. Google las ignora; Bing y Yandex no. */
  keywords?: readonly string[];
  /** Categoría schema.org del producto. Por defecto `BusinessApplication`. */
  application_category?: string;
}

export interface ProductBrand {
  slug: string;
  name: string;
  isotype_src: string;
  wordmark_src: string;
  /** Capturas del producto: alimentan el campo 3D de la landing. */
  gallery: readonly string[];
  theme: BrandTheme;
  teaser: BrandTeaser;
  detail: BrandDetail;
  seo: BrandSeo;
}
