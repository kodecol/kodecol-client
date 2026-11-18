/**
 * Espejo en TypeScript de los tokens de color del @theme (globals.css), para lo
 * que se pinta en canvas o WebGL: el carrusel warp, el gradiente vivo y el
 * agujero negro. Un shader no puede leer una clase de Tailwind.
 *
 * Es la única copia permitida de valores de color fuera de globals.css
 * (architecture.md §7). Si cambia un token, se cambia aquí también.
 */
export const CANVAS_PALETTE = {
  bg: "#04110f",
  surface_1: "#081a16",
  surface_2: "#0c2320",
  surface_inset: "#02100d",
  green_50: "#eafbf6",
  green_200: "#93e8d4",
  green_300: "#54d8bb",
  green_400: "#18bd9a",
  green_500: "#009a7b",
  green_600: "#00735c",
  green_700: "#015e4f",
  green_800: "#014b4d",
  green_900: "#013a3b",
  green_950: "#002c2c",
  mint_300: "#7ff0c6",
  mint_500: "#34e0a1",
  cream_200: "#ede6d6",
  cream_ink: "#f6f2e8",
} as const;
