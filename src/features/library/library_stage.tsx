import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { Fireflies } from "@/shared/ui/fireflies";
import { GiantWord } from "@/shared/ui/giant_word";
import { SkyClouds } from "@/shared/ui/sky_clouds";
import { StaticPicture } from "@/shared/ui/static_picture";
import { Backdrop, type BackdropMedia } from "./backdrop";

interface LibraryStageProps {
  /** id del <h1>/<h2> real (el lockup es decorativo). */
  labelled_by: string;
  /** El titular real para lectores de pantalla y buscadores. */
  heading: ReactNode;
  heading_level?: "h1" | "h2";
  backdrop: BackdropMedia;
  priority?: boolean;
  /** Lo que va arriba del lockup (eyebrow, nombre). */
  top?: ReactNode;
  /** Entrada en serif itálica. */
  entry: string;
  /** Palabra gigante (Inter Tight 900, desenfocada) que pasa DETRÁS del objeto. */
  word: string;
  /** El objeto delante de la palabra: el computador, los celulares, el isotipo. */
  object: ReactNode;
  /** Copy y acciones bajo el lockup. */
  children?: ReactNode;
  compact?: boolean;
  /**
   * "night": el bucle de la pradera desenfocado (por defecto). "day": cielo azul
   * con nubes (atmósfera Cielo) y un horizonte de noche que se curva al final y
   * recibe el texto: de ahí en adelante la página sigue en verde oscuro.
   */
  atmosphere?: "night" | "day";
  /** Tamaño de la palabra gigante (las palabras cortas, como «IA.», piden más). */
  word_size?: string;
  /** Qué fracción de la palabra queda a la vista sobre el objeto (0–1). */
  word_reveal?: number;
}

/**
 * Escenario de la Biblioteca con la estética motion de Kodecol (K-24), la misma
 * del inicio: entrada en serif, palabra gigante desenfocada que pasa detrás del
 * objeto y, al fondo, el bucle de la pradera muy desenfocado (profundidad de
 * campo) con luciérnagas.
 *
 * El objeto es DOM (un computador recortado, celulares con video), así que la
 * palabra queda detrás sin necesidad de recortar el video de fondo.
 */
export function LibraryStage({
  labelled_by,
  heading,
  heading_level = "h1",
  backdrop,
  priority = false,
  top,
  entry,
  word,
  object,
  children,
  compact = false,
  atmosphere = "night",
  word_size,
  word_reveal,
}: LibraryStageProps) {
  const Heading = heading_level;
  const day = atmosphere === "day";
  const classes = ["lib-stage", compact && "lib-stage--compact", day && "lib-stage--day"].filter(Boolean).join(" ");
  const lockup_style = {
    ...(word_size ? { "--lib-gw": word_size } : {}),
    ...(word_reveal ? { "--lib-reveal": String(word_reveal) } : {}),
  } as CSSProperties;
  return (
    <section className={classes} aria-labelledby={labelled_by}>
      {day ? (
        <div className="lib-day-sky" aria-hidden="true">
          <StaticPicture
            src_base="/images/scenes/sky_desktop"
            fallback_extension="jpg"
            width={1600}
            height={900}
            alt=""
            fill
            priority={priority}
            className="object-cover object-[50%_100%]"
          />
          <SkyClouds />
        </div>
      ) : (
        <>
          <Backdrop media={backdrop} priority={priority} className="lib-stage-backdrop" />
          <div className="lib-stage-veil" aria-hidden="true" />
          <Fireflies className="z-[1]" />
        </>
      )}
      <div className="lib-wrap lib-stage-in">
        <Heading id={labelled_by} className="sr-only">
          {heading}
        </Heading>
        {top}
        <p className="lib-stage-entry" aria-hidden="true">
          {entry}
        </p>
        <div className="lib-stage-lockup" style={lockup_style}>
          <div className="lib-stage-word">
            <GiantWord text={word} appear="load" />
          </div>
          <div className="lib-stage-object">{object}</div>
        </div>
        {children && !day ? <div className="lib-stage-copy">{children}</div> : null}
      </div>
      {children && day ? (
        /* El horizonte de noche: se curva sobre el cielo y recibe el texto. */
        <div className="lib-night-rise">
          <div className="lib-wrap lib-stage-copy">{children}</div>
        </div>
      ) : null}
    </section>
  );
}

/**
 * Parte un titular en el lockup: lo que va antes de la palabra clave es la
 * entrada en serif; la palabra clave (y lo que la siga) es la palabra gigante.
 * «Presione uno: la contestadora contra quien sí contesta» + «contesta» →
 * entrada «la contestadora contra quien sí», palabra «contesta.».
 */
export function split_lockup(title: string, keyword: string): { entry: string; word: string } {
  const after_colon = title.includes(":") ? title.slice(title.indexOf(":") + 1).trim() : title;
  const at = after_colon.lastIndexOf(keyword);
  if (at < 0) return { entry: after_colon, word: keyword };
  const tail = after_colon.slice(at + keyword.length).trim();
  const word = `${keyword}${tail}`;
  return { entry: after_colon.slice(0, at).trim(), word: /[.?!]$/.test(word) ? word : `${word}.` };
}
