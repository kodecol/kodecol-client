/**
 * Enlace de salto al contenido: primer elemento focalizable de la página.
 *
 * Sin él, quien navega con teclado tiene que tabular por todo el navbar en cada
 * página. Está oculto hasta recibir el foco (`sr-only` + `focus:not-sr-only`).
 *
 * `globals.css` ya aplica `scroll-margin-top` a los elementos con `id`, así que
 * el destino no queda tapado por el navbar fijo.
 */

/** id del <main> de todas las plantillas. Destino del salto. */
export const MAIN_CONTENT_ID = "contenido";

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-mint-500 focus:px-5 focus:py-3 focus:font-sora focus:text-sm focus:font-semibold focus:text-text-on-accent"
    >
      Saltar al contenido
    </a>
  );
}
