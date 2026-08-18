import { cn } from "@/shared/lib/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Superficie más opaca para bloques con texto largo (regla de DESIGN.md §4). */
  strong?: boolean;
  /** Eleva la tarjeta en hover (borde menta + translateY). */
  interactive?: boolean;
  /**
   * Etiqueta a renderizar. `article` cuando la tarjeta es contenido autónomo
   * (un servicio, un proyecto, una persona): da un landmark real al lector de
   * pantalla y le dice al buscador dónde empieza y acaba cada pieza.
   */
  as?: "div" | "article" | "li";
}

/** Superficie de vidrio estándar: fondo translúcido + blur + borde hairline + luz cenital. */
export function GlassCard({
  strong = false,
  interactive = false,
  as: Tag = "div",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border-default shadow-glass backdrop-blur-[18px]",
        strong ? "bg-glass-fill-strong" : "bg-glass-fill",
        interactive &&
          "transition-[transform,border-color,background-color] duration-base ease-kodecol hover:-translate-y-1 hover:border-border-accent hover:bg-surface-3/60",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
