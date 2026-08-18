import { cn } from "@/shared/lib/cn";

interface StaticPictureProps {
  /** Ruta SIN extensión: `/images/team/cristian_hero`. */
  src_base: string;
  /** Extensión del archivo original, que actúa de último recurso. */
  fallback_extension?: "png" | "jpg";
  alt: string;
  /** Dimensiones intrínsecas a 1x. Obligatorias: sin ellas hay salto de layout (CLS). */
  width: number;
  height: number;
  /** Solo en la imagen que es el LCP real de la página. */
  priority?: boolean;
  className?: string;
  /** Rellena al contenedor (que debe ser `relative`), como el `fill` de next/image. */
  fill?: boolean;
  /** Para efectos que no tienen clase de Tailwind, como `mask-image`. */
  style?: React.CSSProperties;
}

/**
 * <picture> con AVIF → WebP → PNG y srcset 1x/2x.
 *
 * Existe porque next.config.ts declara `images: { unoptimized: true }` —obligado
 * por `output: "export"`—, y en ese modo next/image emite un <img> sin srcset y
 * sin conversión de formato: el navegador se traga el original a resolución
 * nativa. Las variantes las precalcula scripts/generate_image_variants.mjs.
 *
 * No sustituye a next/image en general: es para las imágenes de contenido
 * pesadas, donde la diferencia se mide en megabytes.
 */
export function StaticPicture({
  src_base,
  fallback_extension = "png",
  alt,
  width,
  height,
  priority = false,
  className,
  fill = false,
  style,
}: StaticPictureProps) {
  const srcset = (extension: string) =>
    `${src_base}.${extension} 1x, ${src_base}@2x.${extension} 2x`;

  return (
    <picture>
      <source type="image/avif" srcSet={srcset("avif")} />
      <source type="image/webp" srcSet={srcset("webp")} />
      <img
        src={`${src_base}.${fallback_extension}`}
        alt={alt}
        /* alt="" ya marca la imagen como decorativa; aria-hidden lo refuerza
           para los lectores que igualmente la anunciarían. */
        aria-hidden={alt === "" ? true : undefined}
        width={width}
        height={height}
        /* La imagen del LCP se pide de inmediato; el resto, en diferido. */
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={cn(fill && "absolute inset-0 size-full", className)}
        style={style}
      />
    </picture>
  );
}
