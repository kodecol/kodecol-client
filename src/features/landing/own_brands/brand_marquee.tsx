import { cn } from "@/shared/lib/cn";

/**
 * Campo 3D de capturas del producto: un plano gigante inclinado del que solo se
 * ve una porción, con las columnas derivando en sentidos opuestos.
 *
 * Es 100% CSS (keyframes `kc-drift-*` en globals.css), así que va como server
 * component: cero JavaScript en el cliente. `prefers-reduced-motion` lo detiene
 * gracias al bloque global de globals.css.
 *
 * Dentro del mundo de Kodecol la imaginería se pinta en duotono verde
 * (`mix-blend-mode: color`): toma el tono corporativo y conserva la luminancia,
 * así que se sigue leyendo qué es cada captura sin traer el color de la marca invitada.
 */

const COLUMNS = 4;
const TILES_PER_COLUMN = 5;

interface BrandMarqueeProps {
  images: readonly string[];
  className?: string;
}

/** Reparte las capturas en columnas rotando el punto de inicio, para que dos
 *  repeticiones de la misma pieza nunca queden lado a lado. */
function build_columns(images: readonly string[]): string[][] {
  return Array.from({ length: COLUMNS }, (_, column) =>
    Array.from(
      { length: TILES_PER_COLUMN },
      (_, row) => images[(column * 3 + row * COLUMNS) % images.length],
    ),
  );
}

export function BrandMarquee({ images, className }: BrandMarqueeProps) {
  const columns = build_columns(images);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[680px] overflow-hidden opacity-50",
        /* Duotono corporativo sobre la imaginería de la marca invitada */
        "after:absolute after:inset-0 after:z-[2] after:bg-green-600 after:mix-blend-color after:content-['']",
        /* El campo está a unas tres pantallas de scroll y anima en bucle:
           content-visibility deja que el navegador se salte su layout y pintado
           mientras está fuera de pantalla. contain-intrinsic-size le da la altura
           reservada para que no haya salto cuando entra. */
        "[contain-intrinsic-size:680px] [content-visibility:auto]",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-[.55] sm:scale-[.8] lg:scale-[1.15]">
          <div className="relative right-[8%] top-[240px] grid size-full origin-top-left grid-cols-4 gap-8 [transform:rotateX(55deg)_rotateZ(-45deg)] [transform-style:preserve-3d]">
            {columns.map((column, column_index) => (
              <div
                key={column_index}
                className={cn(
                  /* Sin will-change: una animación de `transform` ya promueve la capa
                     sola, y dejarlo fijo mantiene cuatro capas en memoria de GPU
                     durante toda la vida de la página. */
                  "flex flex-col items-start gap-8",
                  column_index % 2 === 0
                    ? "animate-kc-drift-down"
                    : "animate-kc-drift-up",
                )}
              >
                {column.map((image, tile_index) => (
                  <div
                    key={`${column_index}-${tile_index}`}
                    className="aspect-[970/700] w-full rounded-[10px] bg-cover bg-center shadow-[0_0_0_1px_rgba(255,255,255,.07),0_18px_40px_rgba(0,0,0,.45)]"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
