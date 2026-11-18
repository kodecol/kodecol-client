import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Fireflies } from "@/shared/ui/fireflies";
import { StaticPicture, type StaticPictureSource } from "@/shared/ui/static_picture";

/** Una capa de la escena: ruta sin extensión, con sus variantes AVIF/WebP. */
export interface SceneLayer {
  src_base: string;
  fallback_extension: "png" | "jpg";
  width: number;
  height: number;
}

interface LayeredSceneProps {
  /** Fondo: el render completo de la pradera. */
  background: SceneLayer;
  /** Objeto recortado (CRT, celular, personas) con alfa, mismo encuadre que el fondo. */
  foreground?: SceneLayer;
  /** Versiones verticales para celular (dirección de arte). */
  mobile_background?: string;
  mobile_foreground?: string;
  /** `object-position` compartido por las dos capas para que calcen. */
  object_position?: string;
  /** Va entre el fondo y el objeto: la palabra gigante. */
  word?: ReactNode;
  fireflies?: boolean;
  priority?: boolean;
  className?: string;
  /** Clases extra para las imágenes (p. ej. una máscara de fundido). */
  layer_class_name?: string;
  layer_style?: CSSProperties;
  style?: CSSProperties;
  /** Contenido por encima de todo (copy, velos, CTAs). */
  children?: ReactNode;
}

const MOBILE_MEDIA = "(max-width: 700px)";

/**
 * Escena en capas de la dirección orgánica (DESIGN.md §4, regla de capas):
 * fondo fotográfico → luciérnagas → palabra gigante → objeto recortado → contenido.
 *
 * Así la palabra pasa *detrás* del computador o de la persona, como en los videos
 * de Kodecol (K-24). Las dos imágenes comparten tamaño y `object-position`, así
 * que el recorte calza exacto con el fondo a cualquier ancho.
 *
 * Server component: solo las hojas (luciérnagas, palabra) llevan JS.
 */
export function LayeredScene({
  background,
  foreground,
  mobile_background,
  mobile_foreground,
  object_position = "50% 50%",
  word,
  fireflies = false,
  priority = false,
  className,
  layer_class_name,
  layer_style,
  style,
  children,
}: LayeredSceneProps) {
  const sources = (base?: string): StaticPictureSource[] =>
    base ? [{ media: MOBILE_MEDIA, src_base: base }] : [];
  const layer = { objectPosition: object_position, ...layer_style };

  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={style}>
      <StaticPicture
        src_base={background.src_base}
        fallback_extension={background.fallback_extension}
        width={background.width}
        height={background.height}
        alt=""
        fill
        priority={priority}
        sources={sources(mobile_background)}
        className={cn("z-0 object-cover", layer_class_name)}
        style={layer}
      />
      {fireflies ? <Fireflies className="z-[1]" /> : null}
      {word}
      {foreground ? (
        <StaticPicture
          src_base={foreground.src_base}
          fallback_extension={foreground.fallback_extension}
          width={foreground.width}
          height={foreground.height}
          alt=""
          fill
          priority={priority}
          sources={sources(mobile_foreground)}
          className={cn("pointer-events-none z-[3] object-cover", layer_class_name)}
          style={layer}
        />
      ) : null}
      {children}
    </div>
  );
}
