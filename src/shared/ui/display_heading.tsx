import { cn } from "@/shared/lib/cn";

interface DisplayHeadingProps {
  id: string;
  /** Frase directa en Inter Tight… */
  lead: string;
  /** …y su remate en Instrument Serif itálica (KNOWLEDGE_BASE §8.3). */
  accent: string;
  as?: "h1" | "h2" | "h3";
  /** Pinta el remate en su propia línea. */
  accent_block?: boolean;
  className?: string;
  accent_class_name?: string;
}

/**
 * Titular de la dirección orgánica: frase directa + remate en serif itálica.
 * Es el patrón de copy de Kodecol hecho tipografía (DESIGN.md §8).
 */
export function DisplayHeading({
  id,
  lead,
  accent,
  as: Tag = "h2",
  accent_block = false,
  className,
  accent_class_name,
}: DisplayHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "text-balance font-display font-extrabold leading-none tracking-[-0.045em]",
        className,
      )}
    >
      {lead}{" "}
      <em
        className={cn(
          "font-serif text-[1.06em] font-normal italic tracking-[-0.01em]",
          accent_block && "block",
          accent_class_name,
        )}
      >
        {accent}
      </em>
    </Tag>
  );
}
