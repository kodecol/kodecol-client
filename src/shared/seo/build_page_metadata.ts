import type { Metadata } from "next";
import { SITE_CONFIG } from "@/shared/config/site_config";
import { build_absolute_url } from "./urls";

export interface PageMetadataInput {
  /** Sin el sufijo de marca: lo añade el `title.template` del layout. */
  title: string;
  description: string;
  /** Ruta canónica. `null` = página sin URL propia (404): sin canonical ni og:url. */
  path: string | null;
  /** `profile` para personas, `article` para contenido fechado, `website` por defecto. */
  og_type?: "website" | "article" | "profile";
  /** Ruta relativa del PNG 1200×630. Si falta se usa la OG global del layout. */
  og_image_path?: string;
  og_image_alt?: string;
  keywords?: readonly string[];
  indexable?: boolean;
}

/**
 * Constructor único de la metadata de una página.
 *
 * OJO, comportamiento de Next que justifica que esto exista: un `page.tsx` que
 * define `openGraph` o `twitter` REEMPLAZA el objeto entero del layout — no hay
 * merge campo a campo. Por eso aquí se re-emiten siempre `siteName`, `locale`,
 * `type` e `images`; si no, definir un solo campo perdería todos los demás.
 */
export function build_page_metadata(input: PageMetadataInput): Metadata {
  const canonical = input.path === null ? null : build_absolute_url(input.path);
  /* El template solo aplica a `title`; og:title y twitter:title se arman a mano. */
  const social_title = `${input.title} · ${SITE_CONFIG.name}`;
  const images = input.og_image_path
    ? [
        {
          /* Relativa: `metadataBase` del layout la vuelve absoluta. */
          url: input.og_image_path,
          width: 1200,
          height: 630,
          alt: input.og_image_alt ?? social_title,
          type: "image/png",
        },
      ]
    : undefined;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords ? [...input.keywords] : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: social_title,
      description: input.description,
      url: canonical ?? undefined,
      siteName: SITE_CONFIG.name,
      locale: "es_CO",
      type: input.og_type ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: social_title,
      description: input.description,
      images,
    },
    /*
      Con `indexable: false` no se emite NADA. La única página que lo usa es el
      404, y Next ya le añade su propio <meta name="robots" content="noindex">;
      añadir el nuestro dejaba dos etiquetas robots contradictorias en el mismo
      <head>. Menos es más aquí.
    */
    robots:
      input.indexable === false
        ? undefined
        : {
            index: true,
            follow: true,
            /* Miniatura grande y snippet sin recortar en la SERP: gratis y sube el CTR. */
            googleBot: {
              index: true,
              follow: true,
              "max-image-preview": "large",
              "max-snippet": -1,
              "max-video-preview": -1,
            },
          },
  };
}
